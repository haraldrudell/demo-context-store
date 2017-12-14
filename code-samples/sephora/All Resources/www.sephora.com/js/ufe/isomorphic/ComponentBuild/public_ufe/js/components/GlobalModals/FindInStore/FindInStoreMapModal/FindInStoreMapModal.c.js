// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var FindInStoreMapModal = function () {};

// Added by sephora-jsx-loader.js
FindInStoreMapModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const { showFindInStoreMapModal, showFindInStoreModal } = require('Actions');

FindInStoreMapModal.prototype.ctrlr = function () { };

FindInStoreMapModal.prototype.requestClose = function () {
    store.dispatch(showFindInStoreMapModal(false));
};

FindInStoreMapModal.prototype.backToStoreList = function () {
    store.dispatch(showFindInStoreMapModal(false));
    store.dispatch(showFindInStoreModal(true, this.props.currentProduct,
            this.props.zipCode, this.props.searchedDistance, this.props.storesToShow));
};


// Added by sephora-jsx-loader.js
module.exports = FindInStoreMapModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/FindInStore/FindInStoreMapModal/FindInStoreMapModal.c.js