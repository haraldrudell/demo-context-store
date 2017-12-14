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
    Sephora.Util.InflatorComps.Comps['ProductLoveToggle'] = function ProductLoveToggle(){
        return ProductLoveToggleClass;
    }
}
const colors = require('style').colors;
const { Box } = require('components/display');

const IconLove = require('components/Icon/IconLove');

var ProductLoveToggle = function () {};

ProductLoveToggle.prototype.render = function () {
    const {
        sku,
        mouseEnter,
        mouseLeave,
        handleOnClick,
        isActive,
        hover,
        ...props
    } = this.props;

    return (
        <Box
            display='inline-block'
            {...props}
            data-at={Sephora.debug.dataAt(isActive ? 'loved' : 'unloved')}
            lineHeight={0}
            textAlign='center'
            onClick={(e) => handleOnClick(e, sku)}
            data-love-source={sku.loveSource}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}>
            <IconLove
                outline={!isActive && !hover}
                color={
                    isActive || hover ? colors.red : colors.black
                } />
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ProductLoveToggle.prototype.path = 'Product/ProductLove/ProductLoveToggle';
// Added by sephora-jsx-loader.js
ProductLoveToggle.prototype.class = 'ProductLoveToggle';
// Added by sephora-jsx-loader.js
ProductLoveToggle.prototype.getInitialState = function() {
    ProductLoveToggle.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductLoveToggle.prototype.render = wrapComponentRender(ProductLoveToggle.prototype.render);
// Added by sephora-jsx-loader.js
var ProductLoveToggleClass = React.createClass(ProductLoveToggle.prototype);
// Added by sephora-jsx-loader.js
ProductLoveToggleClass.prototype.classRef = ProductLoveToggleClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductLoveToggleClass, ProductLoveToggle);
// Added by sephora-jsx-loader.js
module.exports = ProductLoveToggleClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle.jsx