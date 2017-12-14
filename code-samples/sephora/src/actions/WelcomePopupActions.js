const TYPES = {
    UPDATE_WELCOME: 'UPDATE_WELCOME'
};

module.exports = {
    TYPES: TYPES,

    updateWelcome: function (welcomeMat) {
        return {
            type: TYPES.UPDATE_WELCOME,
            welcomeMat: welcomeMat
        };
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/WelcomePopupActions.js