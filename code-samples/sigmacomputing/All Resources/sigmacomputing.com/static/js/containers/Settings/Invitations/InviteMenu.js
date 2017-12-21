// @flow
import React, { PureComponent } from 'react';

import { Flex, Icon, Menu, Popup } from 'widgets';

import UserIcon from 'icons/user.png';

const { MenuItem } = Menu;

export default class InviteMenu extends PureComponent<{
  email: string,
  onDeleteInvite: (email: string) => Promise<void>,
  onResendInvite: (email: string) => void
}> {
  onMenuClick = (action: string) => {
    const { email, onDeleteInvite, onResendInvite } = this.props;
    if (action === 'revoke') {
      onDeleteInvite(email);
    } else if (action === 'resend') {
      onResendInvite(email);
    }
  };

  render() {
    return (
      <Popup
        popupPlacement="bottom-end"
        target={
          <Flex css={`cursor: pointer;`} align="center" mr={3}>
            <img src={UserIcon} alt="user" />
            <Icon type="caret-down" size="10px" ml={1} />
          </Flex>
        }
      >
        <Menu onMenuItemClick={this.onMenuClick}>
          <MenuItem id="revoke" name="Revoke Invitation" />
          <MenuItem id="resend" name="Resend Invitation" />
        </Menu>
      </Popup>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Settings/Invitations/InviteMenu.js