// @flow

import * as React from 'react';
import invariant from 'invariant';

import { Box, Button, IconButton, Icon, Text, Flex } from 'widgets';
import Loading from 'components/widgets/Loading';
import colors from 'styles/colors';
import type { fileListItem, FolderDetailsTy, Id } from 'types';

type Props = {
  folder: ?FolderDetailsTy,
  onAccept: Id => void,
  onCancel: () => void,
  onSelectFolder: Id => void
};

// XXX JDF: we should be using getFileIconType from utils/folders
const getIcon = (type: fileListItem) => {
  switch (type) {
    case 'worksheet':
      return 'worksheet-table';
    case 'dashboard':
      return 'dashboard';
    case 'folder':
      return 'folder-org';
    default:
      throw new Error(`unknown folder type ${type}`);
  }
};

const Entry = ({
  id,
  onClick,
  title,
  type
}: {
  id: Id,
  onClick: ?(SyntheticMouseEvent<HTMLElement>) => void,
  title: string,
  type: fileListItem
}) => (
  <Flex
    data-id={id}
    css={
      onClick &&
      `
        cursor: pointer;
        &:hover {
          background-color: ${colors.lightBlue};
        }
      `
    }
    align="center"
    bb={1}
    borderColor="darkBlue4"
    onClick={onClick}
    p={3}
  >
    <Icon type={getIcon(type)} size="30px" />
    <Box flexGrow mx={3} opacity={onClick ? 1 : 0.4}>
      <Text truncate font="header4">
        {title}
      </Text>
    </Box>
    {type === 'folder' && <Icon type="caret-right" />}
  </Flex>
);

export default class MoveInode extends React.PureComponent<Props> {
  handleAccept = () => {
    const { folder, onAccept } = this.props;
    invariant(folder != null, 'Cannot accept without folder');

    onAccept(folder.inodeId);
  };

  handleFolderClick = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const id = evt.currentTarget.dataset.id;
    this.props.onSelectFolder(id);
  };

  renderHeader(folder: ?FolderDetailsTy) {
    return (
      <Flex
        align="center"
        bb={1}
        borderColor="darkBlue4"
        justify="space-between"
        px={3}
        py={2}
      >
        <Box width="25%">{folder ? this.renderParentPath(folder) : null}</Box>
        <Box width="50%">
          <Text align="center" font="bodyMedium">
            Choose a Destination
          </Text>
          <Text align="center" font="header3" truncate>
            {folder ? folder.name : <span>&nbsp;</span>}
          </Text>
        </Box>
        <Flex width="25%" justify="flex-end">
          <IconButton onClick={this.props.onCancel} size="16px" type="close" />
        </Flex>
      </Flex>
    );
  }

  renderParentPath(folder: FolderDetailsTy) {
    const { parent } = folder;
    return (
      parent && (
        <Flex
          data-id={parent.inodeId}
          css={`cursor: pointer;`}
          align="center"
          color="blue"
          onClick={this.handleFolderClick}
        >
          <Icon mr={2} size="10px" type="caret-left" />
          <Text font="header4" truncate>
            {parent.name}
          </Text>
        </Flex>
      )
    );
  }

  renderFooter() {
    const { folder } = this.props;

    return (
      <Flex
        css={`border-bottom-radius: 4px;`}
        align="center"
        bg="darkBlue6"
        borderColor="darkBlue4"
        bt={1}
        justify="space-between"
        px={3}
        py={2}
      >
        <Text color="darkBlue5" font="header4" pl={2}>
          Create Folder
        </Text>
        <div>
          <Button onClick={this.props.onCancel} type="secondary">
            Cancel
          </Button>
          <Button
            disabled={!folder}
            ml={2}
            onClick={this.handleAccept}
            type="primary"
          >
            Move
          </Button>
        </div>
      </Flex>
    );
  }

  render() {
    const { folder } = this.props;
    return (
      <div>
        {this.renderHeader(folder)}
        <div
          css={`
            height: 40vh;
            overflow-y: auto;
          `}
        >
          {folder ? (
            folder.children.map(inode => (
              <Entry
                key={inode.inodeId}
                id={inode.inodeId}
                onClick={
                  inode.type === 'folder' ? this.handleFolderClick : null
                }
                title={inode.name}
                type={inode.type}
              />
            ))
          ) : (
            <Loading text="Loading..." />
          )}
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/library/MoveInode.js