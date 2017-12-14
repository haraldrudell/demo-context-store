// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ColorIQ = function () {};

// Added by sephora-jsx-loader.js
ColorIQ.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const userUtils = require('utils/User');
const skuUtils = require('utils/Sku');
const showColorIQModal = require('Actions').showColorIQModal;
const FrameworkActions = require('actions/FrameworkActions');
const ProductActions = require('actions/ProductActions');
const ProductWatcher = require('../Type/ProductWatcher');
const UrlUtils = require('utils/Url');

ColorIQ.prototype.ctrlr = function() {
    this.setState({
        hasShadeCodeParam: UrlUtils.getParamsByName('shade_code')
    });
    store.setAndWatch(['user.beautyInsiderAccount', 'product.currentProduct.currentSku'], null,
        (data) => {
            this.setState({
                isColorIQMatch: skuUtils.isColorIQMatch(data.currentSku || this.props.sku)
            });
        }
    );
};

ColorIQ.prototype.editColorIQ = function (e) {
    e.preventDefault();
    store.dispatch(showColorIQModal(true, () => {
        // refresh the component. Ideally, should be refreshed automatically by its own BI watcher
    }));
};

ColorIQ.prototype.goToColorIQMatch = function (e) {
    e.preventDefault();
    let colorIQMatchSku = skuUtils.getColorIQMatchSku(this.props.product.regularChildSkus);

    if (colorIQMatchSku) {
        store.dispatch(ProductActions.updateSkuInCurrentProduct(colorIQMatchSku));
        store.dispatch(
            FrameworkActions.updateQueryParam(ProductWatcher.SKU_ID_PARAM, [colorIQMatchSku.skuId])
        );
        return true;
    }
    
    return false;
};


// Added by sephora-jsx-loader.js
module.exports = ColorIQ.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/ColorIQ/ColorIQ.c.js