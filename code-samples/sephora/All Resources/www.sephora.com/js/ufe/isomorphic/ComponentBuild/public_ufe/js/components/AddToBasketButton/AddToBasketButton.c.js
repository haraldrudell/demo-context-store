// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AddToBasketButton = function () {};

// Added by sephora-jsx-loader.js
AddToBasketButton.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const watch = require('redux-watch');
const store = require('Store');
const basketActions = require('actions/BasketActions');
const promoActions = require('actions/PromoActions');
const Debounce = require('utils/Debounce');
const THROTTLE_DELAY = 200;
const ReactDOM = require('react-dom');
const skuUtils = require('utils/Sku');

AddToBasketButton.prototype.ctrlr = function () {
    let basket = store.getState().basket;
    if (basket.itemCount === null) {
        let basketWatch = watch(store.getState, 'basket');
        store.subscribe(basketWatch(newVal => {
            this.setState({ disabled: basket.itemCount !== null });
        }));
    } else {
        this.setState({ disabled: false });
    }
};

function getPendingSkus(basket) {
    return basket.pendingBasketSkus.filter(item => {
        if (item.methodId){
            item.method();
            return false;
        }
        return true;
    });
}

AddToBasketButton.prototype.addClick = function (e) {
    const basket = store.getState().basket;
    const element = ReactDOM.findDOMNode(this);

    e.preventDefault();
    if (this.props.promoPanel === 'promo') {
        store.dispatch(promoActions.updateMsgPromo(this.props.sku));
    } else {
        let props = this.props;
        let pendingBasketSkus = getPendingSkus(basket);
        if (pendingBasketSkus.length > 0) {
            let prod = {
                skuId: props.sku.skuId,
                qty: props.quantity || 1
            };

            pendingBasketSkus = [].concat([prod], basket.pendingBasketSkus);

            let qty = pendingBasketSkus
                .map(item => item.qty)
                .reduce((prev, curr) => {
                    return prev + curr;
                });

            store.dispatch(
                basketActions.addMultipleSkusToBasket(
                    pendingBasketSkus,
                    qty,
                    () => {
                        if (typeof props.onSuccess === 'function') {
                            props.onSuccess();
                        }
                        store.dispatch(basketActions.clearPendingProductList());
                    },
                    props.analyticsContext,
                    props.productId,
                    prod
                    )
            );
            
        } else {
            store.dispatch(
                basketActions.addToBasket(
                    props.sku,
                    props.quantity,
                    props.onSuccess,
                    props.analyticsContext,
                    props.samplePanel,
                    props.productId
                )
            );
        }
    }


    // Remove outlined focus state from the button
    element.blur();
};

/**
 * This workaround prevents occasional double-click events
 */
AddToBasketButton.prototype.handleAddClick =
    Debounce.throttle(AddToBasketButton.prototype.addClick, THROTTLE_DELAY);

AddToBasketButton.prototype.handleOutOfStockClick = function (e) {
    e.preventDefault();
};


// Added by sephora-jsx-loader.js
module.exports = AddToBasketButton.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddToBasketButton/AddToBasketButton.c.js