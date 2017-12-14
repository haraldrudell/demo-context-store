var ACTION_TYPES = require('../actions/Actions').TYPES;

const initialState = {
    currentSort : null
};

module.exports = function(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_PRODUCT_SORT:
            return Object.assign({}, state, {
                currentSort: action.sortOption
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/productSort.js