var ACTION_TYPES = require('actions/VirtualArtistActions').TYPES;

const initialState = {
    isVisible: false,
    skuId: null,
    model: null
};

module.exports = function (state = initialState, action = {}) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_VIRTUAL_ARTIST:
            return Object.assign({}, state, {
                isVisible: action.isVisible
            });
        case ACTION_TYPES.UPDATE_MODEL:
            return Object.assign({}, state, {
                model: action.model
            });
        case ACTION_TYPES.UPDATE_SKU_ID:
            return Object.assign({}, state, {
                skuId: action.skuId
            });
        case ACTION_TYPES.UPDATE_IMAGE:
            return Object.assign({}, state, {
                appliedMakeupImage: action.appliedMakeupImage
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/virtualArtist.js