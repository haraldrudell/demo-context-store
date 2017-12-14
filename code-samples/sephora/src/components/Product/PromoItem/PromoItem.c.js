// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PromoItem = function () {};

// Added by sephora-jsx-loader.js
PromoItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const skuUtils = require('utils/Sku');

PromoItem.prototype.ctrlr = function () {
    let setMsgPromos = (promos) => this.setState({
        promosList: promos.msgPromosSkuList,
        maxPromoQtyReached: this.isMaxPromosReached(),
        isInMsgPromoSkuList: skuUtils.isInMsgPromoSkuList(this.props.skuId),
        promoErrorMessage: promos.promoErrorMessage
    });

    store.setAndWatch('promo', null, (value) => {
        setMsgPromos(value.promo);
    });
};

PromoItem.prototype.isMaxPromosReached = function () {
    return (store.getState().promo.msgPromosSkuList.length >= this.props.maxMsgSkusToSelect);
};


// Added by sephora-jsx-loader.js
module.exports = PromoItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/PromoItem/PromoItem.c.js