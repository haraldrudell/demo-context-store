// @flow
import { Query } from '@sigmacomputing/sling';
import getScrollSize from 'scrollbar-width';

import { DEFAULT_COL_WIDTH } from 'const/TableConstants';
import type { ColumnMetadataType } from 'types/table';

class HeaderLayout {
  query: Query;
  x: number;
  columns: Array<ColumnMetadataType>;

  constructor(query: Query) {
    this.query = query;
    this.x = 0;
    this.columns = [];
  }

  layoutColumns(columns = [], level, levelId, areKeys = false) {
    const isLevelCollapsed = level.isCollapsed;

    const qc = this.query.columns;
    for (const id of columns) {
      if ((areKeys || !qc[id].isGrouped) && !qc[id].isHidden) {
        const width = this.query.view.columnWidths[id]
          ? this.query.view.columnWidths[id]
          : DEFAULT_COL_WIDTH;

        this.columns.push({
          id,
          width,
          x: this.x,
          levelId,
          isLevelCollapsed
        });
        this.x += width;
      }
    }
  }

  layoutLevel(level) {
    this.layoutColumns(level.columns, level, level.id);
    // TODO sortKeys
  }

  layoutGroupLevel(g) {
    this.layoutColumns(g.keys, g, g.id, true /* key columns */);
    this.layoutLevel(g);
  }

  layout() {
    const q = this.query;
    this.layoutLevel(q.global);
    if (q.levels && q.levels.length > 0) {
      // group blocks are base to top, but we want to render top...base
      for (let i = q.levels.length - 1; i >= 0; i--) {
        this.layoutGroupLevel(q.levels[i]);
      }
    }
    this.layoutColumns(q.base.columns, q.base, q.base.id);

    const columns = this.columns;
    const lastColumn = columns[columns.length - 1];
    const SCROLLBAR_SIZE = getScrollSize();

    return {
      columns,
      width: lastColumn ? lastColumn.x + lastColumn.width : SCROLLBAR_SIZE
    };
  }
}

export default function layoutHeaders(q: Query) {
  return new HeaderLayout(q).layout();
}



// WEBPACK FOOTER //
// ./src/components/table/layout.js