var utils = require('analytics/utils');

module.exports = (function () {

    //All Pages Binding Methods
    return {

        getQLInteralCampaign: function (data) {
            return ((data.rootContainerName || 'n/a') + ':' + data.product.productId +
                ':quicklook').toLowerCase();
        },

        getQuickLookFeatureString: function (product) {
            var featureStrings = [];
            /*
            If a product skuSelectorType is different than None (Image or Text) it will
            do have childSkus (regularChildSkus or onSaleChildSkus)
            */
            if (product.skuSelectorType !== 'None') { featureStrings.push('ql:swatch'); }

            if (product.currentSku && product.currentSku.isOnlyFewLeft) {
                featureStrings.push('ql:only a few left');
            }

            return featureStrings.join(',');
        },

        /**
         * Build the page name for a quicklook s.t call.
         * @param  {object} data Info on the product that was clicked
         * @return {string}      The quick look page name.
         */
        getQuickLookPageName: function (data) {
            var world = this.getQuickLookWorld(data.product);
            var productName = data.product.rewardsInfo ?
                data.product.rewardsInfo.productName : data.product.displayName;
            var name = ['quicklook'];
            var nameData;

            nameData = [data.product.productId, world, ('*pname=' + productName)];

            for (let item of nameData) {
                if (item) {
                    name.push(item);
                }
            }

            return require('utils/replaceSpecialCharacters')(name.join(':'));
        },

        getQuickLookWorld: function (product) {
            var rootCategory = product;
            var world = product.rewardsInfo ? 'bi-rewards' : 'n/a';

            //Drill down until we get to the last parentCategory, this wil be 'world' (e.g. Makup)
            while (rootCategory.parentCategory) {
                world = rootCategory.parentCategory.displayName;
                rootCategory = rootCategory.parentCategory;
            }

            return world;
        }
    };
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindingMethods/pages/all/quickLookBindings.js