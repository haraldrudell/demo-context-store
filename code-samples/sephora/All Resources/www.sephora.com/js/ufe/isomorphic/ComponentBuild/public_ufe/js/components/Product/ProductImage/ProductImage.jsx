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
    Sephora.Util.InflatorComps.Comps['ProductImage'] = function ProductImage(){
        return ProductImageClass;
    }
}
const { Box, Image } = require('components/display');
const UI = require('utils/UI');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;

const ProductImage = function () {};

ProductImage.prototype.render = function () {
    const {
        skuImages = {},
        src,
        size = IMAGE_SIZES[97],
        width,
        maxWidth = '100%',
        disableLazyLoad = false,
        isPageRenderImg,
        ...props
    } = this.props;

    const imageSrc = skuImages['image' + size] || src;

    return (
        <Box
            {...props}
            position='relative'
            width={width || size}
            maxWidth={maxWidth}>
            <Box
                paddingBottom='100%' />
            <Image
                disableLazyLoad={disableLazyLoad}
                position='absolute'
                width='100%'
                height='100%'
                top={0} left={0}
                src={imageSrc}
                isPageRenderImg={isPageRenderImg}
                /* TODO: rm condition once all product images have retina versions */
                srcSet={(size === IMAGE_SIZES[97] ||
                    size === IMAGE_SIZES[135] ||
                    size === IMAGE_SIZES[162]) ?
                    UI.getRetinaSrcSet(imageSrc) : null} />
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ProductImage.prototype.path = 'Product/ProductImage';
// Added by sephora-jsx-loader.js
ProductImage.prototype.class = 'ProductImage';
// Added by sephora-jsx-loader.js
ProductImage.prototype.getInitialState = function() {
    ProductImage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductImage.prototype.render = wrapComponentRender(ProductImage.prototype.render);
// Added by sephora-jsx-loader.js
var ProductImageClass = React.createClass(ProductImage.prototype);
// Added by sephora-jsx-loader.js
ProductImageClass.prototype.classRef = ProductImageClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductImageClass, ProductImage);
// Added by sephora-jsx-loader.js
module.exports = ProductImageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductImage/ProductImage.jsx