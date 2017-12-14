// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BasketListItem = function () {};

// Added by sephora-jsx-loader.js
BasketListItem.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const BasketActions = require('actions/BasketActions');
const Authentication = require('utils/Authentication');
const LoveActions = require('actions/LoveActions');
const updateBasketQuantity = require('analytics/bindings/pages/all/updateBasketQuantity');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const blueCore = require('analytics/bluecore');
const ReactDOM = require('react-dom');
const { site } = require('style');

BasketListItem.prototype.ctrlr = function () {
    store.setAndWatch('basket', null, (value) => {
        /**
         * Show Paypal Restricted Message of item,
         * if it exists and wasn't shown before.
         * For Mobile: scroll to item
         */
        if (this.props.item.sku.isPaypalRestricted &&
            !this.state.showPaypalRestrictedMessage &&
            value.basket.showPaypalRestrictedMessage) {

            this.setState({
                showPaypalRestrictedMessage: true
            }, () => {
                if (Sephora.isMobile()) {
                    let el = ReactDOM.findDOMNode(this);
                    if (el && el.offsetTop) {
                        document.body.scrollTop =
                            Math.max(el.offsetTop - site.HEADER_HEIGHT_MW * 2, 0);
                    }
                }
            });
        }
    });
};

BasketListItem.prototype.removeItemFromBasket = function (item) {
    store.dispatch(
        BasketActions.removeItemFromBasket(item)
    );
};

BasketListItem.prototype.handleLoveRequest = function (item, callback) {
    let loveRequest = {
        loveSource: this.props.loveSource,
        skuId: item.sku.skuId
    };

    store.dispatch(LoveActions.addLove(loveRequest, callback));
};

BasketListItem.prototype.handleMoveToLoveClick = function (e, item) {
    e.preventDefault();

    //Analytics
    //This should always fire on click. Don't wait for successful sign-in or anything
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: [require('analytics/bindings/pages/all/moveToLoveEvent')],
            item: [item],
            specificEventName: anaConsts.EVENT_NAMES.ADD_TO_LOVES
        }
    });

    Authentication.requireAuthentication(
        null,
        null,
        null).then(() => {
            this.handleLoveRequest(item, () => store.dispatch(BasketActions.refreshBasket()));
        });
};

BasketListItem.prototype.handleSkuQuantity = function (qty, item, updateBasket) {
    if (item.modifiable) {
        //Analytics - Track quantity change
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                bindingMethods: [updateBasketQuantity],
                sku: item.sku,
                oldQty: item.qty,
                newQty: parseInt(qty)
            }
        });

        // Bluecore event for increase in quantity
        if (parseInt(qty) > item.qty) {
            blueCore.addToCartEvent(item.sku.productId);
        }

        updateBasket(qty, item);
    }
};

BasketListItem.prototype.handleShipRestrictionsClick = function (e) {
    e.preventDefault();
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            eventStrings: [anaConsts.Event.EVENT_71],
            linkName: 'basket:shipping-restrictions',
            actionInfo: 'basket:shipping-restrictions'
        }
    });
};


// Added by sephora-jsx-loader.js
module.exports = BasketListItem.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketList/BasketListItem.c.js