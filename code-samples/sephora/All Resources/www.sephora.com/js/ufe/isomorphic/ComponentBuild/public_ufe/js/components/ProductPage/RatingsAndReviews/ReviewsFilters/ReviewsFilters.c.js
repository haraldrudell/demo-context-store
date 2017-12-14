// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ReviewsFilters = function () {};

// Added by sephora-jsx-loader.js
ReviewsFilters.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const utilityApi = require('services/api/utility');
const Filters = require('utils/Filters');
const store = require('Store');
const ProductActions = require('actions/ProductActions');
const reduxActionWatch = require('redux-action-watch');
const anaConsts = require('analytics/constants');
const processEvent = require('analytics/processEvent');

ReviewsFilters.prototype.ctrlr = function () {
    let { productId } = this.props;
    utilityApi.getAboutMeReviewQuestions(productId).then(data => {
        this.setState({
            isFiltersReceived: true,
            filters: Filters.NON_BV_FILTERS.concat(data.aboutMeQuestions),
            selectedFilters: {}
        });
    });

    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        ProductActions.TYPES.REVIEW_FILTERS_APPLIED,
        (data) => {
            if (!Object.keys(data.filters).length || data.apply) {
                this.applyReviewFiltersAndSorts([Filters.REVIEW_FILTERS_TYPES.ALL]);
            }
        });
    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        ProductActions.TYPES.BEAUTY_MATCH_FILTERS_TOGGLED,
        (data) => {
            if (data.name === Filters.BEAUTY_MATCH_CHECKBOX_TYPES.REVIEW ||
                data.name === Filters.BEAUTY_MATCH_CHECKBOX_TYPES.MODAL_REVIEW) {
                this.setBeautyMatchFilters(data.filters, data.isChecked, data.name);
            }
        });

};

ReviewsFilters.prototype.applyReviewFiltersAndSorts = function (filtersToReset) {
    let filters = this.getSelectedFilters();
    if (filtersToReset instanceof Array) {
        if (filtersToReset.indexOf(Filters.REVIEW_FILTERS_TYPES.ALL) > -1) {
            filters = {};
        } else {
            filtersToReset.forEach(filterKey => {
                delete filters[filterKey];
            });
        }
    }

    let sortValue = this.state.sortComponent ? this.state.sortComponent.getSelected()[0] :
        this.state.sortSelected;
    this.setFiltersAndSorts(filters, sortValue);

    // Analytics
    if (Object.keys(filters).length !== 0 ) {
        let selections = [];
        for (var key in filters) {
            selections.push(key + '=' + filters[key].join(','));
        }
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                filterSelections: selections.join(';')
            }
        });
    }
};

ReviewsFilters.prototype.setFiltersAndSorts = function (filters, sortValue, isModalOpen = false) {
    this.setState({
        isModalOpen: isModalOpen,
        sortSelected: sortValue,
        selectedFilters: filters,
        showSortDropdown: false
    }, () => {
        this.setState({
            showSortDropdown: true
        });
        if (!this.state.isModalOpen) { // In Modal we wait for Done button to be clicked
            store.dispatch(
                ProductActions.applyReviewFilters(
                    Object.assign({}, filters, { [Filters.REVIEW_FILTERS_TYPES.SORT]: [sortValue] })
                )
            );
        }
    });
};

ReviewsFilters.prototype.onBeautyMatchCheckboxToggle = function (bbFilters, isChecked, name) {
    store.dispatch(ProductActions.beautyMatchFiltersToggled(bbFilters, isChecked, name));
};

ReviewsFilters.prototype.onResetFilter = function (filtersToReset) {
    this.applyReviewFiltersAndSorts(filtersToReset);
};

ReviewsFilters.prototype.getSelectedFilters = function () {
    let selectedFilters = this.state.selectedFilters;
    Object.keys(this.state.filterComponents).forEach(filterKey => {
        let filterComponent = this.state.filterComponents[filterKey];
        if (filterComponent) {
            let filterValues = filterComponent.getSelected();
            if (filterValues.length) {
                selectedFilters[filterKey] = filterValues;
            } else {
                delete selectedFilters[filterKey];
            }
        }
    });
    return selectedFilters;
};

ReviewsFilters.prototype.setBeautyMatchFilters = function (filters, isCheckedBeautyMatch, name) {
    let sortSelected = filters[Filters.REVIEW_FILTERS_TYPES.SORT] ||
        (this.state.sortComponent ? this.state.sortComponent.getSelected()[0] :
            this.state.sortSelected);
    delete filters[Filters.REVIEW_FILTERS_TYPES.SORT];
    let newFilters = isCheckedBeautyMatch ?
        (Object.keys(filters).length === 0 ? {} : filters) : this.state.previousFilters;
    let newSortSelected = isCheckedBeautyMatch ? sortSelected : this.state.previousSortSelected;
    this.setState({
        previousFilters: isCheckedBeautyMatch ? this.state.selectedFilters : {},
        previousSortSelected: isCheckedBeautyMatch ? this.state.sortSelected : sortSelected
    });
    let isModalOpen = name === Filters.BEAUTY_MATCH_CHECKBOX_TYPES.MODAL_REVIEW ?
        this.state.isModalOpen : false;
    this.setFiltersAndSorts(newFilters, newSortSelected, isModalOpen);
};


// Added by sephora-jsx-loader.js
module.exports = ReviewsFilters.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/RatingsAndReviews/ReviewsFilters/ReviewsFilters.c.js