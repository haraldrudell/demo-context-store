// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';

import { Box, Button, Flex, IconButton, Menu, Popup, TextSpan } from 'widgets';
import { folderIsSystem } from 'utils/folders';
import type { FolderSummaryTy } from 'types';

const { MenuItem } = Menu;

type Props = {|
  folder: ?{ ...FolderSummaryTy },
  onCreateDashboard: () => void,
  onCreateFolder: () => void,
  onRenameFolder: () => void
|};

export default class FolderActionPanel extends React.Component<Props> {
  onMenuItemClick = (action: string) => {
    if (action === 'rename') this.props.onRenameFolder();
  };

  render() {
    const { folder, onCreateDashboard, onCreateFolder } = this.props;

    const currentFolder = folder ? folder.inodeId : null;
    return (
      <Flex align="flex-start" column ml={4} pt={1}>
        <Link to={{ pathname: '/new', state: { currentFolder } }}>
          <Button width="160px">New Worksheet</Button>
        </Link>
        <Box mt={2}>
          <IconButton
            color="blue"
            hoverColor="blue"
            size="24px"
            type="dashboard"
            onClick={onCreateDashboard}
          >
            <TextSpan pl={2}>New Dashboard</TextSpan>
          </IconButton>
        </Box>
        <IconButton
          onClick={onCreateFolder}
          color="blue"
          hoverColor="blue"
          mt={2}
          type="folder"
          size="30px"
        >
          <TextSpan pl={1}>New Folder</TextSpan>
        </IconButton>
        {folder &&
          !folderIsSystem(folder) && (
            <Popup
              target={
                <IconButton
                  color="blue"
                  hoverColor="blue"
                  type="more"
                  size="30px"
                >
                  <TextSpan css={`padding-left: 12px;`}>More</TextSpan>
                </IconButton>
              }
              type="more"
              size="30px"
              p={2}
              popupPlacement={'bottom-start'}
            >
              <Menu onMenuItemClick={this.onMenuItemClick}>
                <MenuItem id="rename" name="Rename Folder" />
              </Menu>
            </Popup>
          )}
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/library/FolderActionPanel.js