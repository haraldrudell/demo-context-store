// @flow

import * as React from 'react';
import styled, { css } from 'react-emotion';
import defaultProps from 'recompose/defaultProps';

import { Icon } from 'widgets';
import {
  border,
  color,
  colorX,
  font,
  space,
  width,
  fontSize,
  fontWeight
} from 'styles/system';

const Base = styled('button')`
  ${width};
  ${space};
  ${border};
  ${color};
  ${font};
  ${fontWeight};
  ${fontSize};

  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover:not(:disabled) {
    color: ${props => colorX(props.hoverColor)};
  }

  &:disabled {
    cursor: default;
  }
`;

export default class IconButton extends React.Component<{
  bg: string,
  b?: number,
  children?: React.Element<any>,
  color: string,
  className: string,
  disabled: boolean,
  hoverColor: string,
  onClick?: (SyntheticMouseEvent<HTMLButtonElement>) => void,
  size?: string,
  type: string,
  onMouseEnter?: (SyntheticMouseEvent<>) => void,
  onMouseLeave?: (SyntheticMouseEvent<>) => void,
  onMouseDown?: (SyntheticMouseEvent<>) => void,
  onMouseUp?: (SyntheticMouseEvent<>) => void
}> {
  static defaultProps = {
    b: 0,
    bg: 'transparent',
    className: '',
    color: 'darkBlue3',
    disabled: false,
    hoverColor: 'darkBlue2'
  };

  render() {
    const { children, size, type, ...rest } = this.props;

    return (
      <Base {...rest}>
        <Icon size={size} type={type} />
        {children}
      </Base>
    );
  }
}

export const CollapseButton = defaultProps({
  size: '10px',
  type: 'triangle-down'
})(styled(IconButton)`
  transition: all 0.2s ease-in-out;
  ${props =>
    css`
      transform: rotate(${props.isCollapsed ? '-90' : '0'}deg);
    `};
`);



// WEBPACK FOOTER //
// ./src/widgets/IconButton.js