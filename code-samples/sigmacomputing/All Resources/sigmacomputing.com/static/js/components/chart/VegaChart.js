// @flow
import React, { PureComponent } from 'react';
import type { Query } from '@sigmacomputing/sling';

import type ChartConfig from 'utils/chart/ChartConfig';
import type { Values, ColumnTypes } from 'types';
import { flattenAndMerge } from 'utils/table';
import { type ChartIR } from 'utils/chart/ir';
import {
  encodeSpec,
  generateTooltipOptions,
  type VegaSpec
} from 'utils/chart/vega';
import VegaLite from './VegaLite';

type Props = {
  ir: ChartIR,
  config: ChartConfig,
  columnTypes: ColumnTypes,
  tables: Array<{ table: Values }>,
  height: number,
  query: Query,
  width: number,
  thumbnail: boolean
};

type State = {
  flatData: { values: Array<Object> },
  spec: VegaSpec,
  tooltipOptions?: Object
};

export default class VegaChart extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { ir, columnTypes, query, thumbnail, config } = props;
    this.state = {
      flatData: flattenAndMerge(props.tables),
      spec: encodeSpec(ir, query, config, columnTypes, thumbnail),
      tooltipOptions: thumbnail
        ? undefined
        : generateTooltipOptions(ir, query, config.tooltip, columnTypes)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tables !== this.props.tables) {
      this.setState({
        flatData: flattenAndMerge(nextProps.tables)
      });
    }

    if (
      nextProps.config !== this.props.config ||
      nextProps.query !== this.props.query ||
      nextProps.ir !== this.props.ir ||
      nextProps.columnTypes !== this.props.columnTypes
    ) {
      const { ir, config, columnTypes, query, thumbnail } = nextProps;
      this.setState({
        spec: encodeSpec(ir, query, config, columnTypes, thumbnail),
        tooltipOptions: thumbnail
          ? undefined
          : generateTooltipOptions(ir, query, config.tooltip, columnTypes)
      });
    }
  }

  render() {
    const { spec, tooltipOptions, flatData } = this.state;
    const { height, width, thumbnail } = this.props;
    return (
      <VegaLite
        thumbnail={thumbnail}
        data={flatData}
        height={height}
        spec={spec}
        tooltipOptions={tooltipOptions}
        width={width}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/chart/VegaChart.js