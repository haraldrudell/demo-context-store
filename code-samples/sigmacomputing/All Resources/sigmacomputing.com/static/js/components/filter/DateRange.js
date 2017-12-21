// @flow

import React, { PureComponent } from 'react';
import LocaleProvider from 'antd/lib/locale-provider';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';

import { DatePicker, Flex } from 'widgets';

class DateInput extends PureComponent<{
  onChange: (?number) => void,
  placeholder: ?number,
  value: ?number
}> {
  container: ?HTMLElement;

  onChange = val => {
    this.props.onChange(val == null ? val : +val);
  };

  // DateRange is rendered in a portal so we need to ensure the DatePicker
  // is mounted here, not in another ant portal
  setContainerRef = (r: ?HTMLElement) => {
    this.container = r;
  };

  getContainerRef = () => this.container;

  render() {
    const { placeholder, value } = this.props;

    let displayValue;
    let isUnset = false;
    if (value != null) {
      displayValue = moment(value);
    } else {
      isUnset = true;
      if (placeholder != null) displayValue = moment(placeholder);
    }

    return (
      <div
        ref={this.setContainerRef}
        css={`
          & .ant-calendar-picker {
            opacity: ${isUnset ? 0.5 : 1} !important;
          };
        `}
      >
        <LocaleProvider locale={enUS}>
          <DatePicker
            getCalendarContainer={this.getContainerRef}
            format="MM/DD/YYYY"
            onChange={this.onChange}
            value={displayValue}
          />
        </LocaleProvider>
      </div>
    );
  }
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

  updateMin = (val: ?number) => {
    this.update(val, this.props.selection[1]);
  };

  updateMax = (val: ?number) => {
    this.update(this.props.selection[0], val);
  };

  render() {
    const { bounds, selection, width } = this.props;
    return (
      <Flex mt={2} justify="space-around" width={`${width}px`}>
        <DateInput
          onChange={this.updateMin}
          placeholder={bounds[0]}
          value={selection[0]}
        />
        <DateInput
          onChange={this.updateMax}
          placeholder={bounds[1]}
          value={selection[1]}
        />
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/DateRange.js