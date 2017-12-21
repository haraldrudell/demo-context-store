// // @flow
import React, { Component } from 'react';
import { type Id, type Query, checkColumns } from '@sigmacomputing/sling';

import type Chart from 'utils/chart/Chart';
import { loadWorkbook } from 'api/workbook';
import type { ColumnTypes, RefetchSettingsTy } from 'types';
import type { DashboardTile } from 'containers/Dashboard';

import Loading from 'components/widgets/Loading';
import ChartContainer from 'components/chart/ChartContainer';
import Fetcher from 'components/Fetcher';

type QueryDef = {
  connectionId: Id,
  query: Query,
  charts: { [Id]: Chart },
  columnTypes: ColumnTypes
};

type Props = {
  data: ?QueryDef,
  tile: DashboardTile,
  refetchSettings: RefetchSettingsTy
};

class TileFetcher extends Component<Props> {
  render() {
    const { data, tile, refetchSettings } = this.props;
    if (tile.def.type !== 'chart') {
      // TODO: Non-Chart Types
      return null;
    }
    const qdef = data;
    if (!qdef || !qdef.query) return <Loading text="Loading Query" />;

    return (
      <ChartContainer
        chart={qdef.charts[tile.def.chartId]}
        connectionId={qdef.connectionId}
        query={qdef.query}
        columnTypes={qdef.columnTypes}
        refetchSettings={refetchSettings}
      />
    );
  }
}

function fetch(props: Props) {
  const { tile } = props;
  if (tile.def.type === 'chart') {
    const { wsId } = tile.def;
    return loadWorkbook(wsId).then(({ query, connection, charts }) => {
      if (!query) throw new Error(`Query missing for ${wsId}`);
      const columnTypes = {};
      const checks = checkColumns(query);
      checks.forEach((check, colId) => (columnTypes[colId] = check.ty));

      return {
        connectionId: connection.id,
        query,
        charts,
        columnTypes
      };
    });
  }
  return Promise.resolve();
}

function needsFetch(nextProps: Props, currentProps: Props) {
  return nextProps.tile !== currentProps.tile;
}

export default Fetcher(TileFetcher, fetch, needsFetch);



// WEBPACK FOOTER //
// ./src/containers/Dashboard/TileFetcher.js