const ACTION_TYPES = require('actions/SocialInfoActions').TYPES;

const initialState = {
    isLithiumSuccessful: null
};

module.exports = function(state = initialState, action) {
    switch (action.type) {
        //TODO: add other social necessary data to socialInfo object
        case ACTION_TYPES.SET_USER_SOCIAL_INFO:
            return Object.assign({}, state, action.socialInfo);

        case ACTION_TYPES.SET_LITHIUM_SUCCESS_STATUS:
            return Object.assign({}, state, {
                isLithiumSuccessful: action.isLithiumSuccessful
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/socialInfo.js