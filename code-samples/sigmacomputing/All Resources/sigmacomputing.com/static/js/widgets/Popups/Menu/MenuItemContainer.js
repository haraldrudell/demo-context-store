// @flow
import * as React from 'react';
import { css } from 'emotion';

import { Flex } from 'widgets';
import colors from 'styles/colors';

const hoverStyle = css`
  background-color: ${colors.darkBlue5};
`;

const itemStyles = css`
  cursor: pointer;
  user-select: none;

  &:hover {
    ${hoverStyle};
  }
`;

const selectedItemStyles = css`
  cursor: pointer;
  user-select: none;
  background-color: ${colors.darkBlue4};
`;

const disabledItemStyles = css`
  user-select: none;
`;

export default function MenuItemContainer({
  children,
  disabled,
  selected,
  hovered,
  ...rest
}: {
  children: React.Node,
  disabled?: boolean,
  selected?: boolean,
  hovered?: boolean
}) {
  let styles = itemStyles;
  if (disabled) styles = disabledItemStyles;
  else if (selected) styles = selectedItemStyles;
  else if (hovered) styles = hoverStyle;

  return (
    <Flex
      align="center"
      justify="space-between"
      className={styles}
      font="bodyMedium"
      color={disabled ? 'darkBlue3' : 'darkBlue2'}
      p={2}
      {...rest}
    >
      {children}
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/Menu/MenuItemContainer.js