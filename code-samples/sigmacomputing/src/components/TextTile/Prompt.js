// @flow
import React, { PureComponent } from 'react';
import { css } from 'react-emotion';

import colors from 'styles/colors';
import typography from 'styles/typography';
import { Input } from 'widgets';

type Props = {
  placeholder: string,
  onSubmit?: string => void,
  onFocus?: () => void,
  onBlur?: () => void
};

type State = {
  value: string
};

const inputStyle = css`
  ${typography.header4};
  height: 100%;
  width: 100%;
  background-color: ${colors.darkBlue1};
  color: white;
`;

export default class ControlledInput extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: '' };
  }

  onKeyDown = (evt: SyntheticKeyboardEvent<>) => {
    const { onSubmit } = this.props;
    if (evt.key === 'Enter') {
      onSubmit && onSubmit(this.state.value);
    }
  };

  onChange = (evt: SyntheticInputEvent<>) => {
    this.setState({ value: evt.target.value });
  };

  render() {
    const { placeholder, onFocus, onBlur } = this.props;
    return (
      <Input
        className={inputStyle}
        placeholder={placeholder}
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/TextTile/Prompt.js