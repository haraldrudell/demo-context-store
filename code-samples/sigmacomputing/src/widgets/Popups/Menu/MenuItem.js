// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';

import colors from 'styles/colors';
import { Flex, Box, Icon, TextSpan } from 'widgets';
import MenuItemContainer from './MenuItemContainer';

type Props = {
  id: string,
  name: string | React.Node,
  iconType?: string,
  onMenuItemClick?: string => void,
  redirectTo?: string,
  redirectTarget?: string,
  hasSubmenu?: boolean,
  hasOpenSubmenu?: boolean,
  disabled?: boolean,
  example?: string,
  selected?: boolean
};

export default class MenuItem extends React.Component<Props> {
  onClick = () => {
    const { id, onMenuItemClick, disabled } = this.props;
    if (onMenuItemClick && !disabled) onMenuItemClick(id);
  };

  render() {
    const {
      name,
      iconType,
      hasSubmenu,
      hasOpenSubmenu,
      example,
      disabled,
      selected,
      redirectTo,
      redirectTarget
    } = this.props;

    const item = (
      <MenuItemContainer
        onClick={this.onClick}
        disabled={disabled}
        selected={selected}
        hovered={hasOpenSubmenu}
        title={name}
      >
        <Flex align="center" width="100%">
          {iconType && <Icon mr={2} type={iconType} size="16px" />}
          <TextSpan truncate>{name}</TextSpan>
        </Flex>
        {example && (
          <Box pl={2} css={`color: ${colors.darkBlue3};`}>
            <TextSpan truncate>{example}</TextSpan>
          </Box>
        )}
        {hasSubmenu && <Icon ml={2} type="caret-right" size="12px" />}
      </MenuItemContainer>
    );

    return redirectTo ? (
      <Link to={redirectTo} target={redirectTarget}>
        {item}
      </Link>
    ) : (
      item
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/Menu/MenuItem.js