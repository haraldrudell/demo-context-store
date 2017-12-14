var ACTION_TYPES = require('actions/InlineBasketActions').TYPES;

const initialState = {
    justAddedProducts: 0,
    isOpen: false
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.ADDED_PRODUCTS_NOTIFICATION:
            return Object.assign({}, state, {
                justAddedProducts: state.justAddedProducts + action.justAddedProducts
            });
        case ACTION_TYPES.SHOW_BASKET:
            return Object.assign({}, state, {
                isOpen: action.isOpen
            });
        case ACTION_TYPES.RESET_PRODUCTS_NOTIFICATION:
            return Object.assign({}, state, {
                justAddedProducts: action.justAddedProducts
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/inline-basket.js