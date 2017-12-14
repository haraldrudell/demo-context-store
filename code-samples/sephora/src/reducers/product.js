var ACTION_TYPES = require('../actions/ProductActions').TYPES;

var UserSpecificProductUtils = require('utils/UserSpecificProduct');

const initialState = {
    currentSku: null,
    currentProduct: {},
    currentSkuQuantity: 1,
    currentProductUserSpecificDetails: {},
    isUserSpecificReady: false
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.CHANGE_CURRENT_SKU:
            return Object.assign({}, state, {
                currentSku: action.currentSku
            });

        case ACTION_TYPES.UPDATE_CURRENT_PRODUCT: {
            let currentProductWithUserSpecificDetails =
                UserSpecificProductUtils.addUserSpecificDetailsToProduct(
                    action.currentProduct,
                    state.currentProductUserSpecificDetails
                );

            return Object.assign({}, state, {
                currentProduct: currentProductWithUserSpecificDetails
            });
        }

        case ACTION_TYPES.UPDATE_CURRENT_PRODUCT_USER_SPECIFIC: {
            let currentProductWithUserSpecificDetails =
                UserSpecificProductUtils.addUserSpecificDetailsToProduct(
                    state.currentProduct,
                    action.currentProductUserSpecificDetails
                );

            return Object.assign({}, state, {
                currentProduct: currentProductWithUserSpecificDetails,
                currentProductUserSpecificDetails: action.currentProductUserSpecificDetails
            });
        }

        case ACTION_TYPES.UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT: {
            let currentProduct = state.currentProduct || {};
            currentProduct.currentSku = action.currentSkuInProduct;
            return Object.assign({}, state, {
                currentProduct: currentProduct
            });
        }
        case ACTION_TYPES.UPDATE_QUANTITY_OF_CURRENT_SKU:
            return Object.assign({}, state, {
                currentSkuQuantity: action.currentSkuQuantity
            });
        case ACTION_TYPES.HOVERED_SKU:
            return Object.assign({}, state, {
                hoveredSku: action.hoveredSku
            });
        case ACTION_TYPES.CUSTOM_SETS_CHOICE_UPDATED:
            return Object.assign({}, state, {
                customSetsChoices: action.customSetsChoices
            });
        case ACTION_TYPES.TOGGLE_CUSTOM_SETS:
            return Object.assign({}, state, {
                isOpenCustomSets: action.isOpen
            });
        case ACTION_TYPES.ADD_FLASH_ON_PDP:
            return Object.assign({}, state, {
                addFlashOnPdp: action.state
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/product.js