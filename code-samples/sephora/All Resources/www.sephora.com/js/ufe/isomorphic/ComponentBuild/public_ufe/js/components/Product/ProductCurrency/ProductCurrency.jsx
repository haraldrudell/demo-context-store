// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['ProductCurrency'] = function ProductCurrency(){
        return ProductCurrencyClass;
    }
}
var ProductCurrency = function () {};

ProductCurrency.prototype.render = function () {
    // TODO: Implement currencies
    return <span>$</span>;
};


// Added by sephora-jsx-loader.js
ProductCurrency.prototype.path = 'Product/ProductCurrency';
// Added by sephora-jsx-loader.js
ProductCurrency.prototype.class = 'ProductCurrency';
// Added by sephora-jsx-loader.js
ProductCurrency.prototype.getInitialState = function() {
    ProductCurrency.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductCurrency.prototype.render = wrapComponentRender(ProductCurrency.prototype.render);
// Added by sephora-jsx-loader.js
var ProductCurrencyClass = React.createClass(ProductCurrency.prototype);
// Added by sephora-jsx-loader.js
ProductCurrencyClass.prototype.classRef = ProductCurrencyClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductCurrencyClass, ProductCurrency);
// Added by sephora-jsx-loader.js
module.exports = ProductCurrencyClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductCurrency/ProductCurrency.jsx