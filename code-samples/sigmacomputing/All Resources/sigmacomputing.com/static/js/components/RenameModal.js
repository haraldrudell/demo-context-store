// @flow

import React, { PureComponent } from 'react';

import { Button, Flex, Input, Modal, Text } from 'widgets';

type Props = {|
  description: string,
  initialName: string,
  onClose: () => void,
  onRename: string => void
|};

export default class RenameModal extends PureComponent<
  Props,
  { newName: string }
> {
  input: Input;

  constructor(props: Props) {
    super(props);

    this.state = {
      newName: props.initialName
    };
  }

  componentDidMount() {
    this.input.focus();
  }

  onLabelChange = (evt: SyntheticInputEvent<>) => {
    this.setState({ newName: evt.target.value });
  };

  onRename = () => {
    this.props.onRename(this.state.newName);
  };

  setInputRef = (r: Input) => {
    this.input = r;
  };

  onKeyDown = (event: SyntheticKeyboardEvent<>) => {
    if (event.key === 'Escape') {
      this.props.onClose();
    } else if (event.key === 'Enter') {
      this.onRename();
    }
  };

  renderFooter() {
    const { onClose } = this.props;
    const { newName } = this.state;

    return [
      <Button key="cancel" type="secondary" onClick={onClose}>
        Cancel
      </Button>,
      <Button
        key="confirm"
        disabled={!newName}
        type="primary"
        onClick={this.onRename}
      >
        Save
      </Button>
    ];
  }

  render() {
    const { description, onClose } = this.props;

    return (
      <Modal
        visible
        width={430}
        footer={this.renderFooter()}
        onClose={onClose}
        closable={false}
      >
        <Flex align="center" column>
          <Text font="header2">{description}</Text>
          <Input
            ref={this.setInputRef}
            value={this.state.newName}
            onKeyDown={this.onKeyDown}
            onChange={this.onLabelChange}
          />
        </Flex>
      </Modal>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/RenameModal.js