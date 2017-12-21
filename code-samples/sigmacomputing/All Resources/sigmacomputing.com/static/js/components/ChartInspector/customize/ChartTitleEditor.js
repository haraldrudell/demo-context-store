// @flow
import React, { Component } from 'react';

import type { ChartTitleOptions } from 'utils/chart/ChartConfig';
import { Box, Flex, Input, Text, TextSpan, ComboBox, Menu } from 'widgets';
import { DEFAULT_VEGA_CONFIG } from 'components/chart/VegaLite';

const { MenuItem } = Menu;

type Props = {
  chartTitle: ChartTitleOptions,
  onChartTitleChange: ChartTitleOptions => void
};

export default class ChartTitleEditor extends Component<
  Props,
  {
    title: string
  }
> {
  input: Input;

  constructor(props: Props) {
    super(props);

    this.state = {
      title: props.chartTitle.text || ''
    };
  }

  onFontChange = (size: string) => {
    const { onChartTitleChange, chartTitle } = this.props;
    onChartTitleChange({ ...chartTitle, fontSize: size });
  };

  onTitleChange = (e: SyntheticInputEvent<>) => {
    this.setState({
      title: e.target.value
    });
  };

  onInputBlur = () => {
    const { onChartTitleChange, chartTitle } = this.props;
    const { title } = this.state;

    if (title !== chartTitle.text) {
      onChartTitleChange({ ...chartTitle, text: title });
    }
  };

  onKeyDown = (e: SyntheticKeyboardEvent<>) => {
    if (e.key === 'Enter') {
      this.input.refs.input.blur();
    }
  };

  setInput = (r: Input) => {
    this.input = r;
  };

  render() {
    const { chartTitle } = this.props;
    const {
      fontSize = DEFAULT_VEGA_CONFIG.title.fontSize.toString()
    } = chartTitle;
    const { title } = this.state;

    return (
      <Box p={3}>
        <Flex align="center">
          <Text font="bodyMedium" mr={2}>
            Title
          </Text>
          <Input
            ref={this.setInput}
            placeholder="Click to enter title"
            value={title}
            onChange={this.onTitleChange}
            onBlur={this.onInputBlur}
            onKeyDown={this.onKeyDown}
          />
        </Flex>
        <Flex align="center" mt={2}>
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
// ./src/components/ChartInspector/customize/ChartTitleEditor.js