// @flow
import React, { Component } from 'react';
import { css } from 'react-emotion';

import Spin from './Spin';
import colors from 'styles/colors';
import Widget from './Widget';

const baseCls = css`
  display: inline-block;
  border-radius: 4px;
  line-height: 1.4;
  cursor: pointer;
  user-select: none;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

const btnTypes = {
  primary: css`
    min-width: 8em;
    border-width: 0;
    background-image: linear-gradient(to bottom, #029ae6, ${colors.blue});
    color: white;

    &:hover:not(:disabled) {
      background-image: linear-gradient(to bottom, #02abff, ${colors.blue});
    }

    &:active:not(:disabled) {
      background-image: linear-gradient(to top, #029ae6, ${colors.blue});
    }
  `,

  secondary: css`
    min-width: 8em;
    border: 1px solid ${colors.darkBlue4};
    background-image: linear-gradient(to bottom, #fff, #f7f7f7);
    color: ${colors.darkBlue2};

    &:hover:not(:disabled) {
      background-image: linear-gradient(to bottom, #fff, #eee);
    }

    &:active:not(:disabled) {
      background-image: linear-gradient(to top, #fff, #f7f7f7);
    }
  `,

  stroke: css`
    border-width: 1px;
    border-style: solid;
    border-color: ${colors.darkBlue4};
    background-color: transparent;
    color: ${colors.darkBlue2};
    transition: border-color 150ms ease-in-out;

    &:hover:not(:disabled) {
      border-color: ${colors.darkBlue3};
    }

    &:active:not(:disabled) {
      border-color: ${colors.darkBlue2};
    }
  `,

  transparent: css`
    border: none;
    background-color: transparent;
    opacity: 1;
    transition: opacity 150ms ease-in-out;

    &:hover:not(:disabled) {
      opacity: 0.5;
    }

    &:active:not(:disabled) {
      opacity: 1;
    }
  `
};

const BaseButton = Widget('button');

export default class Button extends Component<{
  children: any,
  className: string,
  disabled?: boolean,
  font: string,
  htmlType: 'submit' | 'button' | 'reset',
  loading?: boolean,
  onClick?: (SyntheticMouseEvent<>) => void,
  px: string | number,
  py: string | number,
  type: 'primary' | 'secondary' | 'stroke' | 'transparent'
}> {
  static defaultProps = {
    className: '',
    font: 'header4',
    htmlType: 'button',
    px: '1em',
    py: '0.5em',
    type: 'primary'
  };

  render() {
    const {
      children,
      className,
      disabled,
      htmlType,
      loading,
      onClick,
      type,
      ...rest
    } = this.props;

    const cls = `${baseCls} ${btnTypes[type]} ${className}`;
    return (
      <BaseButton
        className={cls}
        disabled={disabled}
        onClick={onClick}
        type={htmlType}
        {...rest}
      >
        {loading && <Spin />}
        {children}
      </BaseButton>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Button.js