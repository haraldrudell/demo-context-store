// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BasketList = function () {};

// Added by sephora-jsx-loader.js
BasketList.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const watch = require('redux-watch');
const userUtils = require('utils/User');
const auth = require('utils/Authentication');
const BasketActions = require('actions/BasketActions');
const skuUtils = require('utils/Sku');
const anaUtils = require('analytics/utils');

BasketList.prototype.ctrlr = function () {
    let basket = store.getState().basket;
    let watchBasket = watch(store.getState, 'basket');
    let watchUser = watch(store.getState, 'user');
    const US = require('utils/LanguageLocale.js').COUNTRIES.US;
    const isUS = () => userUtils.getShippingCountry().countryCode === US;

    this.setState({
        basket: basket,
        isLoggedIn: !userUtils.isAnonymous(),
        isUS: isUS()
    });

    store.subscribe(watchBasket((newBasket) => {
        this.setState({ basket: newBasket });
    }));

    store.subscribe(watchUser(() => {
        this.setState({
            isLoggedIn: !userUtils.isAnonymous(),
            isUS: isUS()
        });
    }));
};

BasketList.prototype.signInHandler = function (e) {
    e.stopPropagation();

    auth.requireAuthentication();
};

BasketList.prototype.updateBasket = function (qty, selectedItem, callback) {
    //jscs:disable requireShorthandArrowFunctions
    let newBasketItemList = this.state.basket.items.map(item => {
        return {
            isAcceptTerms: skuUtils.isFlash(item.sku),
            qty: item.commerceId === selectedItem.commerceId ? qty : item.qty,
            skuId: item.sku.skuId
        };
    });
    store.dispatch(
        BasketActions.updateQuantities(newBasketItemList, callback)
    );
};

BasketList.prototype.shopNewClick = function () {
    anaUtils.setNextPageData({ linkData: 'basket:shop-new-arrivals' });
};


// Added by sephora-jsx-loader.js
module.exports = BasketList.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketList/BasketList.c.js