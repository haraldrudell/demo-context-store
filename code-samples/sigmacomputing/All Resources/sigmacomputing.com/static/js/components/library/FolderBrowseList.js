// @flow

import * as React from 'react';

import { Box, Flex } from 'widgets';
import Loading from 'components/widgets/Loading';
import type { InodeSummaryTy } from 'types';

import FolderBrowseItem from './FolderBrowseItem';

type Props = {|
  contents: ?Array<InodeSummaryTy>,
  onDelete: InodeSummaryTy => void,
  onMove: InodeSummaryTy => void,
  onRename: InodeSummaryTy => void
|};

export default class FolderBrowseList extends React.PureComponent<Props> {
  render() {
    const { contents } = this.props;

    return (
      <Flex column css={`height: 100%; min-width: 500px;`}>
        <Flex
          align="center"
          bb={2}
          borderColor="darkBlue5"
          font="header5"
          px={1}
          py={1}
        >
          <Box width="50%">Name</Box>
          <Box width="20%">Modified</Box>
          <Box width="20%">Owner</Box>
        </Flex>
        <Box flexGrow css={`overflow-y: auto;`}>
          {contents ? (
            contents.map(inode => (
              <FolderBrowseItem
                key={inode.inodeId}
                inode={inode}
                onDelete={this.props.onDelete}
                onMove={this.props.onMove}
                onRename={this.props.onRename}
              />
            ))
          ) : (
            // XXX: Should use laserbeam instead
            <Loading text="Loading..." />
          )}
        </Box>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/library/FolderBrowseList.js