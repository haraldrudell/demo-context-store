const snbApi = require('services/api/search-n-browse');

const TYPES = {
    CHANGE_CURRENT_SKU: 'CHANGE_CURRENT_SKU',
    SUBSCRIPTION: {
        TYPE: 'outOfStock',
        ACTION_TYPE: 'cancel'
    },
    UPDATE_CURRENT_PRODUCT: 'UPDATE_CURRENT_PRODUCT',
    UPDATE_CURRENT_PRODUCT_USER_SPECIFIC: 'UPDATE_CURRENT_PRODUCT_USER_SPECIFIC',
    UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT: 'UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT',
    UPDATE_QUANTITY_OF_CURRENT_SKU: 'UPDATE_QUANTITY_OF_CURRENT_SKU',
    HOVERED_SKU: 'HOVERED_SKU',
    TOGGLE_CUSTOM_SETS: 'TOGGLE_CUSTOM_SETS',
    CUSTOM_SETS_CHOICE_UPDATED: 'CUSTOM_SETS_CHOICE_UPDATED',
    REVIEW_FILTERS_APPLIED: 'REVIEW_FILTERS_APPLIED',
    BEAUTY_MATCH_FILTERS_TOGGLED: 'BEAUTY_MATCH_FILTERS_TOGGLED',
    GALLERY_FILTERS_APPLIED: 'GALLERY_FILTERS_APPLIED',
    RESET_GALLERY_FILTERS: 'RESET_GALLERY_FILTERS',
    TOGGLE_SWATCHES: 'TOGGLE_SWATCHES',
    ADD_FLASH_ON_PDP: 'ADD_FLASH_ON_PDP'
};

const SKU_UPDATE_SOURCE = {
    SWATCHES: 'SWATCHES',
    QUERY_STRING: 'QUERY_STRING'
};

module.exports = {

    SKU_UPDATE_SOURCE: SKU_UPDATE_SOURCE,

    TYPES: TYPES,

    changeCurrentSku: function (sku) {
        return {
            type: TYPES.CHANGE_CURRENT_SKU,
            currentSku: sku
        };
    },

    updateCurrentProduct: function (currentProduct) {
        return {
            type: TYPES.UPDATE_CURRENT_PRODUCT,
            currentProduct: currentProduct
        };
    },

    /**
     * Mixes the user specific data in to the product (on all sku levels) and updates
     * the product in the store
     * @returns {{type: *, userSpecificProductDetails: *}}
     */
    updateCurrentUserSpecificProduct: function(userSpecificProductDetails) {
        return {
            type: TYPES.UPDATE_CURRENT_PRODUCT_USER_SPECIFIC,
            currentProductUserSpecificDetails: userSpecificProductDetails
        };
    },

    updateSkuInCurrentProduct: function (newCurrentSku, source) {
        return {
            type: TYPES.UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT,
            currentSkuInProduct: newCurrentSku,
            source: source
        };
    },

    updateQuantityOfCurrentSku: function (quantity) {
        return {
            type: TYPES.UPDATE_QUANTITY_OF_CURRENT_SKU,
            currentSkuQuantity: quantity
        };
    },

    hoveredSku: function (hoveredSku) {
        return {
            type: TYPES.HOVERED_SKU,
            hoveredSku: hoveredSku
        };
    },

    updateCustomSetsChoices: function (customSetsChoices) {
        return {
            type: TYPES.CUSTOM_SETS_CHOICE_UPDATED,
            customSetsChoices: customSetsChoices
        };
    },

    toggleCustomSets: function (isOpen) {
        return {
            type: TYPES.TOGGLE_CUSTOM_SETS,
            isOpen: isOpen
        };
    },

    // forceapply tells ReviewsFilters to update, even if
    // filters have not changed
    applyReviewFilters: function (filters, forceApply = false) {
        return {
            type: TYPES.REVIEW_FILTERS_APPLIED,
            filters: filters,
            apply: forceApply
        };
    },

    beautyMatchFiltersToggled: function (filters, isChecked, name) {
        return {
            type: TYPES.BEAUTY_MATCH_FILTERS_TOGGLED,
            filters: filters,
            isChecked: isChecked,
            name: name
        };
    },

    applyGalleryFilters: function (filters, isBeautyMatch) {
        return {
            type: TYPES.GALLERY_FILTERS_APPLIED,
            filters: filters,
            isBeautyMatch: isBeautyMatch
        };
    },

    resetGalleryFilters: function() {
        return {
            type: TYPES.RESET_GALLERY_FILTERS,
            filters: []
        };
    },

    fetchCurrentProduct: function (productId, skuId) {
        return (dispatch) => {
            return snbApi.getProductDetails(
                    productId, skuId, { addCurrentSkuToProductChildSkus: true }).
                then(data => dispatch(this.updateCurrentProduct(data)));
        };
    },

    toggleSwatches: function (isExpand) {
        return {
            type: TYPES.TOGGLE_SWATCHES,
            isExpand: isExpand
        };
    },

    toggleAddFlashOnPdp: function (newState) {
        return {
            type: TYPES.ADD_FLASH_ON_PDP,
            state: newState
        };
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/ProductActions.js