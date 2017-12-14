/**
* These are the bindings that will take place on the basket page when the
* page load event occurs.
* Dependencies: DataLayer.js
*/

const store = require('store/Store');
const utils = require('analytics/utils');
const basketUtils = require('utils/Basket');

module.exports = (function () {
    const doubleClickBindings = require('analytics/bindingMethods/pages/all/doubleClickBindings');

    const pageLoadBindings = function (data) {

        const basketContents = store.getState().basket;

        /* Prerequisites *
        ** These need to be set first because some bindings depend on them. */
        digitalData.cart.attributes.doubleClick.allowedItems =
            doubleClickBindings.getAllowedItems(basketContents.items);

        /**** End Prerequisites *****/

        //Just get a shorter reference
        let allowedItems = digitalData.cart.attributes.doubleClick.allowedItems;

        digitalData.cart.attributes.doubleClick.skuIds = allowedItems.map(function (item) {
            return item.sku.skuId;
        });

        digitalData.cart.attributes.doubleClick.brandNames = allowedItems.map(function (item) {
            return item.sku.brandName;
        });

        digitalData.cart.attributes.doubleClick.skuPrices = allowedItems.map(function (item) {
            return utils.convertToUSD(
                basketUtils.removeCurrency(item.sku.salePrice || item.sku.listPrice)
            );
        });

        digitalData.cart.attributes.doubleClick.ratings = allowedItems.map(function (item) {
            return item.sku.primaryProduct.rating;
        });
    };

    return pageLoadBindings;
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/basket/basketPageLoad.js