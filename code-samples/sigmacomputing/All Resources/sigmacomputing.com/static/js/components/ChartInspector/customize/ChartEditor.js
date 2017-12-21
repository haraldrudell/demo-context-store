// @flow
import * as React from 'react';
import { cloneDeep } from 'lodash';

import type Chart from 'utils/chart/Chart';
import type {
  AxisOptions,
  AxisTitleOptions,
  ChartTitleOptions,
  LegendOptions
} from 'utils/chart/ChartConfig';
import { Box, Flex, Text, Checkbox } from 'widgets';
import AxisEditor from './AxisEditor';
import LegendEditor from './LegendEditor';
import AxisTitleEditor from './AxisTitleEditor';
import ChartTitleEditor from './ChartTitleEditor';

type Props = {
  chart: Chart,
  onUpdate: (chart: Chart) => void
};

const OptionCheckbox = ({
  text,
  checked,
  onChange
}: {
  checked: boolean,
  onChange: () => void,
  text: string
}) => {
  return (
    <Box inline width="100px">
      <Checkbox checked={checked} onChange={onChange}>
        {text}
      </Checkbox>
    </Box>
  );
};

export default class ChartEditor extends React.Component<Props, {}> {
  onToggleTitle = () => {
    const { onUpdate, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.config.toggleTitle();
    onUpdate(newChart);
  };

  onToggleLegend = () => {
    const { onUpdate, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.config.toggleLegend();
    onUpdate(newChart);
  };

  onToggleBorder = () => {
    const { onUpdate, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.config.toggleBorder();
    onUpdate(newChart);
  };

  onToggleTooltip = () => {
    const { onUpdate, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.config.toggleTooltip();
    onUpdate(newChart);
  };

  onAxisTitleChange = (axisTitle: AxisTitleOptions) => {
    const { onUpdate, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.config.updateAxisTitle(axisTitle);
    onUpdate(newChart);
  };

  onChartTitleChange = (chartTitle: ChartTitleOptions) => {
    const { onUpdate, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.config.updateTitleConfig(chartTitle);
    onUpdate(newChart);
  };

  onAxisChange = (axis: 'x' | 'y', options: AxisOptions) => {
    const { onUpdate, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.config.updateAxis(axis, options);
    onUpdate(newChart);
  };

  onLegendChange = (legend: LegendOptions) => {
    const { onUpdate, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.config.updateLegend(legend);
    onUpdate(newChart);
  };

  renderSectionHeader(
    title: string,
    component: React.Element<any>,
    isLast?: boolean
  ) {
    return (
      <Box bb={isLast ? 0 : 1} borderColor="darkBlue4">
        <Flex align="center" p={3} bg="white" bb={1} borderColor="darkBlue4">
          <Text font="header5">{title}</Text>
        </Flex>
        {component}
      </Box>
    );
  }

  renderSectionBody() {
    const { chart } = this.props;
    return (
      <Box p={3}>
        <Text font="header5">Options</Text>
        <OptionCheckbox
          text="Title"
          checked={
            chart.config.title.hasTitle !== undefined
              ? chart.config.title.hasTitle
              : true
          }
          onChange={this.onToggleTitle}
        />
        <OptionCheckbox
          text="Border"
          checked={Boolean(chart.config.misc.hasBorder)}
          onChange={this.onToggleBorder}
        />
        <br />
        <OptionCheckbox
          text="Legend"
          checked={
            chart.config.legend.hasLegend !== undefined
              ? chart.config.legend.hasLegend
              : true
          }
          onChange={this.onToggleLegend}
        />
        <OptionCheckbox
          text="Tooltip"
          checked={
            chart.config.tooltip.hasTooltip !== undefined
              ? chart.config.tooltip.hasTooltip
              : true
          }
          onChange={this.onToggleTooltip}
        />
      </Box>
    );
  }

  render() {
    const { chart } = this.props;
    return (
      <Box bg="darkBlue6">
        {this.renderSectionHeader('Chart Style', this.renderSectionBody())}
        {this.renderSectionHeader(
          'Chart Title',
          <ChartTitleEditor
            chartTitle={chart.config.title}
            onChartTitleChange={this.onChartTitleChange}
          />
        )}
        {this.renderSectionHeader(
          'Axis Titles',
          <AxisTitleEditor
            axisTitle={chart.config.axisTitle}
            onAxisTitleChange={this.onAxisTitleChange}
          />
        )}
        {this.renderSectionHeader(
          'Horizontal Axis',
          <AxisEditor
            axis="x"
            config={chart.config.axisX}
            onAxisChange={this.onAxisChange}
          />
        )}
        {this.renderSectionHeader(
          'Vertical Axis',
          <AxisEditor
            axis="y"
            config={chart.config.axisY}
            onAxisChange={this.onAxisChange}
          />
        )}
        {this.renderSectionHeader(
          'Legend',
          <LegendEditor
            legend={chart.config.legend}
            onLegendChange={this.onLegendChange}
          />,
          true
        )}
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ChartInspector/customize/ChartEditor.js