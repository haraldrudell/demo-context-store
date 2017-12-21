// @flow
import * as React from 'react';
import type { Query } from '@sigmacomputing/sling';

import type { Id, ColumnTypes, Values } from 'types';
import type Chart from 'utils/chart/Chart';
import { makeCancelable, type CancelablePromise } from 'utils/promise';
import { Box, Icon, Flex, Popup, Text } from 'widgets';
import { serializeForEval } from 'utils/chart/eval';
import { type ChartIR, toIR } from 'utils/chart/ir';
import { evalCharts, handleApiError } from 'utils/apiCaller';
import ChartMenuItem from './ChartMenuItem';
import ToolbarButton from './ToolbarButton';

type Props = {
  current: ?Id,
  query: Query,
  columnTypes: ColumnTypes,
  connectionId: string,
  charts: { [Id]: Chart },
  onAddChart: () => void,
  onDeleteChart: Id => void,
  onSelectChart: string => void
};

type ChartItem = {| id: Id, chart: Chart |};
type ChartFetchResult = {
  ir: ChartIR,
  tables: Array<{ table: Values }>
};

function cmpChart(a: ChartItem, b: ChartItem): number {
  const aTitle = a.chart.config.title.text.toUpperCase();
  const bTitle = b.chart.config.title.text.toUpperCase();
  if (aTitle < bTitle) {
    return -1;
  } else if (aTitle > bTitle) {
    return 1;
  }
  return 0;
}

function sortCharts(charts: { [Id]: Chart }): Array<ChartItem> {
  const ret = Object.keys(charts).map(id => {
    return { id, chart: charts[id] };
  });
  ret.sort(cmpChart);
  return ret;
}

export default class ChartToolbar extends React.Component<
  Props,
  {
    sortedCharts: Array<ChartItem>,
    chartData: { [Id]: ChartFetchResult }
  }
> {
  promises: { [Id]: CancelablePromise };

  constructor(props: Props) {
    super(props);
    const { charts } = props;

    this.promises = {};
    this.state = {
      sortedCharts: sortCharts(charts),
      chartData: {}
    };
    this.fetchCharts(props);
  }

  fetchCharts(props: Props) {
    const { charts, columnTypes, query, connectionId } = props;
    const { chartData } = this.state;
    let newChartData = {};

    // Only keep the current charts
    Object.keys(chartData).forEach(chartId => {
      if (chartData[chartId] && charts[chartId]) {
        newChartData[chartId] = chartData[chartId];
      }
    });

    Object.keys(charts).forEach(chartId => {
      const chart = charts[chartId];
      const ir = toIR(chart, columnTypes);
      const serChart = serializeForEval(ir);

      if (!chart.isEmpty() && !chartData[chartId] && !this.promises[chartId]) {
        this.promises[chartId] = makeCancelable(
          evalCharts(query, serChart, connectionId)
        );

        this.promises[chartId].promise
          .then(({ tables }) => {
            newChartData = {
              ...newChartData,
              [chartId]: {
                tables,
                ir
              }
            };
            this.setState({
              chartData: newChartData
            });
          })
          .catch(e => {
            if (!e.isCanceled) {
              handleApiError('EvalChart Failure', e);
            }
          });
      }
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.charts !== this.props.charts) {
      this.setState({
        sortedCharts: sortCharts(nextProps.charts)
      });
      this.fetchCharts(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.promises) {
      Object.keys(this.promises).forEach(chartId => {
        this.promises[chartId].cancel();
        delete this.promises[chartId];
      });
    }
  }

  renderMenu() {
    const {
      current,
      onSelectChart,
      onDeleteChart,
      query,
      onAddChart,
      columnTypes
    } = this.props;
    const { chartData, sortedCharts } = this.state;

    return (
      <Popup
        popupPlacement="bottom"
        target={<ToolbarButton icon="charts" showCaret text="Charts" mr={4} />}
        inline={false}
        closeOnClick={false}
        closeOnResize={false}
      >
        <Box bg="white" css={`max-height: 75vh; overflow: auto;`}>
          <Flex align="center" justify="flex-end" p={2}>
            <Text
              color="blue"
              mr={2}
              font="header5"
              css={`cursor: pointer;`}
              onClick={onAddChart}
            >
              <Icon color="blue" mr={1} size="10px" type="plus" />
              Add Chart
            </Text>
          </Flex>
          {sortedCharts.map(({ id, chart }) => {
            return (
              <Box key={id} bt={1} pb={2} borderColor="darkBlue4">
                <ChartMenuItem
                  chart={chart}
                  query={query}
                  ir={chartData[id] ? chartData[id].ir : null}
                  tables={chartData[id] ? chartData[id].tables : null}
                  columnTypes={columnTypes}
                  selected={current === chart.id}
                  onSelectChart={onSelectChart}
                  onDeleteChart={onDeleteChart}
                />
              </Box>
            );
          })}
        </Box>
      </Popup>
    );
  }

  addChartButton() {
    const { onAddChart } = this.props;

    return (
      <ToolbarButton icon="charts" onClick={onAddChart} text="Charts" mr={4} />
    );
  }

  render() {
    const { sortedCharts } = this.state;
    return sortedCharts.length > 0 ? this.renderMenu() : this.addChartButton();
  }
}



// WEBPACK FOOTER //
// ./src/components/toolbar/ChartToolbar.js