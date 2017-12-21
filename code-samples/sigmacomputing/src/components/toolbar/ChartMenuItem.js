// @flow
import React, { Component } from 'react';
import type { Query } from '@sigmacomputing/sling';

import { type ChartIR } from 'utils/chart/ir';
import type Chart from 'utils/chart/Chart';
import type { ColumnTypes, Values } from 'types';

import Loading from 'components/widgets/Loading';
import VegaChart from 'components/chart/VegaChart';
import { Box, Flex, IconButton, Text } from 'widgets';
import colors from 'styles/colors';
import BarChartIcon from 'icons/bar_chart.svg';

type Props = {
  chart: Chart,
  query: Query,
  ir: ?ChartIR,
  tables: ?Array<{ table: Values }>,
  columnTypes: ColumnTypes,
  selected: boolean,
  onSelectChart: string => void,
  onDeleteChart: string => void
};

export default class ChartListItem extends Component<Props> {
  onSelectChart = () => {
    const { chart, onSelectChart } = this.props;
    onSelectChart(chart.id);
  };

  onDeleteChart = () => {
    const { chart, onDeleteChart } = this.props;
    onDeleteChart(chart.id);
  };

  renderChart() {
    const { ir, tables, query, columnTypes } = this.props;
    const height = 90;
    const width = 200;

    if (!ir || !tables) {
      return <Loading width={`${width}px`} height={`${height}px`} />;
    }

    return (
      <div style={{ height, width }}>
        <VegaChart
          thumbnail
          query={query}
          height={height}
          width={width}
          columnTypes={columnTypes}
          ir={ir}
          tables={tables}
          config={this.props.chart.config}
        />
      </div>
    );
  }

  render() {
    const { chart, selected } = this.props;

    return (
      <Flex column align="center" px={3} py={2}>
        <Flex width="100%" align="center" justify="space-between" mb={2}>
          <Text font="bodyMedium" semiBold truncate>
            {chart.config.title.text}
          </Text>
          <IconButton type="close" size="10px" onClick={this.onDeleteChart} />
        </Flex>
        <Box
          px={1}
          pt={1}
          b={1}
          borderColor={selected ? 'blueAccent' : 'darkBlue4'}
          onClick={this.onSelectChart}
          css={`
              cursor: pointer;
              ${selected
                ? `box-shadow: inset 0 0 0 1px ${colors.blueAccent};`
                : ``}
              &:hover {
                box-shadow: inset 0 0 0 1px ${colors.blueAccent};
                border-color: ${colors.blueAccent};
              }
            `}
        >
          {chart.isEmpty() ? (
            <Flex column align="center" width="200px" css={`height: 90px;`}>
              <img
                css={`
                  height: 64px;
                  width 64px;
                `}
                alt=""
                src={BarChartIcon}
              />
              <Text font="bodyMedium">Empty Chart</Text>
            </Flex>
          ) : (
            this.renderChart()
          )}
        </Box>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/toolbar/ChartMenuItem.js