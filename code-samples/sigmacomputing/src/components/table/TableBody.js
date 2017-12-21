// @flow
import React, { PureComponent } from 'react';
import type { Format } from '@sigmacomputing/sling';
import getScrollSize from 'scrollbar-width';
import { Button } from 'widgets';
import classnames from 'classnames/bind';

import type { Selection, Id, FetchDirection } from 'types';
import type { ColumnMetadataType, ScrollPosition } from 'types/table';
import {
  ROW_HEIGHT,
  DEFAULT_SCROLLING_RESET_TIME_INTERVAL
} from 'const/TableConstants';
import fontStyles from 'styles/typography.less';
import Column from './Column';
import { TableData } from './tableData';
import styles from './TableBody.less';
const cx = classnames.bind(styles);

type Props = {
  columns: Array<ColumnMetadataType>,
  formats: { [Id]: Format },
  height: number,
  onScroll: ({ scrollLeft: number, scrollTop: number }) => void,
  fetchNextPage: (direction: FetchDirection) => void,
  selection: Selection,
  totalWidth: number,
  tableData: TableData,
  width: number,
  isFetchingMore: boolean
};

type State = {
  scrollTop: number,
  scrollLeft: number,
  isScrolling: boolean
};

export default class TableBody extends PureComponent<Props, State> {
  _scrollContainer: ?HTMLElement;
  _disablePointerEventsTimeoutId: ?number;
  getScrollPosition: () => ScrollPosition;

  constructor(props: Props) {
    super(props);
    this.state = {
      scrollTop: 0,
      scrollLeft: 0,
      isScrolling: false
    };
  }

