// @flow
import React, { Component } from 'react';
import { checkColumns } from '@sigmacomputing/sling';

import Fetcher from 'components/Fetcher';
import { loadWorkbook } from 'api/workbook';
import ChartListItem from './ChartListItem';
import Loading from 'components/widgets/Loading';

type Props = {
  data: ?Object,
  isLoading: boolean,

  selectedWorksheet: ?string,
  selectedCharts: { [chartId: string]: boolean },
  onToggleChart: string => void
};

class ChartList extends Component<Props> {
  renderPlaceholder() {
    return null;
  }

  renderChart(worksheet, chart) {
    if (chart.isEmpty()) {
      return null;
    }
    const { selectedCharts, onToggleChart } = this.props;
    const checks = checkColumns(worksheet.query);
    const types = {};
    checks.forEach((check, colId) => (types[colId] = check.ty));

    return (
      <ChartListItem
        onToggleChart={onToggleChart}
        selected={selectedCharts[chart.id]}
        key={chart.id}
        query={worksheet.query}
        chart={chart}
        columnTypes={types}
        connectionId={worksheet.connection.id}
      />
    );
  }

  render() {
    const { data, isLoading, selectedWorksheet } = this.props;

    if (!data || isLoading) {
      return <Loading text="Loading..." />;
    }

    if (!selectedWorksheet) {
      return this.renderPlaceholder();
    }
    const { charts } = data;
    if (charts) {
      return (
        <div>
          {Object.keys(charts).map(chartId =>
            this.renderChart(data, charts[chartId])
          )}
        </div>
      );
    }
    return null;
  }
}

function fetch(props: Props) {
  if (props.selectedWorksheet) {
    return loadWorkbook(props.selectedWorksheet);
  }
  return Promise.resolve([]);
}

function needsFetch(nextProps: Props, currentProps: Props) {
  return nextProps.selectedWorksheet !== currentProps.selectedWorksheet;
}

export default Fetcher(ChartList, fetch, needsFetch);



// WEBPACK FOOTER //
// ./src/components/DashboardModal/ChartList.js