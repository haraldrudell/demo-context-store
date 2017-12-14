// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var FindInStoreModal = function () {};

// Added by sephora-jsx-loader.js
FindInStoreModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const snbApi = require('services/api/search-n-browse');
const LocaleUtils = require('utils/LanguageLocale');
const actions = require('Actions');
const STORES_PER_PAGE = 5;

FindInStoreModal.prototype.requestClose = function () {
    store.dispatch(actions.showFindInStoreModal(false));
};

FindInStoreModal.prototype.ctrlr = function () {
    if (this.props.zipCode && !this.props.storesToShow) {
        this.setState({ searchedDistance: LocaleUtils.isCanada() ?
                        150 : 100 }, () => this.fetchStores());
    }

    let setStoresToShow = (value) => this.setState(
        {
            storesToShow: value.storesToShow,
            showResult: true,
            inStock: true,
            searchedDistance: value.searchedDistance
        });

    store.setAndWatch('modals', null, (value) => {
        if (value.modals.storesToShow) {
            setStoresToShow(value.modals);
        }
    });
};

FindInStoreModal.prototype.handleDistanceSelect = function (e) {
    e.preventDefault();
    this.setState({
        searchedDistance: e.target.value
    });
};

FindInStoreModal.prototype.handleSubmit = function (e, searched) {
    e.preventDefault();
    let errorMessage = this.storeZipCode.validateError();
    if (!errorMessage) {
        this.fetchStores(searched);
    }
};

FindInStoreModal.prototype.fetchStores = function (searched) {
    let skuId = this.props.currentProduct.currentSku ?
        this.props.currentProduct.currentSku.skuId : this.props.currentProduct.skuId;
    let country = LocaleUtils.isCanada() ? 'CA' : 'US';
    let searchedDistance = this.state.searchedDistance || searched;
    let data = {
        zipCode: this.storeZipCode.getValue(),
        radius: parseInt(searchedDistance),
        country: country
    };
    return snbApi.findInStore(skuId, data).then(resp => {
        if (resp.errorCode) {
            this.setState({
                showResult: true,
                inStock: false,
                searchedDistance: searchedDistance
            });
        } else {
            this.storeList = resp.stores;
            this.totalStores = this.storeList.length;
            let inStock = this.totalStores > 0;
            let storesToShow = this.getCurrentPageStores(this.state.currentPage);
            this.setState({
                showResult: true,
                zipCode: data.zipCode,
                storesToShow: storesToShow,
                storeMessage: resp.storeMessages[0].messages[0],
                inStock: inStock,
                searchedDistance: searchedDistance
            });
        }
    }).catch(err => {
        console.log(err);
        if (err.errorCode) {
            this.setState({
                showResult: true,
                inStock: false,
                searchedDistance: searchedDistance
            });
        }
    });
};

FindInStoreModal.prototype.showMap = function (product, selectedStore,
                                               zipCode, searchedDistance, storesToShow) {
    store.dispatch(actions.showFindInStoreModal(false));
    store.dispatch(actions.showFindInStoreMapModal(true, product, selectedStore,
            zipCode, searchedDistance, storesToShow));
};

FindInStoreModal.prototype.shouldShowMoreStores = function () {
    return this.totalStores > this.state.currentPage * STORES_PER_PAGE;
};

FindInStoreModal.prototype.showMoreStores = function () {
    let currentPage = this.state.currentPage + 1;
    let storeListToShow = this.getCurrentPageStores(currentPage);
    this.setState({
        currentPage: currentPage,
        storesToShow: storeListToShow
    });
};

FindInStoreModal.prototype.getCurrentPageStores = function (currentPage) {
    return this.storeList.slice(0, currentPage * STORES_PER_PAGE);
};


// Added by sephora-jsx-loader.js
module.exports = FindInStoreModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/FindInStore/FindInStoreModal/FindInStoreModal.c.js