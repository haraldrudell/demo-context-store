// @flow
import React, { Component } from 'react';
import { Query } from '@sigmacomputing/sling';

import { numFmt } from 'utils/format';
import { Flex, Spin, Text } from 'widgets';
import { handleApiError, needsEval, getRowCount } from 'utils/apiCaller';
import Fetcher from 'components/Fetcher';

type TableInfo = {| rowCount: number, columnCount: number |};

function lbl(count, label) {
  const formattedCount = numFmt.format(count);
  const x = `${formattedCount} ${label}`;
  return count === 1 ? x : `${x}s`;
}

function mkTableInfo(query: Query, count: ?number): ?TableInfo {
  if (count == null) {
    return null;
  }

  return {
    rowCount: count,
    columnCount: Object.keys(query.columns).length
  };
}

type Props = {
  query: Query,
  connectionId: string,
  data: ?number
};

export class RowCount extends Component<Props, { tableInfo: ?TableInfo }> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tableInfo: mkTableInfo(props.query, props.data)
    };
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        tableInfo: mkTableInfo(nextProps.query, nextProps.data)
      });
    }
  }

  render() {
    const { tableInfo } = this.state;
    if (!tableInfo)
      return (
        <Flex align="center" font="header5">
          Loading Table Info...&nbsp;<Spin />
        </Flex>
      );

    const { rowCount, columnCount } = tableInfo;

    return (
      <Text font="header5">
        {lbl(rowCount, 'Row')} – {lbl(columnCount, 'Column')}
      </Text>
    );
  }
}

function fetch(props) {
  if (props.query) {
    return getRowCount(props.query, props.connectionId).catch(e => {
      handleApiError('Count-total Failure', e);
    });
  }
  return Promise.resolve();
}

function needsFetch(nextProps: Props, currentProps: Props) {
  return needsEval(nextProps.query, currentProps.query);
}

export default Fetcher(RowCount, fetch, needsFetch);



// WEBPACK FOOTER //
// ./src/components/RowCount/index.js