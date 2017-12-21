// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';

import { ROW_HEIGHT } from 'const/TableConstants';
import styles from './Cell.less';

type Props = {
  height: number,
  isLevelCollapsed?: boolean,
  isLastInLevel: boolean,
  scrollTop: number
};

const cx = classnames.bind(styles);

export default class EmptyColumn extends PureComponent<Props> {
  render() {
    const { height, isLastInLevel, isLevelCollapsed, scrollTop } = this.props;

    const cellTop = Math.floor(scrollTop / ROW_HEIGHT);
    const N = Math.ceil(height / ROW_HEIGHT);
    const cells = [];
    if (cellTop > 0) {
      // add a single div to take the height of the unrendered cells above the viewport
      cells.push(
        <div key={-1} style={{ width: '100%', height: cellTop * ROW_HEIGHT }} />
      );
    }

    for (let i = 0; i < N; i++) {
      cells.push(
        <div key={i} className={cx(styles.cell, { isLastInLevel })} />
      );
    }

    return (
      <div className={cx({ isLevelCollapsed })} style={{ height }}>
        {cells}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/EmptyColumn.js