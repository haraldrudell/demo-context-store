var ACTION_TYPES = require('actions/BasketActions').TYPES;

const initialState = {
    isInitialized: false,
    itemCount: 0,
    rewards: [],
    promos: [],
    samples: [],
    products: [],
    subtotal: '$0.00',
    rawSubTotal: '$0.00',
    pendingBasketSkus: []
};

/**
 * If removing property from basket state, don't remove property entirely.
 * If you do, state will not reflect change due to object.assign.
 * Instead set property value to null to simulate removal, this will update state.
 */
module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_BASKET:
            return Object.assign({}, state, { basketLevelMessages: undefined }, action.basket);
        case ACTION_TYPES.SHOW_BASKET_ERROR: {
            let basket = (action.error && action.itemsAndErrors) ?
                Object.assign({}, state, { items: action.itemsAndErrors }) :
                state.items;
            return Object.assign({}, state, {
                basket,
                error: action.error
            });
        }
        case ACTION_TYPES.SHOW_BASKET_WARNING: {
            return Object.assign({}, state, { basketItemWarnings: action.basketItemWarnings });
        }
        case ACTION_TYPES.SHOW_STICKY_APPLE_PAY_BTN:
            return Object.assign({},
                    state,
                    { showStickyApplePayBtn: action.showStickyApplePayBtn }
                );
        case ACTION_TYPES.SHOW_PAYPAL_RESTRICTED_MESSAGE:
            return Object.assign({},
                    state,
                    { showPaypalRestrictedMessage: action.showPaypalRestrictedMessage }
                );
        case ACTION_TYPES.CLEAR_PENDING_SKU:
        case ACTION_TYPES.ADD_PENDING_SKU:
        case ACTION_TYPES.REMOVE_PENDING_SKU:
            return Object.assign(
                {},
                state,
                { pendingBasketSkus: action.pendingBasketSkus }
            );
        default:
            return state;
    }
};




// WEBPACK FOOTER //
// ./public_ufe/js/reducers/basket.js