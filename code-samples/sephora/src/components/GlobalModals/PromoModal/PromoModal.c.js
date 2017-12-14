// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PromoModal = function () {};

// Added by sephora-jsx-loader.js
PromoModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const showPromoModal = require('Actions').showPromoModal;
const promoActions = require('actions/PromoActions');

PromoModal.prototype.isDone = function (e) {
    let msgPromosSkuList = store.getState().promo.msgPromosSkuList;
    if (msgPromosSkuList.length > 0) {
        store.dispatch(promoActions.submitMsgPromos());
    } else {
        store.dispatch(showPromoModal(false));
    }
};

PromoModal.prototype.requestClose = function (e) {
    store.dispatch(showPromoModal(false));
};


// Added by sephora-jsx-loader.js
module.exports = PromoModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/PromoModal/PromoModal.c.js