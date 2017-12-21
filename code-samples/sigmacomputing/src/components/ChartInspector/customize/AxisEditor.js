// @flow
import React, { Component } from 'react';

import type { AxisOptions } from 'utils/chart/ChartConfig';
import { Box, Flex, TextSpan, ComboBox, Menu } from 'widgets';
import { DEFAULT_VEGA_CONFIG } from 'components/chart/VegaLite';

const { MenuItem } = Menu;

type Axis = 'x' | 'y';

export default class AxisEditor extends Component<
  {
    axis: Axis,
    config: AxisOptions,
    onAxisChange: (Axis, AxisOptions) => void
  },
  {}
> {
  onFontChange = (size: string) => {
    const { axis, onAxisChange, config } = this.props;
    onAxisChange(axis, { ...config, fontSize: size });
  };

  onAngleChange = (angle: string) => {
    const { axis, onAxisChange, config } = this.props;
    onAxisChange(axis, { ...config, labelAngle: angle });
  };

  render() {
    const { axis, config } = this.props;
    const {
      fontSize = DEFAULT_VEGA_CONFIG.axisX.labelFontSize.toString(),
      labelAngle = axis === 'x'
        ? DEFAULT_VEGA_CONFIG.axisX.labelAngle.toString()
        : DEFAULT_VEGA_CONFIG.axisY.labelAngle.toString()
    } = config;

    return (
      <Box p={3}>
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

        <Flex align="center" mt={2}>
          <TextSpan font="bodyMedium" mr={2}>
            Label Angle
          </TextSpan>
          <Box mx={2}>
            <ComboBox
              width="60px"
              selected={labelAngle}
              setSelection={this.onAngleChange}
            >
              <MenuItem id="0" name="0" />
              <MenuItem id="-45" name="-45" />
              <MenuItem id="-90" name="-90" />
            </ComboBox>
          </Box>
        </Flex>
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ChartInspector/customize/AxisEditor.js