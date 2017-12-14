// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['ReviewsFilters'] = function ReviewsFilters(){
        return ReviewsFiltersClass;
    }
}
/* eslint-disable max-len */
const { colors, forms, modal, space, zIndex } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const Link = require('components/Link/Link');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Modal = require('components/Modal/Modal');
const Divider = require('components/Divider/Divider');
const Filters = require('utils/Filters');
const skuUtils = require('utils/Sku');
const Filter = require('components/ProductPage/Filter/Filter');
const IconCross = require('components/Icon/IconCross');
const ProductActions = require('actions/ProductActions');
const BeautyMatchCheckbox =
    require('components/ProductPage/BeautyMatchCheckbox/BeautyMatchCheckbox');
const defaultSort = Filters.REVIEW_SORT_TYPES[0];

const ReviewsFilters = function () {
    let {
        regularChildSkus = [],
        onSaleChildSkus = []
    } = this.props;
    this.state = {
        filters: [],
        selectedFilters: {},
        previousFilters: {},
        filterComponents: {},
        sortComponent: null,
        sortSelected: defaultSort,
        showSortDropdown: true,
        skuAggregatedList: Filters.createSkuAggregatedList(regularChildSkus.concat(onSaleChildSkus))
    };
};

ReviewsFilters.prototype.render = function () {
    if (!this.state.isFiltersReceived) {
        return Sephora.isMobile()
            ? <Divider
                marginX={-space[4]}
                marginBottom={space[4]}
                color='lightGray' />
            : null;
    } else {
        return Sephora.isMobile()
            ? this.getMobile()
            : this.getDesktop();
    }
};

ReviewsFilters.prototype.getMobile = function () {
    let variationType = this.props.variationType;
    let hasColorFilter = variationType === skuUtils.skuVariationType.COLOR;
    const filterDivider =
        <Box
            height='1.25em'
            width='1px'
            backgroundColor='moonGray'
            marginX='auto' />;

    const triggerStyle = {
        display: 'block',
        paddingTop: space[3],
        paddingRight: space[2],
        paddingBottom: space[3],
        paddingLeft: space[2],
        marginLeft: 'auto',
        marginRight: 'auto'
    };

    return (
        <Flex
            fontSize='h5'
            lineHeight={2}
            marginX={-space[4]}
            marginBottom={space[4]}
            justifyContent='space-between'
            alignItems='center'
            backgroundColor='nearWhite'>
            {hasColorFilter &&
                <Link
                    _css={triggerStyle}
                    arrowDirection='down'
                    onClick={() => this.setState({
                        isModalOpen: true,
                        activeFilterGroup: Filters.REVIEW_FILTERS_TYPES.SKU
                    })}>
                    {variationType}: <b>{this.getSkuFilterCount()}</b>
                </Link>
            }
            {hasColorFilter && filterDivider}
            <Link
                _css={triggerStyle}
                arrowDirection='down'
                onClick={() => this.setState({
                    isModalOpen: true,
                    activeFilterGroup: Filters.REVIEW_FILTERS_TYPES.CUSTOM
                })}>
                Filter
                {this.getCustomFiltersCount()}
            </Link>
            {filterDivider}
            <Link
                _css={triggerStyle}
                arrowDirection='down'
                onClick={() => this.setState({
                    isModalOpen: true,
                    activeFilterGroup: Filters.REVIEW_FILTERS_TYPES.SORT
                })}>
                Sort: <b>{Filters.REVIEW_SORT_TYPES_LABELS[this.state.sortSelected]}</b>
            </Link>
            {this.getMobileModal()}
        </Flex>
    );
};

