// @flow
import React, { Component } from 'react';

import styles from './index.less';

type Props = {|
  onUpdate?: string => void,
  className: string,
  initialValue: string
|};

type State = {
  style: Object,
  value: string
};

export default class AutosizeInput extends Component<Props, State> {
  input: ?HTMLInputElement;
  sizer: ?HTMLDivElement;

  updatedValue: string;

  constructor(props: Props) {
    super(props);

    this.updatedValue = props.initialValue;
    this.state = {
      style: { width: 0 },
      value: props.initialValue || ''
    };
  }

  componentDidMount() {
    this.onInputChange();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.initialValue !== this.state.value) {
      this.setState({ value: nextProps.initialValue || '' });
      this.updatedValue = nextProps.initialValue;
    }
  }

  componentDidUpdate(nextProps: Props, nextState: State) {
    if (nextState.value !== this.state.value) {
      this.onInputChange();
    }
  }

  onBlur = () => {
    this.onUpdate();
  };

  onUpdate = () => {
    const { value } = this.state;
    if (this.updatedValue !== value) {
      this.updatedValue = value;
      if (this.props.onUpdate) this.props.onUpdate(value);
    }
  };

  onChange = (e: SyntheticInputEvent<>) => {
    this.setState({
      value: e.target.value
    });
  };

  onKeyDown = (event: SyntheticKeyboardEvent<>) => {
    if (!this.input) return;
    if (event.key === 'Enter' || event.key === 'Escape') {
      this.input.blur();
    }
  };

  setInputRef = (node: ?HTMLInputElement) => {
    this.input = node;
  };

  setSizerRef = (node: ?HTMLDivElement) => {
    this.sizer = node;
  };

  onInputChange() {
    requestAnimationFrame(() => {
      if (this.sizer) {
        const width = this.sizer.getBoundingClientRect().width;
        if (width !== this.state.width) {
          this.setState({ style: { width } });
        }
      }
    });
  }

  render() {
    const { value, style } = this.state;
    const { className } = this.props;

    return (
      <div className={`${styles.container}`}>
        <div ref={this.setSizerRef} className={`${styles.sizer} ${className}`}>
          {value}
        </div>
        <input
          ref={this.setInputRef}
          className={className}
          onChange={this.onChange}
          onBlur={this.onBlur}
          value={value}
          style={style}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/widgets/AutosizeInput/index.js