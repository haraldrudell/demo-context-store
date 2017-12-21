// @flow
import React, { Component } from 'react';

import type { AxisTitleOptions } from 'utils/chart/ChartConfig';
import { Box, Flex, Input, Text, TextSpan, ComboBox, Menu } from 'widgets';
import { DEFAULT_VEGA_CONFIG } from 'components/chart/VegaLite';

const { MenuItem } = Menu;

type Props = {
  axisTitle: AxisTitleOptions,
  onAxisTitleChange: AxisTitleOptions => void
};

export default class AxisTitleEditor extends Component<
  Props,
  {
    xTitle: string,
    yTitle: string
  }
> {
  xInput: Input;
  yInput: Input;

  constructor(props: Props) {
    super(props);

    this.state = {
      xTitle: props.axisTitle.xTitle || '',
      yTitle: props.axisTitle.yTitle || ''
    };
  }

  onFontChange = (size: string) => {
    const { onAxisTitleChange, axisTitle } = this.props;
    onAxisTitleChange({ ...axisTitle, fontSize: size });
  };

  onXTitleChange = (e: SyntheticInputEvent<>) => {
    this.setState({
      xTitle: e.target.value
    });
  };

  onYTitleChange = (e: SyntheticInputEvent<>) => {
    this.setState({
      yTitle: e.target.value
    });
  };

  onInputBlur = () => {
    const { onAxisTitleChange, axisTitle } = this.props;
    const { xTitle, yTitle } = this.state;
    if (axisTitle.xTitle !== xTitle || axisTitle.yTitle !== yTitle) {
      onAxisTitleChange({ ...axisTitle, xTitle, yTitle });
    }
  };

  onXKeyDown = (e: SyntheticKeyboardEvent<>) => {
    if (e.key === 'Enter') {
      this.xInput.refs.input.blur();
    }
  };

  onYKeyDown = (e: SyntheticKeyboardEvent<>) => {
    if (e.key === 'Enter') {
      this.yInput.refs.input.blur();
    }
  };

  setXInput = (r: Input) => {
    this.xInput = r;
  };

  setYInput = (r: Input) => {
    this.yInput = r;
  };

  render() {
    const { axisTitle } = this.props;
    const {
      fontSize = DEFAULT_VEGA_CONFIG.axis.titleFontSize.toString()
    } = axisTitle;
    const { xTitle, yTitle } = this.state;

    return (
      <Box p={3}>
        <Flex align="center">
          <Text font="bodyMedium" mr={2}>
            X&nbsp;Axis
          </Text>
          <Input
            ref={this.setXInput}
            placeholder="Click to enter title"
            value={xTitle}
            onChange={this.onXTitleChange}
            onBlur={this.onInputBlur}
            onKeyDown={this.onXKeyDown}
          />
        </Flex>
        <Flex align="center" my={2}>
          <Text font="bodyMedium" mr={2}>
            Y&nbsp;Axis
          </Text>
          <Input
            ref={this.setYInput}
            placeholder="Click to enter title"
            value={yTitle}
            onChange={this.onYTitleChange}
            onBlur={this.onInputBlur}
            onKeyDown={this.onYKeyDown}
          />
        </Flex>
        <Flex align="center">
          <TextSpan font="bodyMedium" mr={2}>
            Font Size
          </TextSpan>
          <Box mx={2}>
            <ComboBox
              width="55px"
              selected={fontSize}
              setSelection={this.onFontChange}
            >
              <MenuItem id="10" name="10" />
              <MenuItem id="12" name="12" />
              <MenuItem id="14" name="14" />
              <MenuItem id="16" name="16" />
              <MenuItem id="20" name="20" />
              <MenuItem id="24" name="24" />
            </ComboBox>
          </Box>
        </Flex>
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ChartInspector/customize/AxisTitleEditor.js