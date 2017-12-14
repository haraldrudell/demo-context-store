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
    Sephora.Util.InflatorComps.Comps['ProductCarousel'] = function ProductCarousel(){
        return ProductCarouselClass;
    }
}
const space = require('style').space;
const Carousel = require('components/Carousel/Carousel');

const ProductCarousel = function () {};

ProductCarousel.prototype.render = function () {
    const {
        items,
        gutter,
        ...props
    } = this.props;
    return (
        <Carousel
            {...props}
            totalItems={items.length}
            gutter={gutter ? gutter : space[5]}
            showTouts={true}
            showArrows={Sephora.isDesktop()}>
            {items}
        </Carousel>
    );
};


// Added by sephora-jsx-loader.js
ProductCarousel.prototype.path = 'ProductPage/ProductCarousel';
// Added by sephora-jsx-loader.js
ProductCarousel.prototype.class = 'ProductCarousel';
// Added by sephora-jsx-loader.js
ProductCarousel.prototype.getInitialState = function() {
    ProductCarousel.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductCarousel.prototype.render = wrapComponentRender(ProductCarousel.prototype.render);
// Added by sephora-jsx-loader.js
var ProductCarouselClass = React.createClass(ProductCarousel.prototype);
// Added by sephora-jsx-loader.js
ProductCarouselClass.prototype.classRef = ProductCarouselClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductCarouselClass, ProductCarousel);
// Added by sephora-jsx-loader.js
module.exports = ProductCarouselClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/ProductCarousel/ProductCarousel.jsx