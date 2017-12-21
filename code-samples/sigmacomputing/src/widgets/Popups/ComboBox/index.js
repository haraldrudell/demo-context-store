// @flow

import * as React from 'react';

import Menu from '../Menu';
import Popup from '../Popup';
import { TextSpan, Icon, Text } from 'widgets';
import colors from 'styles/colors';
import MenuItemContainer from '../Menu/MenuItemContainer';
import type { MenuItems_t } from '../utils';

type Props = {
  children: MenuItems_t,
  selected: ?string,
  setSelection: any => void,
  width: string,
  maxHeight?: string,
  placeholder?: string,
  doNotLayer?: boolean,
  optionPlaceholder?: string
  // Do not Layer if Dropdown is part of a modal
};

type State = {
  focused: boolean,
  selectedChild?: string
};

export default class ComboBox extends React.Component<Props, State> {
  static defaultProps = {
    doNotLayer: false,
    placeholder: 'Select your Option',
    optionPlaceholder: ''
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      focused: false,
      selectedChild: this.findSelectedChild(props.selected, props.children)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.selected !== this.props.selected ||
      nextProps.children !== this.props.children
    ) {
      this.setState({
        selectedChild: this.findSelectedChild(
          nextProps.selected,
          nextProps.children
        )
      });
    }
  }

  findSelectedChild = (selectedId: ?string, children: MenuItems_t) => {
    const options = React.Children.toArray(children);
    if (!selectedId) return;
    const child = options.find(
      child => child && child.props && child.props.id === selectedId
    );
    if (child) return child.props.name;
    throw new Error(`Selected (${selectedId}) not found in options list`);
  };

  onClickTarget = () => {
    this.setState({ focused: true });
  };

  onBlur = () => {
    this.setState({ focused: false });
  };

  onMenuItemClick = (selectedKey: string) => {
    this.onBlur();
    this.props.setSelection(selectedKey);
  };

  render() {
    const {
      width,
      maxHeight,
      doNotLayer,
      placeholder,
      optionPlaceholder,
      selected,
      children
    } = this.props;
    const { focused, selectedChild } = this.state;

    const options = React.Children.toArray(children);

    return (
      <Popup
        width={width}
        onClickTarget={this.onClickTarget}
        onBlur={this.onBlur}
        doNotLayer={doNotLayer}
        target={
          <MenuItemContainer
            b={1}
            borderColor={focused ? colors.blue : colors.darkBlue4}
            borderRadius="2px"
            width={width}
            css={`
              background-image: linear-gradient(to bottom, #ffffff, #f7f7f7);
            `}
          >
            <TextSpan truncate>
              {selectedChild ? selectedChild : placeholder}
            </TextSpan>
            <Icon ml={2} type="caret-down" size="12px" color="darkBlue3" />
          </MenuItemContainer>
        }
        popupPlacement="bottom"
      >
        {options && options[0] ? (
          <Menu
            onMenuItemClick={this.onMenuItemClick}
            selected={selected}
            maxHeight={maxHeight}
          >
            {options}
          </Menu>
        ) : (
          <Text py={1} pl={2} font="bodyMedium" color="darkBlue3">
            {optionPlaceholder}
          </Text>
        )}
      </Popup>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/ComboBox/index.js