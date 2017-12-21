// @flow
import { type Anchor } from '@sigmacomputing/sling';
import invariant from 'invariant';

import type { Values } from 'types';
import { FETCH_SIZE } from 'const/TableConstants';
import { popRow, shiftRow, getAnchorKeyFlatOffset } from 'utils/table';
import { TableData } from './tableData';

export function mkTableData(
  v: Values,
  anchor: ?Anchor,
  _offset: number,
  _fullRowCount: number,
  fetchSize?: number = FETCH_SIZE
) {
  let hasPrev = false;
  let hasNext = false;
  let offset = _offset;
  let fullRowCount = _fullRowCount;

  if (anchor) {
    invariant(offset < 0, `Expected negative offset when anchored ${offset}`);
    if (fullRowCount === fetchSize + 2) {
      // If we received 1002 rows, then we know we have prev and next rows
      hasPrev = true;
      hasNext = true;
      offset = -fetchSize / 2;
      popRow(v);
      shiftRow(v);
    } else {
      // we can't tell what happened from the fetch count
      // so find the anchor in the returned values and use its index to determine whether we have prev / next
      const anchorOffset = getAnchorKeyFlatOffset(anchor.key, v);
      if (anchorOffset !== null && anchorOffset !== undefined) {
        if (anchorOffset === fetchSize / 2 + 1) {
          // there are 500 rows before the anchor, so we must have previous but not next
          hasPrev = true;
          shiftRow(v);
          fullRowCount--;
        } else {
          // anchor is at 0..499, so we don't have previous.  we might have next...
          hasNext = fullRowCount - anchorOffset > fetchSize / 2;
          if (hasNext) {
            popRow(v);
            fullRowCount--;
          }
        }
      }
    }
  } else {
    invariant(offset === 0, `Expected 0 offset for initial fetch ${offset}`);
    if (fullRowCount > fetchSize) {
      hasNext = true;
      popRow(v);
    }
  }

  return new TableData(
    v,
    offset,
    Math.min(fullRowCount, fetchSize),
    hasPrev,
    hasNext
  );
}



// WEBPACK FOOTER //
// ./src/components/table/fetchUtil.js