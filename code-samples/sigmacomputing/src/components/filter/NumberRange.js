// @flow

import React, { PureComponent } from 'react';

import { ControlledInput, Flex } from 'widgets';

const NumberInput = props => (
  <ControlledInput
    css={`
      text-align: right;

      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `}
    font="table"
    type="number"
    width="100%"
    {...props}
  />
);

function numStr(x: ?number): string {
  return x == null ? '' : x.toString();
}

export default class NumberRange extends PureComponent<{
  bounds: [?number, ?number],
  onChange: ?(?number, ?number) => void,
  selection: [?number, ?number],
  width: number
}> {
  update(x1: ?number, x2: ?number) {
    if (x1 != null && x2 != null && x1 > x2) {
      this.update(x2, x1);
      return;
    }

    const { onChange } = this.props;
    if (onChange) onChange(x1, x2);
  }

  updateMin = (val: string) => {
    this.update(val === '' ? null : +val, this.props.selection[1]);
  };

  updateMax = (val: string) => {
    this.update(this.props.selection[0], val === '' ? null : +val);
  };

  render() {
    const { bounds, selection, width } = this.props;
    return (
      <Flex mt={2} width={`${width}px`}>
        <NumberInput
          onChange={this.updateMin}
          mr={3}
          placeholder={numStr(bounds[0])}
          value={numStr(selection[0])}
        />
        <NumberInput
          onChange={this.updateMax}
          placeholder={numStr(bounds[1])}
          value={numStr(selection[1])}
        />
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/NumberRange.js