  componentWillUnmount() {
    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tableData !== this.props.tableData) {
      // tableData is changing, ensure scrollTop & scrollLeft within bounds
      const maxScrollTop = Math.max(
        0,
        nextProps.tableData.limit * ROW_HEIGHT - nextProps.height
      );
      if (this.state.scrollTop > maxScrollTop) {
        this.setState({ scrollTop: maxScrollTop });
      }
      const maxScrollLeft = Math.max(0, nextProps.totalWidth - nextProps.width);
      if (this.state.scrollLeft > maxScrollLeft) {
        this.setState({ scrollLeft: maxScrollLeft });
      }
    }
  }

  getScrollPosition = () => {
    const { scrollTop, scrollLeft } = this.state;
    return { scrollTop, scrollLeft };
  };

  forceScroll = (scroll: { scrollTop?: number, scrollLeft?: number }) => {
    const { _scrollContainer } = this;
    if (!_scrollContainer) return;
    const { scrollTop, scrollLeft } = scroll;

    if (scrollTop !== undefined) {
      _scrollContainer.scrollTop = scrollTop;
    }

    if (scrollLeft !== undefined) {
      _scrollContainer.scrollLeft = scrollLeft;
    }
  };

  onScroll = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const { scrollLeft, scrollTop } = evt.currentTarget;

    this.props.onScroll({ scrollTop, scrollLeft });
    this.setState({ scrollTop, scrollLeft, isScrolling: true });

    if (this._disablePointerEventsTimeoutId) {
      clearTimeout(this._disablePointerEventsTimeoutId);
    }

    this._disablePointerEventsTimeoutId = setTimeout(
      this._debounceScrollEndedCallback,
      DEFAULT_SCROLLING_RESET_TIME_INTERVAL
    );
  };

  _debounceScrollEndedCallback = () => {
    this._disablePointerEventsTimeoutId = null;
    this.setState({ isScrolling: false });
  };

  scrollColumnIntoView = (scrollToColumnId: Id) => {
    const { scrollLeft } = this.state;
    const { width, totalWidth, columns = [] } = this.props;
    const vizRight = Math.min(scrollLeft + width, totalWidth);

    const col = columns.find(x => x.id === scrollToColumnId);
    if (!col) return;

    if (col.x >= scrollLeft && col.x + col.width <= vizRight) {
      // column is completely in view already
      return;
    }

    if (col.x < scrollLeft) {
      // scroll left
      this.forceScroll({ scrollLeft: col.x });
    } else {
      // scroll so column is on right
      this.forceScroll({ scrollLeft: col.x + col.width - width });
    }
  };

  scrollRowIntoView = (columnId: Id, flatOffset: number) => {
    const { scrollTop } = this.state;
    const { tableData, height } = this.props;

    const { flatIndex, repeatCount } = tableData.getCellPosition(
      columnId,
      flatOffset
    );
    const cellTop = flatIndex * ROW_HEIGHT;
    const cellHeight = repeatCount * ROW_HEIGHT;
    const cellEnd = cellTop + cellHeight;
    const vizEnd = scrollTop + height;

    if (cellEnd <= scrollTop) {
      // cell is completely before visible range, scroll the last viewport of it into view
      this.forceScroll({ scrollTop: Math.max(0, cellEnd - height) });
    } else if (cellTop >= vizEnd) {
      this.forceScroll({ scrollTop: Math.min(cellTop, cellEnd - height) });
    }
  };

  setScrollContainer = (r: ?HTMLElement) => {
    this._scrollContainer = r;
  };

  fetchPrev = () => {
    this.props.fetchNextPage('prev');
  };

  fetchNext = () => {
    this.props.fetchNextPage('next');
  };

  renderVisibleColumns = (vizRight: number) => {
    const { scrollLeft, scrollTop } = this.state;
    const { columns, formats, height, selection, tableData } = this.props;
    const cols = [];

    for (let i = 0; i < columns.length; i++) {
      const { id, x, width: colWidth } = columns[i];
      const colEnd = x + colWidth;
      if (colEnd <= scrollLeft) {
        // column is before viewport
        continue;
      } else if (x > vizRight) {
        // column starts after viewport.  we're done rendering
        break;
      }

      // TODO: Other options here are to use absolute positioning or translate...

      // Create a single div to cover the space by the unrendered columns to the left
      if (cols.length === 0 && x > 0) {
        cols.push(<div key={0} style={{ width: x }} />);
      }

      const isLastInLevel =
        i < columns.length - 1 && columns[i].levelId !== columns[i + 1].levelId;

      cols.push(
        <Column
          column={columns[i]}
          tableData={tableData}
          format={formats[id]}
          height={height}
          selection={selection}
          key={id}
          scrollTop={scrollTop}
          isLastInLevel={isLastInLevel}
        />
      );
    }
    return cols;
  };

  renderShowMore = (label: string, onClick: () => void, bottom?: number) => {
    let style = {
      width: this.props.width
    };

    if (bottom) {
      style = {
        ...style,
        bottom
      };
    }
    return (
      <div className={styles.hasMore} style={style}>
        <Button
          className={styles.showMoreBtn}
          onClick={onClick}
          type="primary"
          loading={this.props.isFetchingMore}
        >
          {label}
        </Button>
      </div>
    );
  };

  render() {
    const { isScrolling, scrollLeft, scrollTop } = this.state;
    const { height, width, totalWidth, tableData } = this.props;

    // This happens if the height is 0..HEADER_HEIGHT
    // There's space for (some) of the headers but no body
    if (height <= 0) return null;

    const totalHeight = tableData.limit * ROW_HEIGHT;
    const vizRight = Math.min(scrollLeft + width, totalWidth);
    const showPrev = tableData.hasPrev && scrollTop === 0;

    const showMore =
      tableData.hasNext && scrollTop >= totalHeight - height + getScrollSize();

    return (
      <div>
        <div
          ref={this.setScrollContainer}
          style={{ height, width }}
          className={cx(fontStyles.table, 'container')}
          onScroll={this.onScroll}
        >
          <div
            style={{
              position: 'relative',
              height: totalHeight,
              width: totalWidth,
              display: 'flex',
              pointerEvents: isScrolling ? 'none' : ''
            }}
          >
            {this.renderVisibleColumns(vizRight)}
          </div>
        </div>
        {showPrev &&
          this.renderShowMore('Show Previous', this.fetchPrev, height)}
        {showMore && this.renderShowMore('Show More', this.fetchNext)}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/TableBody.js