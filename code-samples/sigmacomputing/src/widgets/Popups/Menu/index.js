// @flow
import * as React from 'react';

import MenuItem from './MenuItem';
import MenuDivider from './MenuDivider';
import SubMenu from './Submenu';
import { type MenuItems_t } from '../utils';

type Props = {
  children: MenuItems_t,
  onMenuItemClick?: any => void,
  selected?: ?string,
  maxHeight?: string
};

export default class Menu extends React.Component<Props> {
  static MenuItem = MenuItem;
  static MenuDivider = MenuDivider;
  static SubMenu = SubMenu;

  render() {
    const { children, onMenuItemClick, selected, maxHeight } = this.props;

    const list = React.Children.map(
      children,
      (child, idx) =>
        child
          ? React.cloneElement(child, {
              onMenuItemClick: onMenuItemClick,
              key: child.props.id || idx,
              selected: child.props.id && child.props.id === selected
            })
          : null
    );
    const style = maxHeight ? { maxHeight, overflow: 'auto' } : null;

    return <div style={style}>{list}</div>;
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/Menu/index.js