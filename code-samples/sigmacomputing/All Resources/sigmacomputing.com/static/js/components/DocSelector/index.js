// @flow
import React, { Component } from 'react';

import { Box, Flex } from 'widgets';
import Loading from 'components/widgets/Loading';
import type { FolderDetailsTy, Id, InodeSummaryTy } from 'types';
import FolderPath from './FolderPath';
import FolderList from './FolderList';

type Props = {
  canSelectDoc: InodeSummaryTy => boolean,
  className?: string,
  folder: ?FolderDetailsTy,
  loading: boolean,
  onSelectDoc: (?InodeSummaryTy) => void,
  onSelectFolder: Id => void
};

export default class DocSelector extends Component<
  Props,
  {| selectedDoc: ?string |}
> {
  static defaultProps = {
    className: ''
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedDoc: null
    };
  }

  handleSelectFolder = (id: Id) => {
    this.setState({
      selectedDoc: null
    });
    this.props.onSelectDoc(null);
    this.props.onSelectFolder(id);
  };

  handleSelectDoc = (doc: InodeSummaryTy) => {
    if (doc.type === 'folder') {
      this.handleSelectFolder(doc.inodeId);
    } else {
      this.setState({ selectedDoc: doc.inodeId });
      this.props.onSelectDoc(doc);
    }
  };

  render() {
    const { selectedDoc } = this.state;
    const { canSelectDoc, className, folder } = this.props;

    if (!folder) {
      return (
        <Flex className={className} column flexGrow>
          <Loading text="Loading..." />
        </Flex>
      );
    }

    return (
      <Flex className={className} column flexGrow>
        <Box p={2} bb={1} borderColor="darkBlue4">
          <FolderPath folder={folder} onClickFolder={this.handleSelectFolder} />
        </Box>
        <Box flexGrow css={`overflow-y: auto;`}>
          <FolderList
            canSelectDoc={canSelectDoc}
            folder={folder}
            selected={selectedDoc}
            onSelect={this.handleSelectDoc}
            onEnterFolder={this.handleSelectFolder}
          />
        </Box>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DocSelector/index.js