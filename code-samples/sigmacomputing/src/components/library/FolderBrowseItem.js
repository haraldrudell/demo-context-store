// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Box, Flex, Icon, IconButton, Menu, Popup, Text } from 'widgets';
import { encodeInodeUrl, getInodeIconType } from 'utils/folders';
import { ORG_ROOT_ID } from 'api/organization';
import type { InodeSummaryTy } from 'types';

const { MenuItem } = Menu;

type Props = {|
  inode: InodeSummaryTy,
  onDelete: InodeSummaryTy => void,
  onMove: InodeSummaryTy => void,
  onRename: InodeSummaryTy => void
|};

function squashDropdownClick(evt: SyntheticInputEvent<>) {
  evt.preventDefault();
  evt.stopPropagation();
}

export default class FolderBrowseItem extends React.PureComponent<Props> {
  onMenuItemClick = (action: string) => {
    const { inode } = this.props;

    if (action === 'delete') this.props.onDelete(inode);
    else if (action === 'move') this.props.onMove(inode);
    else if (action === 'rename') this.props.onRename(inode);
  };

  render() {
    const { inode } = this.props;

    const typeName = inode.type.charAt(0).toUpperCase() + inode.type.slice(1);
    const canEdit = true;

    return (
      <Link css={`color: inherit;`} to={encodeInodeUrl(inode)}>
        <Flex
          align="center"
          bb={2}
          bg="white"
          borderColor="darkBlue5"
          bx={2}
          py={2}
        >
          <Flex width="50%" align="center" pl={4}>
            <Icon mr={3} size="30px" type={getInodeIconType(inode)} />
            <Text font="header4" truncate>
              {inode.name}
            </Text>
          </Flex>
          <Box font="bodyMedium" color="darkBlue2" width="20%">
            <Text truncate>
              {inode.type === 'folder'
                ? null
                : moment(inode.updatedAt).calendar()}
            </Text>
          </Box>
          <Text truncate width="20%">
            {inode.updatedBy}
          </Text>
          <Box css={`text-align: center;`} width="10%">
            {inode.inodeId === ORG_ROOT_ID ? (
              <IconButton disabled opacity={0} type="more" size="30px" p={2} />
            ) : (
              <Popup
                target={<IconButton type="more" size="30px" p={2} />}
                popupPlacement={'bottom-start'}
                onClickTarget={squashDropdownClick}
              >
                <Menu onMenuItemClick={this.onMenuItemClick}>
                  <MenuItem
                    id="rename"
                    name={`Rename ${typeName}`}
                    disabled={!canEdit}
                  />
                  <MenuItem
                    id="move"
                    name={`Move ${typeName}`}
                    disabled={!canEdit}
                  />
                  <MenuItem
                    id="delete"
                    name={`Delete ${typeName}`}
                    disabled={!canEdit}
                  />
                </Menu>
              </Popup>
            )}
          </Box>
        </Flex>
      </Link>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/library/FolderBrowseItem.js