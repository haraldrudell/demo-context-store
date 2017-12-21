// @flow

import * as React from 'react';
import { withRouter, type RouterHistory } from 'react-router-dom';

import { logout } from 'utils/auth';
import { Flex, Icon, Menu, Popup } from 'widgets';
import UserIcon from 'icons/user.png';
import { helpURL } from 'components/Help/resources';

const { MenuItem } = Menu;

type Props = {|
  history: RouterHistory
|};

class UserMenu extends React.Component<Props> {
  onMenuClick = (action: string) => {
    if (action === 'logout') {
      logout().then(() => this.props.history.push('/'));
    }
  };

  render() {
    return (
      <Popup
        popupPlacement="bottom-end"
        target={
          <Flex align="center" pt={2}>
            <img src={UserIcon} alt="settings" css={`margin-right: 8px;`} />
            <Icon type="caret-down" size="10px" />
          </Flex>
        }
      >
        <Menu onMenuItemClick={this.onMenuClick}>
          <MenuItem id="settings" name="Settings" redirectTo="/settings" />
          <MenuItem
            id="help"
            name="Help"
            redirectTo={helpURL}
            redirectTarget="_blank"
          />
          <MenuItem id="logout" name="Logout" />
        </Menu>
      </Popup>
    );
  }
}

export default withRouter(UserMenu);



// WEBPACK FOOTER //
// ./src/components/nav/UserMenu.js