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
    Sephora.Util.InflatorComps.Comps['ProductVariation'] = function ProductVariation(){
        return ProductVariationClass;
    }
}
const { fontSizes, lineHeights } = require('style');
const { Box, Text } = require('components/display');
const skuUtils = require('utils/Sku');

const ProductVariation = function () {};

ProductVariation.prototype.render = function () {
    const isDesktop = Sephora.isDesktop();

    let {
        product,
        sku,
        hasMinHeight,
        fontSize = 'h4',
        ...props
    } = this.props;

    return (
        (product &&
         product.variationType !== skuUtils.skuVariationType.NONE) ||
        (sku.variationType !== skuUtils.skuVariationType.NONE)
        ?
            <Box
                {...props}
                fontSize={fontSize}
                lineHeight={lineHeights[2]}
                _css={isDesktop && hasMinHeight ? {
                    minHeight: (lineHeights[2] * fontSizes[fontSize] * 2)
                } : {}}>
                {this.getOnlyFewLeftLabel(sku, true)}
                {((product || sku).variationType &&
                   !skuUtils.isFragrance(product, sku)) &&
                   `${(product || sku).variationType.toUpperCase()}: `
                }
                {sku.variationValue && sku.variationValue}
                {sku.variationDesc && ` - ${sku.variationDesc}`}
            </Box>
        :
            this.getOnlyFewLeftLabel(sku)
    );
};

ProductVariation.prototype.getOnlyFewLeftLabel = function (sku, isInline) {
    return (
        sku.isOnlyFewLeft ?
            <Text
                fontSize='h5'
                display={isInline ? 'inline' : 'block'}
                fontWeight={700}>
                only a few left
                {isInline && ' - '}
            </Text>
        : null
    );
};


// Added by sephora-jsx-loader.js
ProductVariation.prototype.path = 'Product/ProductVariation';
// Added by sephora-jsx-loader.js
ProductVariation.prototype.class = 'ProductVariation';
// Added by sephora-jsx-loader.js
ProductVariation.prototype.getInitialState = function() {
    ProductVariation.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductVariation.prototype.render = wrapComponentRender(ProductVariation.prototype.render);
// Added by sephora-jsx-loader.js
var ProductVariationClass = React.createClass(ProductVariation.prototype);
// Added by sephora-jsx-loader.js
ProductVariationClass.prototype.classRef = ProductVariationClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductVariationClass, ProductVariation);
// Added by sephora-jsx-loader.js
module.exports = ProductVariationClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductVariation/ProductVariation.jsx