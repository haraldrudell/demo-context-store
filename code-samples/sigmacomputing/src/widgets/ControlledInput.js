// @flow

import React, { PureComponent } from 'react';
import styled from 'react-emotion';

import colors from 'styles/colors';
import Widget from './Widget';

const BaseInput = styled(Widget('input'))`
  border: 1px solid ${colors.darkBlue4};
  border-radius: 4px;
  box-shadow: inset 0 1px 2px -1px rgba(89, 89, 89, 0.52);
  color: currentColor;

  &:focus,
  &:active {
    border: 1px solid ${colors.blueAccent};
    box-shadow: inset 0 0 1px 0 ${colors.blueAccent};
  }

  &::placeholder {
    color: currentColor;
    font-style: italic;
    opacity: 0.5;
  }
`;

type Props = {
  className: string,
  font: string,
  onChange?: string => void,
  placeholder?: string,
  px: string | number,
  py: string | number,
  type?: string,
  value: string
};

export default class ControlledInput extends PureComponent<
  Props,
  {|
    currentValue: ?string
  |}
> {
  input: HTMLInputElement;

  static defaultProps = {
    className: '',
    font: 'header4',
    px: '0.5em',
    py: '0.25em'
  };

  constructor(props: Props) {
    super(props);

    this.state = { currentValue: null };
  }

  onChange = (evt: SyntheticInputEvent<>) => {
    this.setState({ currentValue: evt.target.value });
  };

  onKeyDown = (evt: SyntheticKeyboardEvent<>) => {
    switch (evt.key) {
      case 'Enter':
      case 'Tab': {
        const { onChange } = this.props;
        const { currentValue } = this.state;
        if (onChange && currentValue != null) {
          onChange(currentValue);
        }
        this.input.blur();
        break;
      }

      case 'Escape':
        this.input.blur();
        break;

      default:
        break;
    }
  };

  onBlur = () => {
    this.setState({ currentValue: null });
  };

  setRef = (node: HTMLInputElement) => {
    this.input = node;
  };

  render() {
    const { currentValue } = this.state;
    // eslint-disable-next-line no-unused-vars
    const { className, onChange, value, ...rest } = this.props;

    return (
      <BaseInput
        innerRef={this.setRef}
        className={`${className}`}
        onBlur={this.onBlur}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        value={currentValue != null ? currentValue : value}
        {...rest}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/ControlledInput.js