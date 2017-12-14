// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var OutOfStockButton = function () {};

// Added by sephora-jsx-loader.js
OutOfStockButton.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const Actions = require('Actions');
const processEvent = require('analytics/processEvent');
const analyticsConsts = require('analytics/constants');
const snbApi = require('services/api/search-n-browse');

OutOfStockButton.prototype.emailMeButtonHandler = function (e) {
    e.preventDefault();

    let productId = this.props.product ?
            this.props.product.productId : this.props.sku.productId;

    snbApi.getProductDetails(
            productId, this.props.sku.skuId, { addCurrentSkuToProductChildSkus: true }).
        then(data => {
            const sku = Object.assign({}, data.currentSku, this.props.sku);
            store.dispatch(Actions.showEmailMeWhenInStockModal(true, data, sku, false));
        });

    //Analytics
    processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
        data: {
            eventStrings: ['event71'],
            sku: this.props.sku,
            linkName: 'Email Me When Available',
            internalCampaign: [
                this.props.sku.rootContainerName,
                this.props.sku.productId,
                'email-me-when-available'
            ],
            actionInfo: 'Email Me When Available'
        }
    });
};


// Added by sephora-jsx-loader.js
module.exports = OutOfStockButton.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddToBasketButton/OutOfStockButton/OutOfStockButton.c.js