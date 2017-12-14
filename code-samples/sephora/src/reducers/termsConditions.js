var ACTION_TYPES = require('actions/TermsAndConditionsActions').TYPES;

const initialState = {
    isOpen: false,
    mediaId: '',
    title: ''
};

module.exports = function (state = initialState, action = {}) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_TERMS_CONDITIONS_MODAL:
            return Object.assign({}, state, {
                isOpen: action.isOpen,
                mediaId: action.mediaId,
                title: action.title
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/termsConditions.js