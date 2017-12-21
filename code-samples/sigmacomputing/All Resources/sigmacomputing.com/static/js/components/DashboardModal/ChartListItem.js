// @flow
import React, { Component } from 'react';
import type { Query } from '@sigmacomputing/sling';

import type Chart from 'utils/chart/Chart';
import type { ColumnTypes } from 'types';

import ChartFetcher from 'components/chart/ChartFetcher';
import { Box, Flex, Text } from 'widgets';
import styles from './ChartListItem.less';
import colors from 'styles/colors';

type Props = {
  chart: Chart,
  query: Query,
  columnTypes: ColumnTypes,
  connectionId: string,
  selected: boolean,
  onToggleChart: string => void
};

export default class ChartListItem extends Component<Props> {
  onToggleChart = () => {
    const { chart, onToggleChart } = this.props;
    onToggleChart(chart.id);
  };

  render() {
    const { chart, columnTypes, connectionId, selected, query } = this.props;

    return (
      <Flex
        column
        align="center"
        px={3}
        py={2}
        css={`cursor: pointer;`}
        onClick={this.onToggleChart}
        className={styles.container}
      >
        <Box flexGrow mx={3}>
          <Text font="bodyMedium" truncate>
            {chart.config.title.text}
          </Text>
        </Box>
        <Box
          px={1}
          pt={1}
          className={styles.chart}
          b={1}
          borderColor={selected ? 'blueAccent' : 'darkBlue4'}
          css={
            selected ? `box-shadow: inset 0 0 0 1px ${colors.blueAccent};` : ``
          }
        >
          <ChartFetcher
            thumbnail
            chart={chart}
            columnTypes={columnTypes}
            connectionId={connectionId}
            height={90}
            query={query}
            width={200}
          />
        </Box>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DashboardModal/ChartListItem.js