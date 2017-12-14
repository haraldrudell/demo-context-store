const TYPES = {
    SHOW_VIRTUAL_ARTIST: 'SHOW_VIRTUAL_ARTIST',
    UPDATE_MODEL: 'UPDATE_MODEL',
    UPDATE_IMAGE: 'UPDATE_IMAGE',
    UPDATE_SKU_ID: 'UPDATE_SKU_ID',
    SWIPE_VIRTUAL_ARTIST: 'SWIPE_VIRTUAL_ARTIST'
};

module.exports = {
    TYPES: TYPES,
    showVirtualArtist: function (isVisible) {
        return {
            type: TYPES.SHOW_VIRTUAL_ARTIST,
            isVisible: isVisible
        };
    },
    updateModel: function (model) {
        return {
            type: TYPES.UPDATE_MODEL,
            model: model
        };
    },
    updateSkuId: function (skuId) {
        return {
            type: TYPES.UPDATE_SKU_ID,
            skuId: skuId
        };
    },
    updateImage: function (appliedMakeupImage) {
        return {
            type: TYPES.UPDATE_IMAGE,
            appliedMakeupImage: appliedMakeupImage
        };
    },
    swipeVirtualArtist: function (direction) {
        return {
            type: TYPES.SWIPE_VIRTUAL_ARTIST,
            direction: direction
        };
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/VirtualArtistActions.js