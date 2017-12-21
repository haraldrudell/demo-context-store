// @flow

import React, { PureComponent } from 'react';

import { ResultValues, ResultValue } from './ValueFilter';
import type { ValueDesc } from './ValueFilter';

const genValueDesc = (totalCount, count, isSelected, label): ValueDesc => {
  const percent = totalCount && count ? count / totalCount : 0;
  return { label, count, isSelected, percent };
};

export default class BooleanFilter extends PureComponent<{
  trueCount: ?number,
  falseCount: ?number,
  nullCount: ?number,
  trueSelected: boolean,
  falseSelected: boolean,
  nullSelected: boolean,
  onSelect: string => void,
  onToggleNulls: () => void
}> {
  render() {
    const {
      trueCount,
      falseCount,
      nullCount,
      trueSelected,
      falseSelected,
      nullSelected,
      onSelect,
      onToggleNulls
    } = this.props;

    const totalCount = trueCount + falseCount + nullCount;

    return (
      <div>
        <ResultValues
          values={[
            genValueDesc(totalCount, trueCount, trueSelected, 'True'),
            genValueDesc(totalCount, falseCount, falseSelected, 'False')
          ]}
          onSelect={onSelect}
        />
        <ResultValue
          value={genValueDesc(totalCount, nullCount, nullSelected, 'Null')}
          onClick={onToggleNulls}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/BooleanFilter.js