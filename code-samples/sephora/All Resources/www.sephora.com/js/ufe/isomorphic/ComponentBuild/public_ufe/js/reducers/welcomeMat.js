var ACTION_TYPES = require('actions/WelcomePopupActions').TYPES;

const initialState = {};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_WELCOME:
            return Object.assign({}, state, action.welcomeMat);

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/welcomeMat.js