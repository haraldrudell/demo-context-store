var USER_ACTION_TYPES = require('../actions/UserActions').TYPES;

const initialState = {
    profileStatus: 0
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case USER_ACTION_TYPES.UPDATE:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/user.js