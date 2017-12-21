// @flow

import * as React from 'react';
import styled from 'react-emotion';
import { css } from 'emotion';

import { colorX, space } from 'styles/system';
import Icon from './Icon';

const CheckboxWrapper = styled('span')`
  display: inline-block;
  position: relative;
  border: 1px solid;
  border-radius: 2px;
  cursor: pointer;
  ${space};
  ${props =>
    css`
      background-color: ${colorX(props.bg)};
    `};
  ${props =>
    props.checked &&
    css`
      color: ${colorX(props.color)};
    `};
  ${props =>
    props.borderColor &&
    css`
      border-color: ${colorX(props.borderColor)};
    `};
`;

const CheckboxInput = styled('input')`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  opacity: 0;
`;

type Props = {
  bg?: string,
  borderColor: string,
  color: string,
  borderColor: string,
  uncheckedBorderColor: string,
  checked?: boolean,
  disabled?: boolean,
  iconType: string
};

export default class Checkbox extends React.Component<Props> {
  static defaultProps = {
    disabled: false,
    iconType: 'check',
    color: 'blueAccent',
    bg: 'white',
    borderColor: 'darkBlue4',
    uncheckedBorderColor: 'darkBlue4'
  };

  render() {
    const {
      bg,
      borderColor,
      uncheckedBorderColor,
      checked,
      color,
      disabled,
      iconType,
      ...rest
    } = this.props;

    return (
      <CheckboxWrapper
        bg={bg}
        checked={checked}
        color={color}
        m={1}
        p={1}
        borderColor={checked ? borderColor : uncheckedBorderColor}
      >
        <CheckboxInput disabled={disabled} type="checkbox" {...rest} />
        <Icon
          className={css`
            display: block;
            top: 0;
          `}
          size="12px"
          opacity={checked ? 1 : 0}
          type={iconType}
        />
      </CheckboxWrapper>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Checkbox2.js