// @flow

import * as React from 'react';
import type { Id, Query } from '@sigmacomputing/sling';

import type { ColumnTypes } from 'types';
import type Chart from 'utils/chart/Chart';
import { Flex, Icon, Popup, Menu } from 'widgets';
import ChartToolbar from './ChartToolbar';
import ToolbarButton from './ToolbarButton';

const { MenuItem } = Menu;

type Props = {
  query: Query,
  columnTypes: ColumnTypes,
  connectionId: string,
  charts: { [Id]: Chart },
  currentChartId: ?Id,
  onAddChart: () => void,
  onAddColumn: () => void,
  onDeleteChart: Id => void,
  onSelectChart: string => void,
  onToggleChart: () => void,
  onToggleTable: () => void,
  onToggleInspector: () => void,
  showChart: boolean,
  showTable: boolean,
  showInspector: boolean
};

export default class Toolbar extends React.Component<Props, {}> {
  onMenuItemClick = (key: string) => {
    const { onToggleChart, onToggleTable, onToggleInspector } = this.props;
    if (key === 'chart') {
      onToggleChart();
    } else if (key === 'table') {
      onToggleTable();
    } else if (key === 'inspector') {
      onToggleInspector();
    }
  };

  renderViewMenu() {
    const { charts, showTable, showChart, showInspector } = this.props;
    return (
      <Flex ml="auto">
        <Popup
          target={<ToolbarButton icon="views" text="Views" showCaret />}
          popupPlacement="bottom-end"
          doNotLayer
          closeOnClick={false}
        >
          <Menu onMenuItemClick={this.onMenuItemClick}>
            <MenuItem
              id="chart"
              disabled={Object.keys(charts).length === 0}
              name={
                <div>
                  <Icon opacity={showChart ? 1 : 0} type="check" mr={2} />Show
                  Chart
                </div>
              }
            />
            <MenuItem
              id="table"
              name={
                <div>
                  <Icon opacity={showTable ? 1 : 0} type="check" mr={2} />Show
                  Table
                </div>
              }
            />
            <MenuItem
              id="inspector"
              name={
                <div>
                  <Icon
                    opacity={showInspector ? 1 : 0}
                    type="check"
                    mr={2}
                  />Show Inspector
                </div>
              }
            />
          </Menu>
        </Popup>
      </Flex>
    );
  }

  render() {
    const {
      charts,
      currentChartId,
      onAddChart,
      onAddColumn,
      onDeleteChart,
      onSelectChart,
      connectionId,
      columnTypes,
      query
    } = this.props;

    return (
      <Flex
        width="100%"
        bb={1}
        borderColor="darkBlue4"
        align="center"
        px={3}
        py={2}
        bg="white"
      >
        <ChartToolbar
          query={query}
          connectionId={connectionId}
          columnTypes={columnTypes}
          current={currentChartId}
          onAddChart={onAddChart}
          onDeleteChart={onDeleteChart}
          charts={charts}
          onSelectChart={onSelectChart}
        />
        <ToolbarButton
          icon="add-column"
          text="New Column"
          iconSize="20px"
          onClick={onAddColumn}
        />
        {this.renderViewMenu()}
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/toolbar/Toolbar.js