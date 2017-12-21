// @flow
import React, { PureComponent } from 'react';

import { Input } from 'widgets';

type Props = {
  label: string,
  onRename: (label: string) => void,
  className?: string,
  inputClassName?: string,
  toggleEditing?: boolean => void
};

type State = {
  isEditing: boolean,
  labelValue?: string
};

function quashEvent(evt) {
  evt.stopPropagation();
}

export default class Label extends PureComponent<Props, State> {
  input: ?Input;

  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
      labelValue: undefined
    };
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    const { toggleEditing } = nextProps;
    if (toggleEditing && nextState.isEditing !== this.state.isEditing) {
      toggleEditing(nextState.isEditing);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.input && this.state.isEditing && !prevState.isEditing) {
      const input = this.input.refs.input;
      input.focus();
      input.setSelectionRange(0, input.value.length);
    }
  }

  focus = () => {
    if (!this.state.isEditing) {
      // will auto-focus
      this.onStartEdit();
    }
  };

  onStartEdit = () => {
    this.setState({
      isEditing: true,
      labelValue: this.props.label
    });
  };

  onChange = (evt: SyntheticInputEvent<>) => {
    this.setState({ labelValue: evt.target.value });
  };

  onKeyDown = (evt: SyntheticInputEvent<>) => {
    evt.stopPropagation();
    if (evt.key === 'Escape') {
      this.finishEdit();
    }
  };

  onRename = () => {
    const v = this.state.labelValue || '';
    if (v.length > 0 && v !== this.props.label) {
      this.props.onRename(v);
    }
    this.finishEdit();
  };

  finishEdit = () => {
    this.setState({ isEditing: false, labelValue: undefined });
  };

  setInputRef = (r: ?Input) => {
    this.input = r;
  };

  render() {
    const { label, className, inputClassName } = this.props;

    if (this.state.isEditing) {
      return (
        <Input
          autoFocus
          className={inputClassName}
          ref={this.setInputRef}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyPress={quashEvent}
          onPressEnter={this.onRename}
          onBlur={this.onRename}
          value={this.state.labelValue}
          spellCheck="false"
        />
      );
    }
    return (
      <div className={className} title={label} onDoubleClick={this.onStartEdit}>
        {label}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/widgets/Label/index.js