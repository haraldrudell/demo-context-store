// @flow
import React, { PureComponent } from 'react';
import type { Id, Query } from '@sigmacomputing/sling';
import classnames from 'classnames/bind';
import Slider from 'react-slick';

import { Box, Flex } from 'widgets';
import { addFilter, deleteFilter } from 'utils/ColumnActions';
import type { ColumnTypes } from 'types';
import ColumnFilter from './ColumnFilter';
import FilterAdder from './FilterAdder';
import FilterChiclet from './FilterChiclet';
import styles from './FilterInspector.less';
const cx = classnames.bind(styles);

type Props = {
  query: Query,
  connectionId: string,
  setQuery: Query => void,
  columnTypes: ColumnTypes
};

type State = {
  columnFilters: Array<Id>,
  newFilter: ?Id,
  firstVisibleSlide?: number
};

function Arrow(props: any) {
  const { className, onClick } = props;
  return <div className={className} onClick={onClick} />;
}

function mkColumnFilters(query) {
  const columnFilters = [];

  // Add in filters from the Query object
  for (const id of Object.keys(query.columns)) {
    const col = query.columns[id];
    if (col.filter) {
      columnFilters.push(id);
    }
  }

  return columnFilters;
}

export default class FilterInspector extends PureComponent<Props, State> {
  slider: Slider;

  constructor(props: Props) {
    super(props);
    this.state = {
      columnFilters: mkColumnFilters(props.query),
      newFilter: undefined,
      firstVisibleSlide: undefined
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { columnFilters: oldColumnFilters } = this.state;
    if (nextProps.query !== this.props.query) {
      const columnFilters = mkColumnFilters(nextProps.query);
      const newFilter =
        nextProps.query.root === this.props.query.root
          ? columnFilters.find(id => {
              return !oldColumnFilters.includes(id);
            })
          : undefined;
      this.setState({
        columnFilters,
        newFilter
      });
    }
  }

  scrollToNewestFilter(filterId: Id) {
    const { columnFilters, firstVisibleSlide = -1 } = this.state;
    const idx = columnFilters.indexOf(filterId);
    if (idx === -1 || !this.slider) return;

    // the slider provides us with the idx of the first slide (see this.onCarouselChange)
    // but not that of the last or the number of slides visible, so we have to calculate it
    const sliderWidth = this.slider.innerSlider.list.clientWidth;
    const slideWidth = this.slider.innerSlider.list.firstElementChild
      .firstElementChild.clientWidth;
    const visibleChiclets = Math.floor(sliderWidth / slideWidth);

    if (idx < firstVisibleSlide || idx > firstVisibleSlide + visibleChiclets) {
      this.slider.slickGoTo(idx);
    }
    this.setState({ newFilter: undefined });
  }

  componentDidMount() {
    const { newFilter } = this.state;
    if (newFilter) this.scrollToNewestFilter(newFilter);
  }

  componentDidUpdate() {
    const { newFilter } = this.state;
    if (newFilter) this.scrollToNewestFilter(newFilter);
  }

  addNewColumnFilter = (id: string) => {
    const { query, setQuery, columnTypes } = this.props;
    setQuery(addFilter(query, columnTypes[id], id));
  };

  onDeleteFilter = (id: string) => {
    const { query, setQuery } = this.props;
    setQuery(deleteFilter(query, id));
  };

  setFilterRef = (ref: Slider) => {
    this.slider = ref;
  };

  onCarouselChange = (firstVisibleSlide: number) => {
    this.setState({ firstVisibleSlide });
  };

  render() {
    const { query, setQuery, columnTypes, connectionId } = this.props;
    const { columnFilters, newFilter } = this.state;

    const filters = columnFilters.map(id => {
      return (
        <div key={id} id={`filter-${id}`} className={cx('chiclet')}>
          <FilterChiclet
            columnId={id}
            query={query}
            isNew={id === newFilter}
            deleteFilter={this.onDeleteFilter}
            popup={
              <ColumnFilter
                query={query}
                connectionId={connectionId}
                setQuery={setQuery}
                columnId={id}
                columnType={columnTypes[id]}
                deleteFilter={this.onDeleteFilter}
              />
            }
          />
        </div>
      );
    });
    const noFilters = columnFilters.length === 0;

    return (
      <Flex
        align="center"
        bb={1}
        bg="white"
        borderColor="darkBlue4"
        px={2}
        py={1}
        width="100%"
      >
        <Box font="header5" px={2}>
          Filters:
        </Box>
        {!noFilters && (
          <div className={cx('carouselContainer', 'flex-item')}>
            <Slider
              ref={this.setFilterRef}
              afterChange={this.onCarouselChange}
              nextArrow={<Arrow />}
              prevArrow={<Arrow />}
              dots={false}
              arrows={true}
              infinite={false}
              speed={500}
              slidesToScroll={1}
              draggable={false}
              variableWidth={true}
            >
              {filters}
            </Slider>
          </div>
        )}
        <FilterAdder
          query={query}
          addNewColumnFilter={this.addNewColumnFilter}
        />
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/FilterInspector.js