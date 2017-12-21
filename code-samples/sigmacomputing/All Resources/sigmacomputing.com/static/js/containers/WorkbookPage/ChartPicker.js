// @flow

import React, { PureComponent } from 'react';
import type { Id, Query } from '@sigmacomputing/sling';

import { Box, Flex, IconButton } from 'widgets';
import ChartContainer from 'components/chart/ChartContainer';
import ChartInspector from 'components/ChartInspector';
import type { ColumnTypes } from 'types';
import type Chart from 'utils/chart/Chart';

type Props = {|
  current: ?Id,
  charts: { [Id]: Chart },
  connectionId: Id,
  query: Query,
  columnTypes: ColumnTypes,
  onAdd?: () => void,
  onDelete: string => void,
  onUpdate: (id: Id, chart: Chart) => void,
  onToggleEditor: () => void
|};

export default class ChartPicker extends PureComponent<
  Props,
  {|
    currentLayerId: ?Id
  |}
> {
  constructor(props: Props) {
    super(props);
    let currentLayerId;
    const { current, charts } = props;
    if (current && charts[current]) {
      currentLayerId = charts[current].layers[0];
    }

    this.state = {
      currentLayerId
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.current !== this.props.current) {
      const { current, charts } = nextProps;
      let currentLayerId;
      if (current && charts[current]) {
        currentLayerId = charts[current].layers[0];
      }
      this.setState({ currentLayerId });
    }
  }

  onAddChart = () => {
    const { onAdd } = this.props;
    onAdd && onAdd();
  };

  onDeleteChart = () => {
    const { current, onDelete } = this.props;
    current && onDelete(current);
  };

  onUpdateChart = (chart: Chart) => {
    const { onUpdate, current } = this.props;
    onUpdate && current && onUpdate(current, chart);
  };

  onSwitchLayer = (currentLayerId: Id) => this.setState({ currentLayerId });

  renderChartBar() {
    const { current, charts } = this.props;
    const currentChart = current && charts[current];

    return (
      <Flex justify="space-between" align="center" px={2}>
        <Flex font="header5">Charts</Flex>
        <Box>
          {currentChart && (
            <IconButton
              onClick={this.onDeleteChart}
              size="14px"
              p={1}
              type="trash"
            />
          )}
          <IconButton onClick={this.onAddChart} p={1} size="12px" type="plus" />
        </Box>
      </Flex>
    );
  }

  render() {
    const { currentLayerId } = this.state;
    const {
      current,
      charts,
      query,
      columnTypes,
      onToggleEditor,
      connectionId
    } = this.props;

    const currentChart = current && charts[current];

    return (
      <Flex bb={1} bg="white" borderColor="darkBlue4" flexGrow>
        <Flex flexGrow column>
          {this.renderChartBar()}
          {currentChart && (
            <Flex flexGrow width="100%">
              <ChartContainer
                chart={currentChart}
                connectionId={connectionId}
                columnTypes={columnTypes}
                query={query}
                onClick={onToggleEditor}
              />
            </Flex>
          )}
        </Flex>
        {currentChart &&
          currentLayerId && (
            <ChartInspector
              labels={query.view.labels}
              chart={currentChart}
              layerId={currentLayerId}
              columns={query.columns}
              types={columnTypes}
              setChart={this.onUpdateChart}
              setLayerId={this.onSwitchLayer}
            />
          )}
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/WorkbookPage/ChartPicker.js