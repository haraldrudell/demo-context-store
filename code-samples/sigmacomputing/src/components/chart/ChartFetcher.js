// @flow
import React, { Component } from 'react';
import type { Query } from '@sigmacomputing/sling';
import { isEqual } from 'lodash';

import Loading from 'components/widgets/Loading';
import { LaserBeam } from 'widgets';
import type { ColumnTypes, Values, RefetchSettingsTy } from 'types';
import type Chart from 'utils/chart/Chart';
import { type ChartIR, toIR } from 'utils/chart/ir';
import { serializeForEval } from 'utils/chart/eval';
import { needsEval, evalCharts } from 'utils/apiCaller';

import Fetcher, { type IntervalSettings } from 'components/Fetcher';
import VegaChart from './VegaChart';

type ChartFetchResult = {
  ir: ChartIR,
  tables: Array<{ table: Values }>
};

type Props = {
  chart: Chart,
  columnTypes: ColumnTypes,
  data: ?ChartFetchResult,
  connectionId: string,
  height: number,
  isLoading: boolean,
  query: Query,
  refetchSettings?: RefetchSettingsTy,
  width: number,
  thumbnail: boolean
};

class ChartFetcher extends Component<Props> {
  render() {
    const { data, isLoading, ...rest } = this.props;
    const { height, width } = this.props;

    if (!data) {
      return (
        <Loading
          height={`${height}px`}
          width={`${width}px`}
          text="Loading Chart"
        />
      );
    }
    // use the ir from data.ir so it's consistent with the data
    return (
      <div style={{ height, width }}>
        <LaserBeam show={isLoading} />
        <VegaChart
          {...rest}
          ir={data.ir}
          tables={data.tables}
          config={this.props.chart.config}
        />
      </div>
    );
  }
}

function fetch(props, prevProps, refetch) {
  const ir = toIR(props.chart, props.columnTypes);
  if (props.query) {
    const serChart = serializeForEval(ir);

    // If the chart has changed visually but doesn't require a new fetch
    // then we can reuse the data with a new chart
    if (props.prevData && prevProps && !refetch) {
      const prevIr = toIR(prevProps.chart, prevProps.columnTypes);
      const prevSerChart = serializeForEval(prevIr);
      if (
        isEqual(serChart, prevSerChart) &&
        !needsEval(props.query, prevProps.query)
      ) {
        // chart has only changed (visually) since last fetch
        return Promise.resolve({
          ...props.prevData,
          ir
        });
      }
    }

    return evalCharts(
      props.query,
      serChart,
      props.connectionId
    ).then(({ tables }) => {
      return {
        tables,
        ir
      };
    });
  }
  return Promise.resolve();
}

function needsFetch(nextProps: Props, currentProps: Props) {
  return (
    needsEval(nextProps.query, currentProps.query) ||
    nextProps.chart !== currentProps.chart
  );
}

function fetchInterval(nextProps: Props): ?IntervalSettings {
  if (!nextProps.refetchSettings) {
    return null;
  }

  const {
    autoEnabled,
    refetchTime,
    startTime,
    endTime
  } = nextProps.refetchSettings;
  if (autoEnabled) {
    return {
      interval: refetchTime,
      startTime,
      endTime
    };
  }
  return null;
}

export default Fetcher(ChartFetcher, fetch, needsFetch, fetchInterval);



// WEBPACK FOOTER //
// ./src/components/chart/ChartFetcher.js