ReviewsFilters.prototype.getMobileModal = function () {
    let {
        reviewsCount
    } = this.props;
    let variationType = this.props.variationType;
    let modalTitle;
    let modalContent;
    let activeFilterGroup = this.state.activeFilterGroup;
    switch (activeFilterGroup) {
        case Filters.REVIEW_FILTERS_TYPES.SKU:
            modalTitle = 'Filter by ' + variationType;
            modalContent = this.getSkuFilters();
            break;
        case Filters.REVIEW_FILTERS_TYPES.CUSTOM:
            modalTitle = 'Filter';
            modalContent = this.getCustomFilters();
            break;
        case Filters.REVIEW_FILTERS_TYPES.SORT:
            modalTitle = 'Sort';
            modalContent = <Filter
                type={Filters.TYPES.RADIO}
                ref={filterComp => this.state.sortComponent = filterComp}
                labels={Object.values(Filters.REVIEW_SORT_TYPES_LABELS)}
                values={Filters.REVIEW_SORT_TYPES}
                selected={[this.state.sortSelected]} />;
            break;
        default:
    }
    return (
        <Modal
            open={this.state.isModalOpen}
            isFixedHeader={true}
            onDismiss={() => this.setState({
                isModalOpen: false,
                activeFilterGroup: null
            })}>
            <Modal.Header>
                <Modal.Title>
                    {modalTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{
                    paddingTop: 0,
                    paddingBottom: forms.HEIGHT + (modal.PADDING_MW * 2) + space[4]
                }}>
                {activeFilterGroup !== Filters.REVIEW_FILTERS_TYPES.SORT &&
                    <div>
                        <Box
                            fontSize='h4'
                            marginX={-modal.PADDING_MW}
                            paddingX={modal.PADDING_MW}
                            paddingY={space[4]}
                            borderBottom={1}
                            borderColor='lightGray'>
                            {reviewsCount} reviews match selected filters
                        </Box>
                        <Box
                            marginX={-modal.PADDING_MW}
                            paddingX={modal.PADDING_MW}
                            paddingY={space[4]}>
                            <BeautyMatchCheckbox
                                name={Filters.BEAUTY_MATCH_CHECKBOX_TYPES.MODAL_REVIEW}
                                label='Show reviews'
                                onSelect={this.onBeautyMatchCheckboxToggle}
                                updateOnAction={ProductActions.TYPES.REVIEW_FILTERS_APPLIED}
                                sortBy={Filters.REVIEW_SORT_TYPES[0]}/>
                        </Box>
                    </div>
                }
                {activeFilterGroup === Filters.REVIEW_FILTERS_TYPES.SKU &&
                    <Divider
                        marginX={-space[4]} />
                }
                {modalContent}
            </Modal.Body>
            {this.state.isModalOpen &&
                <Modal.Footer
                    isFixed={true}>
                    {this.getButtons(activeFilterGroup)}
                </Modal.Footer>
            }
        </Modal>
    );
};

ReviewsFilters.prototype.getDesktop = function () {
    let variationType = this.props.variationType;
    let hasColorFilter = variationType === skuUtils.skuVariationType.COLOR;
    const filterDivider =
        <Box
            height='1.25em'
            width='1px'
            marginX={space[4]}
            backgroundColor='moonGray' />;
    return (
        <div>
            <Flex
                justifyContent='flex-end'>
                <Flex
                    fontSize='h3'
                    alignItems='center'>
                    {hasColorFilter &&
                        this.getSkuFilters()
                    }
                    {hasColorFilter && filterDivider}
                    <Link
                        arrowDirection={this.state.activeFilterGroup ===
                            Filters.REVIEW_FILTERS_TYPES.CUSTOM ? 'up' : 'down'}
                        onClick={() => this.setState({
                            activeFilterGroup: this.state.activeFilterGroup ===
                            Filters.REVIEW_FILTERS_TYPES.CUSTOM
                            ? null :Filters.REVIEW_FILTERS_TYPES.CUSTOM
                        })}>
                        Filter
                        {this.getCustomFiltersCount()}
                    </Link>
                    {filterDivider}
                    {this.state.showSortDropdown && <Filter
                        isRightDropdown={true}
                        type={Filters.TYPES.RADIO}
                        ref={filterComp => this.state.sortComponent = filterComp}
                        labels={Object.values(Filters.REVIEW_SORT_TYPES_LABELS)}
                        selected={[this.state.sortSelected]}
                        reactOnChange={this.applyReviewFiltersAndSorts}
                        values={Filters.REVIEW_SORT_TYPES}>
                        Sort by: <b>{Filters.REVIEW_SORT_TYPES_LABELS[this.state.sortSelected]}</b>
                    </Filter>}
                </Flex>
            </Flex>
            {this.state.activeFilterGroup === Filters.REVIEW_FILTERS_TYPES.CUSTOM &&
                <div>
                    <Divider
                        marginTop={space[4]}
                        marginBottom={space[2]} />
                    <Flex
                        alignItems='center'
                        flexWrap='wrap'
                        paddingX={space[4]}
                        _css={{
                            '& > *': {
                                marginTop: space[2],
                                '&:not(:last-child)': {
                                    marginRight: space[4],
                                    paddingRight: space[4],
                                    borderRightWidth: 1,
                                    borderColor: colors.moonGray
                                }
                            }
                        }}>
                        {this.getCustomFilters()}
                    </Flex>
                </div>
            }
            {this.getSelectedFiltersBreadcrumbs()}
        </div>
    );
};

