// @flow

import * as React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { sortFilesByType } from 'utils/folders';
import {
  ORG_ROOT_ID,
  getHomeInodeId,
  FolderDetailsFragment,
  InodeSummaryFragment,
  mapInodeSummary
} from 'api/organization';
import type { FolderDetailsTy, Id } from 'types';

// XXX JDF: we should split the folder summary query from the children query so
// we can load them separately
const FolderViewQuery = gql`
  query GetFolderDetails($folderId: UUID!, $fetchCharts: Boolean!, $fetchHome: Boolean!) {
    organization {
      folder(id: $folderId) {
        ...FolderDetailsFragment
        children {
          ... on Worksheet @include(if: $fetchCharts) {
            currentDraft
          }
        }
      }
      # We treat the organization root like it's a child of the user's home folder.
      orgRoot: folder(id: "${ORG_ROOT_ID}") @include(if: $fetchHome) {
        ...InodeSummaryFragment
      }
    }
  }
  ${FolderDetailsFragment}
  ${InodeSummaryFragment}
`;

type ChildTy = (loading: boolean, folder: ?FolderDetailsTy) => React.Node;

type FetcherProps = {|
  // $FlowFixMe: XXX JDF: Flow has some bogus looking error here
  children: ChildTy,
  fetchChartInfo?: boolean,
  folderId: ?Id
|};

export const FolderFetcher: React.ComponentType<
  FetcherProps
> = graphql(FolderViewQuery, {
  options: ({ fetchChartInfo = false, folderId }) => {
    const fetchFolderId = folderId || getHomeInodeId();

    return {
      fetchPolicy: 'cache-and-network',
      variables: {
        fetchCharts: fetchChartInfo,
        fetchHome: fetchFolderId === getHomeInodeId(),
        folderId: fetchFolderId
      }
    };
  },
  props: ({ ownProps, data: { loading, organization } }) => {
    let folder = null;
    if (!loading) {
      const folderId = ownProps.folderId || getHomeInodeId();
      const folderObj = organization.folder;
      const { parent, children } = folderObj;

      const folderChildren = children.map(mapInodeSummary);
      folderChildren.sort(sortFilesByType);

      if (folderId === getHomeInodeId()) {
        folderChildren.unshift({
          ...mapInodeSummary(organization.orgRoot),
          type: 'folder'
        });
      }

      folder = {
        ...mapInodeSummary(folderObj),
        type: 'folder',
        parent: parent
          ? {
              ...mapInodeSummary(parent),
              type: 'folder'
            }
          : null,
        children: folderChildren
      };
    }

    return {
      children: ownProps.children,
      folder,
      loading
    };
  }
})(
  ({
    children,
    loading,
    folder
  }: {
    children: ChildTy,
    loading: boolean,
    folder: ?FolderDetailsTy
  }) => children(loading, folder)
);

type ViewChildTy = (
  loading: boolean,
  folder: ?FolderDetailsTy,
  onSelectFolder: (Id) => void
) => React.Node;

type ViewProps = {|
  // $FlowFixMe: XXX JDF: Flow has some bogus looking error here
  children: ViewChildTy,
  fetchChartInfo?: boolean,
  initialFolderId: ?Id
|};

type ViewState = {|
  currentFolderId: ?Id
|};

export default class FolderView extends React.Component<ViewProps, ViewState> {
  constructor(props: ViewProps) {
    super(props);

    this.state = {
      currentFolderId: props.initialFolderId
    };
  }

  onSelectFolder = (folderId: Id) => {
    this.setState({ currentFolderId: folderId });
  };

  render() {
    const { children, fetchChartInfo } = this.props;
    return (
      <FolderFetcher
        fetchChartInfo={fetchChartInfo}
        folderId={this.state.currentFolderId}
      >
        {(loading, folder) => children(loading, folder, this.onSelectFolder)}
      </FolderFetcher>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Library/FolderView.js