const ACTION_TYPES = require('actions/ProfileActions').TYPES;

const initialState = {
    biAccount: null,
    accountHistorySlice: null
};

module.exports = function (state = initialState, action) {
    switch (action.type) {

        case ACTION_TYPES.UPDATE_BI_ACCOUNT:
            return Object.assign({}, state, {
                biAccount: action.biAccount
            });

        case ACTION_TYPES.SET_ACCOUNT_HISTORY_SLICE:
            return Object.assign({}, state, {
                accountHistorySlice: action.accountHistorySlice
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/profile.js