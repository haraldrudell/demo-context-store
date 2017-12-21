// @flow
import type { Query } from '@sigmacomputing/sling';

export default function newColumnIterator(
  query: Query,
  startFromBase?: boolean = false
) {
  const cols = [];
  let nextIndex = 0;

  query.global.columns.forEach(column => {
    cols.push({
      columnId: column,
      levelId: query.global.id
    });
  });
  query.levels
    .slice()
    .reverse()
    .forEach(level => {
      level.keys.forEach(key => {
        cols.push({
          columnId: key,
          levelId: level.id
        });
      });
      level.columns.forEach(column => {
        if (!query.columns[column].isGrouped) {
          cols.push({
            columnId: column,
            levelId: level.id
          });
        }
      });
    });
  query.base.columns.forEach(column => {
    if (!query.columns[column].isGrouped) {
      cols.push({
        columnId: column,
        levelId: query.base.id
      });
    }
  });

  if (startFromBase) {
    cols.reverse();
  }

  return {
    next: () => {
      if (nextIndex < cols.length) {
        const value = cols[nextIndex];
        nextIndex++;
        return { value, done: false };
      }

      return { done: true };
    }
  };
}



// WEBPACK FOOTER //
// ./src/utils/iterator.js