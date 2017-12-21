// @flow
import React, { Component } from 'react';

import type { LegendOptions } from 'utils/chart/ChartConfig';
import { Box, Flex, TextSpan, ComboBox, Menu } from 'widgets';
import { DEFAULT_VEGA_CONFIG } from 'components/chart/VegaLite';

const { MenuItem } = Menu;

export default class LegendEditor extends Component<
  {
    legend: LegendOptions,
    onLegendChange: LegendOptions => void
  },
  {}
> {
  onTitleChange = (titleFontSize: string) => {
    const { onLegendChange, legend } = this.props;
    onLegendChange({ ...legend, titleFontSize });
  };

  onLabelChange = (labelFontSize: string) => {
    const { onLegendChange, legend } = this.props;
    onLegendChange({ ...legend, labelFontSize });
  };

  onOrientChange = (orient: string) => {
    const { onLegendChange, legend } = this.props;
    onLegendChange({ ...legend, orient });
  };

  render() {
    const { legend } = this.props;
    const {
      labelFontSize = DEFAULT_VEGA_CONFIG.legend.labelFontSize.toString(),
      titleFontSize = DEFAULT_VEGA_CONFIG.legend.titleFontSize.toString(),
      orient = DEFAULT_VEGA_CONFIG.legend.orient
    } = legend;

    return (
      <Box p={3}>
        <Flex align="center">
          <TextSpan font="bodyMedium" mr={2}>
            Position
          </TextSpan>
          <Box mx={2}>
            <ComboBox
              width="75px"
              selected={orient}
              setSelection={this.onOrientChange}
            >
              <MenuItem id="right" name="Right" />
              <MenuItem id="left" name="Left" />
            </ComboBox>
          </Box>
        </Flex>
        <Flex align="center" my={2}>
          <TextSpan font="bodyMedium" mr={2}>
            Title Font Size
          </TextSpan>
          <Box mx={2}>
            <ComboBox
              width="55px"
              selected={titleFontSize}
              setSelection={this.onTitleChange}
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
        <Flex align="center">
          <TextSpan font="bodyMedium" mr={2}>
            Label Font Size
          </TextSpan>
          <Box mx={2}>
            <ComboBox
              width="55px"
              selected={labelFontSize}
              setSelection={this.onLabelChange}
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
// ./src/components/ChartInspector/customize/LegendEditor.js