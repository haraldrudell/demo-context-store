// @flow

import React, { PureComponent } from 'react';
import type { Query } from '@sigmacomputing/sling';
import Measure from 'react-measure';

import type Chart from 'utils/chart/Chart';
import type { ColumnTypes, RefetchSettingsTy } from 'types';
import { Flex, Text } from 'widgets';
import ChartFetcher from './ChartFetcher';

import BarChartIcon from 'icons/bar_chart.svg';

type Props = {
  chart: Chart,
  columnTypes: ColumnTypes,
  connectionId: string,
  query: Query,
  refetchSettings?: RefetchSettingsTy,
  onClick?: () => void
};

type State = {
  height: number,
  width: number
};

export default class ChartContainer extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      height: 0,
      width: 0
    };
  }

  onResize = (rect: { bounds: { height: number, width: number } }) => {
    const { height, width } = rect.bounds;
    if (height !== this.state.height || width !== this.state.width) {
      this.setState({ height, width });
    }
  };

  render() {
    const {
      chart,
      columnTypes,
      connectionId,
      query,
      onClick,
      refetchSettings
    } = this.props;

    if (chart.isEmpty()) {
      return (
        <Flex
          width="100%"
          css={`height: 100%;`}
          align="center"
          color="darkBlue3"
          column
          justify="center"
        >
          <img
            css={`
              height: 128px;
              width 128px;
            `}
            alt=""
            src={BarChartIcon}
          />
          <Text font="header2">Create a Chart</Text>
          <Text font="header3">Drag a column to the X or Y Axis</Text>
        </Flex>
      );
    }

    const { height, width } = this.state;
    return (
      <Flex css={`height: 100%;`} width="100%" onClick={onClick}>
        <Measure bounds onResize={this.onResize}>
          {({ measureRef }) => (
            <div ref={measureRef} css={`height: 100%; width: 100%;`}>
              <ChartFetcher
                chart={chart}
                columnTypes={columnTypes}
                connectionId={connectionId}
                height={height}
                query={query}
                width={width}
                refetchSettings={refetchSettings}
              />
            </div>
          )}
        </Measure>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/chart/ChartContainer.js