// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';

import { Icon, Text } from 'widgets';
import styles from './index.less';
const cx = classnames.bind(styles);

type Props = {
  className?: string,
  inputClassName?: string,
  placeholder?: string,
  onSearch: string => void,
  disabled?: boolean,
  instantSearch?: boolean
};

export default class SearchBar extends PureComponent<
  Props,
  {
    query: string
  }
> {
  inputBox: any;

  debounceSearch: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      query: ''
    };
  }

  onChange = (e: SyntheticInputEvent<>) => {
    const query = e.target.value;
    this.setState({ query });
    if (this.props.instantSearch) this.props.onSearch(query);
  };

  onKeyDown = (evt: SyntheticInputEvent<>) => {
    if (evt.key === 'Escape' || evt.key === 'Enter') this.inputBox.blur();
    if (evt.key === 'Enter') this.props.onSearch(this.state.query);
  };

  clear = () => {
    this.setState({ query: '' });
  };

  setInputRef = (r: any) => {
    this.inputBox = r;
  };

  render() {
    const {
      className = '',
      placeholder,
      inputClassName = '',
      disabled = false
    } = this.props;
    const { query } = this.state;

    return (
      <Text
        className={cx(className, 'flex-row', 'align-center')}
        font="bodyMedium"
      >
        <Icon type="search" />
        <input
          className={cx('input', inputClassName)}
          ref={this.setInputRef}
          placeholder={placeholder || 'Search'}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          disabled={disabled}
          value={query}
        />
      </Text>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/widgets/SearchBar/index.js