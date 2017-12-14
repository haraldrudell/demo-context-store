const TYPES = {
    SHOW_TERMS_CONDITIONS_MODAL: 'SHOW_TERMS_CONDITIONS_MODAL'
};

module.exports = {
    TYPES: TYPES,

    showModal: function (isOpen, mediaId, title) {
        return {
            type: TYPES.SHOW_TERMS_CONDITIONS_MODAL,
            isOpen: isOpen,
            mediaId: mediaId,
            title: title
        };
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/TermsAndConditionsActions.js