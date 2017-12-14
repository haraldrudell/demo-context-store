const TYPES = {
    SET_USER_SOCIAL_INFO: 'SET_USER_SOCIAL_INFO',
    SET_LITHIUM_SUCCESS_STATUS: 'SET_LITHIUM_SUCCESS_STATUS'
};

module.exports = {
    TYPES: TYPES,

    setUserSocialInfo: function (data) {
        return {
            type: TYPES.SET_USER_SOCIAL_INFO,
            socialInfo: data
        };
    },

    setLithiumSuccessStatus: function (data) {
        return {
            type: TYPES.SET_LITHIUM_SUCCESS_STATUS,
            isLithiumSuccessful: data
        };
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/SocialInfoActions.js