// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var CatNav = function () {};

// Added by sephora-jsx-loader.js
CatNav.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const updateCategories = require('actions/CategoryActions').updateCategories;
const LOCAL_STORAGE = require('utils/localStorage/Constants');
const Storage = require('utils/localStorage/Storage');

CatNav.prototype.fetchCategories = function () {
    const fetchCategories = require('actions/CategoryActions').fetchCategories;
    store.dispatch(fetchCategories());
};

CatNav.prototype.loadCategories = function () {
    const data = Storage.local.getItem(LOCAL_STORAGE.CATNAV);

    if (data) {
        store.dispatch(updateCategories(data));
    } else {
        this.fetchCategories();
    }
};

CatNav.prototype.ctrlr = function () {
    const watch = require('redux-watch');
    const w = watch(store.getState, 'category');

    this.setState({
        categories: this.props.categories
    });

    store.subscribe(w((newVal) => {
        this.setState({
            categories: newVal.categories,
            openCategory: null
        });
    }));

    this.loadCategories();
};

CatNav.prototype.changeCategory = function (category) {

    if (Sephora.isDesktop()) {
        if (!this.props.categoryFlyout && category !== null) {
            this.props.toggleFlyout(true);
        }

        if (this.props.categoryFlyout && category === null) {
            this.props.toggleFlyout(false);
        }
    }

    this.setState({
        openCategory: category
    });
};


// Added by sephora-jsx-loader.js
module.exports = CatNav.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNav.c.js