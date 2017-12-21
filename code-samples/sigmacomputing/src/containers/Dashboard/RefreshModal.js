// @flow

import React, { Component } from 'react';
import moment from 'moment';

import type { Id, RefetchSettingsTy, RefetchUnit } from 'types';
import {
  Box,
  Button,
  ComboBox,
  InputNumber,
  Flex,
  Menu,
  Modal,
  Radio,
  TextSpan,
  TimePicker
} from 'widgets';

const RadioGroup = Radio.Group;
const MenuItem = Menu.MenuItem;

type EnabledSettings = 'dash' | 'enabled' | 'disabled';

type Props = {
  tileId: ?Id,
  title: string,
  refetchSettings: ?RefetchSettingsTy,
  onClose: () => void,
  onSubmit: RefetchSettingsTy => void
};

function convertToMilli(time, unit) {
  switch (unit) {
    case 'sec':
      return time * 1000;
    case 'min':
      return time * 60 * 1000;
    case 'hr':
      return time * 60 * 60 * 1000;
    default:
      throw new Error('Invalid Unit');
  }
}

function convertFromMilli(time, unit) {
  switch (unit) {
    case 'sec':
      return time / 1000;
    case 'min':
      return time / 60 / 1000;
    case 'hr':
      return time / 60 / 60 / 1000;
    default:
      throw new Error('Invalid Unit');
  }
}

export default class RefreshModal extends Component<
  Props,
  {
    currentSettings: EnabledSettings,
    time: number,
    refetchUnit: RefetchUnit,
    startTime: string,
    endTime: string
  }
> {
  constructor(props: Props) {
    super(props);

    const { refetchSettings, tileId } = props;
    this.state = {
      currentSettings:
        tileId && (!refetchSettings || refetchSettings.useDash !== false)
          ? 'dash'
          : refetchSettings && refetchSettings.autoEnabled
            ? 'enabled'
            : 'disabled',
      time: refetchSettings
        ? convertFromMilli(
            refetchSettings.refetchTime,
            refetchSettings.refetchUnit
          )
        : 5,
      refetchUnit: refetchSettings ? refetchSettings.refetchUnit : 'min',
      startTime:
        refetchSettings && refetchSettings.startTime
          ? refetchSettings.startTime
          : '8:00:00 AM',
      endTime:
        refetchSettings && refetchSettings.endTime
          ? refetchSettings.endTime
          : '8:00:00 PM'
    };
  }

  onChangeAuto = (e: { target: { value: EnabledSettings } }) => {
    this.setState({
      currentSettings: e.target.value
    });
  };

  onSelectField = (refetchUnit: RefetchUnit) => {
    this.setState({
      refetchUnit
    });
  };

  onInputChange = (value: number) => {
    this.setState({
      time: value
    });
  };

  onChangeStart = (time: moment, timeString: string) => {
    this.setState({
      startTime: timeString
    });
  };

  onChangeEnd = (time: moment, timeString: string) => {
    this.setState({
      endTime: timeString
    });
  };

  onSubmit = () => {
    const { onSubmit } = this.props;
    const {
      currentSettings,
      time,
      refetchUnit,
      startTime,
      endTime
    } = this.state;

    onSubmit({
      useDash: currentSettings === 'dash',
      autoEnabled: currentSettings === 'enabled',
      refetchTime: convertToMilli(time, refetchUnit),
      refetchUnit,
      startTime,
      endTime
    });
  };

  renderContent() {
    const { tileId } = this.props;
    const {
      currentSettings,
      time,
      refetchUnit,
      startTime,
      endTime
    } = this.state;

    return (
      <RadioGroup onChange={this.onChangeAuto} value={currentSettings}>
        {tileId && (
          <Box pb={1}>
            <Radio value="dash">
              <TextSpan font="bodyMedium">Use Dashboard Settings</TextSpan>
            </Radio>
          </Box>
        )}
        <Radio value="disabled">
          <TextSpan font="bodyMedium">Never</TextSpan>
        </Radio>
        <br />
        <Radio value="enabled">
          <TextSpan font="bodyMedium">Every</TextSpan>
          <Flex inline align="center">
            <Box mx={2}>
              <InputNumber min={0} value={time} onChange={this.onInputChange} />
            </Box>
            <ComboBox
              selected={refetchUnit}
              width="150px"
              setSelection={this.onSelectField}
              doNotLayer
            >
              <MenuItem id="sec" name="Seconds" />
              <MenuItem id="min" name="Minutes" />
              <MenuItem id="hr" name="Hours" />
            </ComboBox>
          </Flex>
          <br />
          <Flex inline align="center" ml={2} mt={2}>
            <TextSpan ml={3} mr={2} font="bodyMedium">
              Between
            </TextSpan>
            <TimePicker
              onChange={this.onChangeStart}
              value={moment(startTime, 'HH:mm:ss A')}
              use12Hours
              format="h:mm:ss A"
            />
            <TextSpan mx={1}>-</TextSpan>
            <TimePicker
              onChange={this.onChangeEnd}
              value={moment(endTime, 'HH:mm:ss A')}
              use12Hours
              format="h:mm:ss A"
            />
          </Flex>
        </Radio>
      </RadioGroup>
    );
  }

  renderFooter() {
    const { onClose } = this.props;

    return [
      <Button key="cancel" type="secondary" onClick={onClose}>
        Cancel
      </Button>,
      <Button key="confirm" type="primary" onClick={this.onSubmit}>
        OK
      </Button>
    ];
  }

  render() {
    const { onClose, title } = this.props;

    return (
      <Modal
        visible
        onClose={onClose}
        title={<TextSpan font="header3">{title}</TextSpan>}
        footer={this.renderFooter()}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Dashboard/RefreshModal.js