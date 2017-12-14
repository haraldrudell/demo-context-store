const ACTION_TYPES = require('actions/CategoryActions').TYPES;

const initialState = {
    categories: null,
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_CATEGORIES:
            return Object.assign({}, state, {
                categories: action.categories
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/category.js