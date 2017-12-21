// @flow

import React, { PureComponent } from 'react';
import { debounce } from 'lodash';

import { Box, Flex } from 'widgets';
import Loading from 'components/widgets/Loading';
import Histogram from './RangeHistogram';
import type { Bin } from './RangeHistogram';
import NumberRange from './NumberRange';
import DateRange from './DateRange';
import NullFilter from './NullFilter';

const DEFAULT_FILTER_HEIGHT = 120;
const DEFAULT_FILTER_WIDTH = 236;

type Props = {|
  binStart: ?number,
  binEnd: ?number,
  bins: ?Array<Bin>,
  columnType: 'number' | 'datetime',
  height: number,
  includeNulls: boolean,
  nullCount: ?number,
  onSelect?: (?number, ?number) => void,
  onToggleNulls?: () => void,
  selection: [?number, ?number],
  width: number
|};

export default class RangeFilter extends PureComponent<
  Props,
  {
    selection: [?number, ?number]
  }
> {
  debounceUpdate: (?number, ?number) => void;

  static defaultProps = {
    columnType: 'number',
    height: DEFAULT_FILTER_HEIGHT,
    width: DEFAULT_FILTER_WIDTH
  };

  constructor(props: Props) {
    super(props);

    const { selection, onSelect } = props;
    this.state = { selection };

    if (onSelect) this.debounceUpdate = debounce(onSelect, 400);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.selection !== this.props.selection) {
      this.setState({ selection: nextProps.selection });
    }
  }

  onHistogramSelect = (lo: ?number, hi: ?number) => {
    this.setState({
      selection: [lo, hi]
    });
    if (this.debounceUpdate) this.debounceUpdate(lo, hi);
  };

  render() {
    const { selection } = this.state;
    const {
      binStart,
      binEnd,
      bins,
      columnType,
      height,
      includeNulls,
      nullCount,
      onSelect,
      onToggleNulls,
      width
    } = this.props;

    let [min, max] = selection;
    if (binStart != null && (min == null || binStart < min)) min = binStart;
    if (binEnd != null && (max == null || binEnd > max)) max = binEnd;

    const RangeInput = columnType === 'datetime' ? DateRange : NumberRange;

    return (
      <div>
        <Flex align="center" column>
          {bins && binStart != null && binEnd != null ? (
            <Histogram
              binStart={binStart}
              binEnd={binEnd}
              bins={bins}
              height={height}
              onSelect={this.onHistogramSelect}
              selection={selection}
              width={width}
            />
          ) : (
            <Box width="100%" css={`height: ${height}px;`}>
              <Loading text="Loading Range" />
            </Box>
          )}
          <RangeInput
            bounds={[min, max]}
            onChange={onSelect}
            selection={selection}
            width={width}
          />
        </Flex>
        <NullFilter
          count={nullCount}
          includeNulls={includeNulls}
          onChange={onToggleNulls}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/RangeFilter.js