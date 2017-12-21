// @flow
import * as React from 'react';
import { Manager, Target, Popper } from 'react-popper';

import MenuItem from './MenuItem';
import { Menu } from 'widgets';
import { popupContentStyle, type MenuItems_t } from '../utils';

type Props = {
  id: string,
  name: string,
  iconType?: string,
  children: MenuItems_t,
  onMenuItemClick?: string => void,
  selected?: string,
  disabled?: boolean
};

type State = {
  popupOpen: boolean
};

export default class SubMenu extends React.Component<Props, State> {
  popup = HTMLElement;

  constructor(props: Props) {
    super(props);
    this.state = { popupOpen: false };
  }

  onMouseEnter = () => {
    if (!this.props.disabled) {
      this.setState({ popupOpen: true });
    }
  };

  onMouseLeave = () => {
    this.setState({ popupOpen: false });
  };

  onClickTarget = (e: SyntheticMouseEvent<>) => {
    if (!this.props.disabled) {
      this.setState({ popupOpen: !this.state.popupOpen });
    }
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const {
      id,
      name,
      iconType,
      children,
      onMenuItemClick,
      selected,
      disabled
    } = this.props;
    const { popupOpen } = this.state;
    const item = (
      <MenuItem
        id={id}
        name={name}
        iconType={iconType}
        hasSubmenu={true}
        hasOpenSubmenu={popupOpen}
        disabled={disabled}
      />
    );

    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <Manager>
          <Target>
            {({ targetProps }) => (
              <div {...targetProps} onClick={this.onClickTarget}>
                {item}
              </div>
            )}
          </Target>
          {popupOpen && (
            <Popper
              placement={'right-start'}
              modifiers={{ preventOverflow: { boundariesElement: 'viewport' } }}
            >
              {({ popperProps }) => (
                <div {...popperProps} className={popupContentStyle}>
                  <Menu onMenuItemClick={onMenuItemClick} selected={selected}>
                    {children}
                  </Menu>
                </div>
              )}
            </Popper>
          )}
        </Manager>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/Menu/Submenu.js