ReviewsFilters.prototype.getButtons = function (activeFilterGroup) {
    let isMobile = Sephora.isMobile();
    return (
        <Grid
            fit={true}
            gutter={isMobile ? space[4] : space[2]}
            marginTop={!isMobile ? space[3] : null}>
            {this.state.activeFilterGroup !== Filters.REVIEW_FILTERS_TYPES.SORT &&
                <Grid.Cell>
                    <ButtonOutline
                        block={true}
                        size={!isMobile ? 'sm' : null}
                        onClick={() => {
                            switch (activeFilterGroup) {
                                case Filters.REVIEW_FILTERS_TYPES.SKU:
                                    this.onResetFilter([Filters.REVIEW_FILTERS_TYPES.SKU]);
                                    break;
                                case Filters.REVIEW_FILTERS_TYPES.CUSTOM:
                                    this.onResetFilter(Object.keys(Filters.REVIEW_FILTERS));
                                    break;
                                default:
                                    this.onResetFilter([activeFilterGroup]);
                            }
                        }}>
                        Reset
                    </ButtonOutline>
                </Grid.Cell>
            }
            <Grid.Cell>
                <ButtonPrimary
                    block={true}
                    size={!isMobile ? 'sm' : null}
                    onClick={() => this.applyReviewFiltersAndSorts()}>
                    Done
                </ButtonPrimary>
            </Grid.Cell>
        </Grid>
    );
};

ReviewsFilters.prototype.getCustomFiltersCount = function () {
    let count = this.state.filters.reduce((acc, filterKey) => {
        return acc + this.getFiltersCount(filterKey);
    }, 0);
    return count ? ` (${count})` : '';
};

ReviewsFilters.prototype.getFiltersCount = function (filterKey) {
    let filter = this.state.selectedFilters[filterKey];
    return (filter && filter.length) || 0;
};

ReviewsFilters.prototype.getSkuFilters = function () {
    const isDesktop = Sephora.isDesktop();
    let skuList = this.state.skuAggregatedList;
    let variationType = this.props.variationType;
    let skuFilterKey = Filters.REVIEW_FILTERS_TYPES.SKU;
    let count = skuList.values.length;
    let columns = count > 15 ? 3 : count > 7 ? 2 : 1;
    return (
        <Filter
            width={isDesktop ? columns * 225 : null}
            type={Filters.TYPES.CHECKBOX}
            ref={filterComp =>
                this.state.filterComponents[skuFilterKey] = filterComp}
            labels={skuList.labels}
            columns={isDesktop ? columns : 1}
            valueImages={skuList.images}
            selected={this.state.selectedFilters[skuFilterKey]}
            buttons={this.getButtons(Filters.REVIEW_FILTERS_TYPES.SKU)}
            values={skuList.values}>
            {isDesktop &&
                <Text>
                    {variationType}: <b>{this.getSkuFilterCount()}</b>
                </Text>
            }
        </Filter>
    );
};

ReviewsFilters.prototype.getSkuFilterCount = function () {
    let filtersCount = this.getFiltersCount(Filters.REVIEW_FILTERS_TYPES.SKU);
    return filtersCount ? '(' + filtersCount + ')' : 'All';
};

ReviewsFilters.prototype.getCustomFilters = function () {
    return this.state.filters.map((filterKey, index) => {
        let filter = Filters.REVIEW_FILTERS[filterKey];
        let valueImages = filter.hasImages && Filters.getReviewImages(filterKey, filter.values);
        return (
            <Filter
                index={index}
                columns={Sephora.isMobile() ? 2 : 1}
                type={Filters.TYPES.CHECKBOX}
                key={filterKey}
                ref={filterComp => this.state.filterComponents[filterKey]
                    = filterComp}
                labels={filter.values}
                values={filter.values}
                selected={this.state.selectedFilters[filterKey]}
                valueImages={valueImages}
                buttons={this.getButtons(filterKey)}>
                {filter.label}
            </Filter>
        );
    });
};

