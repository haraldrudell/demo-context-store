/**
* These are the bindings that will take place on the product page when the
* page load event occurs.
*/

const utils = require('analytics/utils');

module.exports = (function () {
    const bindingMethods =
        require('analytics/bindingMethods/pages/productPage/productPageBindings');

    const generalBindingMethods = require('analytics/bindingMethods/pages/all/generalBindings');

    const pageLoadBindings = function (data) {
        let primaryProduct = digitalData.product[0];

        /* Prerequisites *
        ** These need to be set first because some bindings depend on them. */

        if (primaryProduct) {
            //product:[PID]:[WORLD]:*
            digitalData.page.pageInfo.pageName = primaryProduct.productInfo.productID;
            digitalData.page.attributes.world = primaryProduct.attributes.world;

            digitalData.page.attributes.sephoraPageInfo.pageName =
                generalBindingMethods.getSephoraPageName();

            //Page :: Event Strings
            digitalData.page.attributes.eventStrings = bindingMethods.getPageEvents();

            //Product String :: On-load
            digitalData.page.attributes.productStrings =
                bindingMethods.getProductStrings(primaryProduct);
        }

        /*
        ** These bindings need to take place after the above bindings because they
        ** rely on the data set above.
        */
        utils.setNextPageData(
            {
                pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                pageType: digitalData.page.category.pageType
            }
        );
    };

    return pageLoadBindings;
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/product/productPageLoad.js