const TYPES = {
    ADDED_PRODUCTS_NOTIFICATION: 'ADDED_PRODUCTS_NOTIFICATION',
    RESET_PRODUCTS_NOTIFICATION: 'RESET_PRODUCTS_NOTIFICATION',
    SHOW_BASKET: 'SHOW_BASKET'
};

function addedProductsNotification(addedProductsCount) {
    return {
        type: TYPES.ADDED_PRODUCTS_NOTIFICATION,
        justAddedProducts: addedProductsCount
    };
}

function resetProductsNotification() {
    const defaultValue = 0;
    return {
        type: TYPES.RESET_PRODUCTS_NOTIFICATION,
        justAddedProducts: defaultValue
    };
}

function showInlineBasket(isOpen) {
    return {
        type: TYPES.SHOW_BASKET,
        isOpen: isOpen
    };
}

module.exports = {

    TYPES: TYPES,

    addedProductsNotification: addedProductsNotification,

    resetProductsNotification: resetProductsNotification,

    showInlineBasket: showInlineBasket

};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/InlineBasketActions.js