ReviewsFilters.prototype.getSelectedFiltersBreadcrumbs = function () {
    let selectedFilters = Object.keys(this.state.selectedFilters);
    if (selectedFilters.length) {
        selectedFilters.push(Filters.REVIEW_FILTERS_TYPES.ALL);
    } else {
        return null;
    }
    return (
        <div>
            <Divider
                marginTop={space[4]}
                marginBottom={space[2]} />
            <Flex
                alignItems='center'
                flexWrap='wrap'
                lineHeight={2}
                paddingX={space[4]}>
                <Text
                    marginRight={space[2]}
                    marginTop={space[2]}>
                    Filtering by:
                </Text>
                {selectedFilters.map(filterKey => {
                    switch (filterKey) {
                        case Filters.REVIEW_FILTERS_TYPES.ALL:
                            return (
                                <Link
                                    primary={true}
                                    paddingY={space[2]}
                                    marginBottom={-space[2]}
                                    onClick={() =>
                                        this.onResetFilter(Object.keys(this.state.selectedFilters).
                                        concat(Filters.REVIEW_FILTERS_TYPES.SKU))}>
                                    Clear all
                                </Link>
                            );
                        default: {
                            let label = '';
                            let skuList = this.state.skuAggregatedList;
                            let filter = this.state.selectedFilters[filterKey] || [];
                            if (filter.length) {
                                if (filterKey === Filters.REVIEW_FILTERS_TYPES.SKU) {
                                    label = this.props.variationType;
                                    filter = filter.map(skuId =>
                                        skuList.labels[skuList.values.indexOf(skuId)]);
                                } else {
                                    label = Filters.REVIEW_FILTERS[filterKey].label;
                                }
                                filter = filter.join(', ');
                            } else {
                                return null;
                            }
                            return (
                                <Link
                                    backgroundColor='lightGray'
                                    paddingX={space[2]}
                                    paddingY={space[1]}
                                    marginRight={space[2]}
                                    marginTop={space[2]}
                                    rounded={true}
                                    onClick={() => this.onResetFilter([filterKey])}>
                                    <Flex
                                        alignItems='center'>
                                        <Text
                                            marginRight='.375em'>
                                            {label}: {filter}
                                        </Text>
                                        <IconCross
                                            fontSize='.875em'
                                            verticalAlign='middle'
                                            x={true}/>
                                    </Flex>
                                </Link>
                            );
                        }
                    }
                })}
            </Flex>
        </div>
    );
};


// Added by sephora-jsx-loader.js
ReviewsFilters.prototype.path = 'ProductPage/RatingsAndReviews/ReviewsFilters';
// Added by sephora-jsx-loader.js
Object.assign(ReviewsFilters.prototype, require('./ReviewsFilters.c.js'));
var originalDidMount = ReviewsFilters.prototype.componentDidMount;
ReviewsFilters.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ReviewsFilters');
if (originalDidMount) originalDidMount.apply(this);
if (ReviewsFilters.prototype.ctrlr) ReviewsFilters.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ReviewsFilters');
// Added by sephora-jsx-loader.js
ReviewsFilters.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ReviewsFilters.prototype.class = 'ReviewsFilters';
// Added by sephora-jsx-loader.js
ReviewsFilters.prototype.getInitialState = function() {
    ReviewsFilters.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ReviewsFilters.prototype.render = wrapComponentRender(ReviewsFilters.prototype.render);
// Added by sephora-jsx-loader.js
var ReviewsFiltersClass = React.createClass(ReviewsFilters.prototype);
// Added by sephora-jsx-loader.js
ReviewsFiltersClass.prototype.classRef = ReviewsFiltersClass;
// Added by sephora-jsx-loader.js
Object.assign(ReviewsFiltersClass, ReviewsFilters);
// Added by sephora-jsx-loader.js
module.exports = ReviewsFiltersClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/ReviewsFilters/ReviewsFilters.jsx