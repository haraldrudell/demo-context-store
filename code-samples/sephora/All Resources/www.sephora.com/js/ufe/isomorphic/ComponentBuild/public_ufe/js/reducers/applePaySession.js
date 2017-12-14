const ACTION_TYPES = require('actions/Actions').TYPES;
const initialState = {
    isActive: false
};
module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.ENABLE_APPLEPAY_SESSION:
            return Object.assign({}, state, {
                isActive: action.isActive
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/applePaySession.js