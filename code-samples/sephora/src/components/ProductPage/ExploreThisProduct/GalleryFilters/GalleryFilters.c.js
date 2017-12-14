// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var GalleryFilters = function () {};

// Added by sephora-jsx-loader.js
GalleryFilters.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const Filters = require('utils/Filters');
const store = require('Store');
const ProductActions = require('actions/ProductActions');
const reduxActionWatch = require('redux-action-watch');
const anaConsts = require('analytics/constants');
const processEvent = require('analytics/processEvent');

GalleryFilters.prototype.ctrlr = function () {
    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        ProductActions.TYPES.GALLERY_FILTERS_APPLIED,
        (data) => {
            if (data.filters && data.filters.length === 0) {
                this.setState({
                    selectedFilters: data.filters
                });
            }
        });

    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        ProductActions.TYPES.RESET_GALLERY_FILTERS,
        () => {
            this.setState({
                selectedFilters: []
            });
        });
};

GalleryFilters.prototype.applyGalleryFilters = function (isReset) {

    let filters;

    if (!isReset) {
        filters = this.state.filterComponents.getSelected();
    }

    this.setState({
        isModalOpen: false,
        selectedFilters: filters
    }, () => {
        let selections = [];
        this.skuList.values.forEach((value, i) => {
            if (filters.indexOf(value) >=0) {
                selections.push(this.skuList.labels[i]);
            }
        });
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                filterSelections: 'view by color=' + selections.join(',')
            }
        });
        store.dispatch(ProductActions.applyGalleryFilters(filters));
    });
};

GalleryFilters.prototype.onResetFilter = function () {
    this.applyGalleryFilters(true);
};

GalleryFilters.prototype.getFiltersCount = function () {
    let filter = this.state.selectedFilters;
    return (filter && filter.length) || 0;
};


// Added by sephora-jsx-loader.js
module.exports = GalleryFilters.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/ExploreThisProduct/GalleryFilters/GalleryFilters.c.js