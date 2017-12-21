// @flow
import React, { Component } from 'react';
import { css } from 'react-emotion';

import colors from 'styles/colors';
import type { fileListItem, FolderDetailsTy, Id, InodeSummaryTy } from 'types';
import { Box, Flex, Text, Icon } from 'widgets';

type Props = {
  canSelectDoc: InodeSummaryTy => boolean,
  folder: FolderDetailsTy,
  selected: ?Id,
  onSelect: InodeSummaryTy => void,
  onEnterFolder: Id => void
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
  canSelect,
  id,
  isSelected,
  onClick,
  title,
  type
}: {
  canSelect: boolean,
  id: Id,
  isSelected: boolean,
  onClick: (SyntheticMouseEvent<HTMLElement>) => void,
  title: string,
  type: fileListItem
}) => (
  <Flex
    data-id={id}
    align="center"
    bg={isSelected ? 'lightBlue' : null}
    px={3}
    py={2}
    className={
      canSelect
        ? css`
            cursor: pointer;

            &:hover {
              background-color: ${isSelected
                ? colors.lightBlue
                : colors.darkBlue6};
            }
          `
        : null
    }
    onClick={onClick}
  >
    <Icon type={getIcon(type)} size="30px" />
    <Box flexGrow mx={3} opacity={canSelect ? 1 : 0.4}>
      <Text truncate font="bodyMedium">
        {title}
      </Text>
    </Box>
    {type === 'folder' && <Icon type="caret-right" />}
  </Flex>
);

export default class FolderList extends Component<Props> {
  handleClick = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const id = evt.currentTarget.dataset.id;
    const { folder } = this.props;

    const doc = folder.children.find(doc => doc.inodeId === id);
    if (!doc) return;

    if (doc.type === 'folder') this.props.onEnterFolder(doc.inodeId);
    else if (this.props.canSelectDoc(doc)) this.props.onSelect(doc);
  };

  render() {
    const { canSelectDoc, folder, selected } = this.props;

    return (
      <div>
        {folder.children.map(doc => (
          <Entry
            key={doc.inodeId}
            canSelect={doc.type === 'folder' || canSelectDoc(doc)}
            id={doc.inodeId}
            isSelected={doc.inodeId === selected}
            onClick={this.handleClick}
            title={doc.name}
            type={doc.type}
          />
        ))}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DocSelector/FolderList.js