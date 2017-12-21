// @flow

import * as React from 'react';

import { Flex, Icon } from 'widgets';

type Props = {
  icon: string,
  iconSize?: string,
  onClick?: () => void,
  showCaret?: boolean,
  text: string
};

export default function ToolbarButton({
  icon,
  iconSize,
  onClick,
  showCaret = false,
  text,
  ...props
}: Props) {
  return (
    <Flex
      align="center"
      css={`cursor: pointer;`}
      font="bodyMedium"
      onClick={onClick}
      {...props}
    >
      <Icon css={`top: 0;`} size={iconSize} type={icon} mr={2} />
      {text}
      {showCaret && (
        <Icon css={`top: 0;`} ml={1} size="10px" type="caret-down" />
      )}
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/components/toolbar/ToolbarButton.js