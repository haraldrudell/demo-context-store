// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductGrid = function () {};

// Added by sephora-jsx-loader.js
ProductGrid.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
var OnScroll = require('react-window-mixins').OnScroll;
var store = require('Store');
var loadMoreProducts = require('actions/Actions').loadMoreProducts;
var changeCategory = require('actions/ProductGridActions').changeCategory;
var updateProductSort = require('actions/Actions').updateProductSort;
var updateTotalProducts = require('actions/ProductGridActions').updateTotalProducts;
var updateFilters = require('actions/ProductFilterActions').updateFilters;
var urlUtils = require('utils/Url');
var watch = require('redux-watch');
const snbApi = require('services/api/search-n-browse');

/**
 * We will trigger a load any time we come within this
 * many pixels of the bottom of the page
 */
const SCROLL_LOAD_HEIGHT = 2000;

var activeQuery = false;

ProductGrid.prototype.ctrlr = function () {
    let _this = this;
    let w = watch(store.getState, 'productGrid');
    let sortParam = urlUtils.getParamsByName('sortBy') || [];
    let filterParam = urlUtils.getParamsByName('ref') || [];

    store.dispatch(loadMoreProducts(this.props.products));
    store.dispatch(changeCategory(this.props.categoryId));
    store.dispatch(updateTotalProducts(this.props.products ? this.props.products.length : 0));

    store.subscribe(w((newVal) => {
        _this.setState(Object.assign({}, _this.state, {
            currentPage: newVal.currentPage,
            products: newVal.products,
            categoryId: newVal.categoryId
        }));
    }));

    if (filterParam.length) {
        store.dispatch(updateFilters(filterParam));
    }

    if (sortParam.length) {
        store.dispatch(updateProductSort(sortParam.toString()));
    }
};

ProductGrid.prototype.getNextPage = function () {
    activeQuery = true;

    let requestedPage = this.state.currentPage + 1;
    let pullProducts;

    if (this.props.categoryId) {
        pullProducts = snbApi.getNthLevelCategory({
            categoryId: this.props.categoryId,
            currentPage: requestedPage,
            pageSize: 60
        });
    }

    if (this.props.searchTerm) {
        pullProducts = snbApi.searchProductsByKeyword(
            this.props.searchTerm, requestedPage, 60);
    }

    if (pullProducts) {
        pullProducts.then(data => {
            store.dispatch(loadMoreProducts(data.products));
            activeQuery = false;
        });
    }
};

ProductGrid.prototype.mixins = [OnScroll];

ProductGrid.prototype.onScroll = function () {
    if (document.body.scrollHeight - window.scrollY < SCROLL_LOAD_HEIGHT && !activeQuery &&
        this.state.products && this.state.products.length !== this.props.totalProducts) {
        this.getNextPage();
    }
};


// Added by sephora-jsx-loader.js
module.exports = ProductGrid.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/ProductGrid/ProductGrid.c.js