// @flow
import * as React from 'react';
import type { Id } from '@sigmacomputing/sling';

import type { DashboardTile } from 'containers/Dashboard';
import { Box, IconButton, Menu, Popup } from 'widgets';

const { MenuItem } = Menu;

export default class DashTile extends React.Component<{
  onDelete: Id => void,
  onOpen: Id => void,
  onOpenRefreshModal: ?(Id) => void,
  renderContents: Id => ?React.Element<any>,
  tile: DashboardTile
}> {
  handleMenuClick = (action: string) => {
    switch (action) {
      case 'delete': {
        const { onDelete, tile } = this.props;
        onDelete(tile.id);
        return;
      }
      case 'open': {
        const { onOpen, tile } = this.props;
        if (tile.def.type === 'chart') {
          onOpen(tile.def.wsId);
        }
        return;
      }
      case 'autoRefresh': {
        const { onOpenRefreshModal, tile } = this.props;
        if (onOpenRefreshModal) {
          onOpenRefreshModal(tile.id);
        }
        return;
      }

      default:
        break;
    }
  };

  render() {
    const { renderContents, tile, onOpenRefreshModal } = this.props;

    return (
      <Box css={`height: 100%;`} p={1}>
        <div
          css={`
            position: absolute;
            top: 0;
            right: 0;
            display: inline-flex;
            z-index: 10;
          `}
        >
          <Popup
            popupPlacement="bottom-end"
            target={<IconButton p={1} type="more" />}
          >
            <Menu onMenuItemClick={this.handleMenuClick}>
              {tile.def.type === 'chart' && (
                <MenuItem id="open" name="View Worksheet" />
              )}
              {tile.def.type === 'chart' &&
                onOpenRefreshModal && (
                  <MenuItem id="autoRefresh" name="Refresh Settings" />
                )}
              <MenuItem id="delete" name="Delete" />
            </Menu>
          </Popup>
        </div>
        {renderContents(tile.id)}
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Dashboard/DashTile.js