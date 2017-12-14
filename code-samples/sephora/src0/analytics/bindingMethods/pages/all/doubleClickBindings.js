const skuUtils = require('utils/Sku');

module.exports = (function () {
    //Methods used for binding data to digitalData properties related double click pixels.
    return {

        getAllowedItems: function (items = []) {
            return items.filter((item) => {
                let isAllowedType = false;
                let skuType;

                skuType = item.sku.type.toLowerCase();

                isAllowedType = (
                       skuType === skuUtils.skuTypes.STANDARD ||
                       skuType === skuUtils.skuTypes.FLASH ||
                       (skuType === skuUtils.skuTypes.SUBSCRIPTION && item.sku.skuId === '1001')
                );

                return isAllowedType &&
                    !skuUtils.isGwp(item.sku) &&
                    !skuUtils.isBiReward(item.sku) &&
                    !skuUtils.isSample(item.sku) &&
                    !skuUtils.isGiftCard(item.sku);
            });
        }
    };
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindingMethods/pages/all/doubleClickBindings.js