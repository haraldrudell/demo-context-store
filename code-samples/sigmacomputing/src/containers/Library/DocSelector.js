// @flow

import * as React from 'react';

import DocSelector from 'components/DocSelector';
import type { Id, InodeSummaryTy } from 'types';

import FolderView from './FolderView';

type Props = {
  canSelectDoc: InodeSummaryTy => boolean,
  className?: string,
  fetchChartInfo?: boolean,
  initialFolderId: ?Id,
  onSelectDoc: (?InodeSummaryTy) => void
};

const DocSelectorContainer = (props: Props) => {
  const {
    canSelectDoc,
    className,
    fetchChartInfo,
    initialFolderId,
    onSelectDoc
  } = props;
  return (
    <FolderView
      fetchChartInfo={fetchChartInfo}
      initialFolderId={initialFolderId}
    >
      {(loading, folder, onSelectFolder) => (
        <DocSelector
          canSelectDoc={canSelectDoc}
          className={className}
          folder={folder}
          loading={loading}
          onSelectDoc={onSelectDoc}
          onSelectFolder={onSelectFolder}
        />
      )}
    </FolderView>
  );
};

export default DocSelectorContainer;



// WEBPACK FOOTER //
// ./src/containers/Library/DocSelector.js