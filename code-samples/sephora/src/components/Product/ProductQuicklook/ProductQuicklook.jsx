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
    Sephora.Util.InflatorComps.Comps['ProductQuicklook'] = function ProductQuicklook(){
        return ProductQuicklookClass;
    }
}
const { colors, fontSizes, space } = require('style');
const { Box } = require('components/display');
const certonaDataAt = require('utils/certona').CERTONA_DATA_AT_VALUES;

var ProductQuicklook = function () {};

ProductQuicklook.prototype.render = function () {
    const {
        buttonText,
        productId,
        skuId,
        isCertonaProduct
    } = this.props;

    return (
        <Box
            width='100%'
            _css={
                /* on touch devices, make hit area the full image height */
                Sephora.isTouch ? {
                    height: '100%'
                } : {
                    textAlign: 'center',
                    color: colors.white,
                    lineHeight: 1,
                    fontWeight: 500,
                    paddingTop: space[2],
                    paddingBottom: space[2],
                    fontSize: fontSizes.h6,
                    textTransform: 'uppercase',
                    backgroundColor: colors.black,
                    ':hover': { backgroundColor: colors.gray }
                }
            }
            data-certona={certonaDataAt.qlButton}
            data-product-id={productId}
            data-sku-number={skuId}
            onClick={(e) => this.handleOnClick(e, productId, skuId, isCertonaProduct)}>
            {buttonText ? buttonText : 'Quick Look'}
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ProductQuicklook.prototype.path = 'Product/ProductQuicklook';
// Added by sephora-jsx-loader.js
Object.assign(ProductQuicklook.prototype, require('./ProductQuicklook.c.js'));
var originalDidMount = ProductQuicklook.prototype.componentDidMount;
ProductQuicklook.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductQuicklook');
if (originalDidMount) originalDidMount.apply(this);
if (ProductQuicklook.prototype.ctrlr) ProductQuicklook.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductQuicklook');
// Added by sephora-jsx-loader.js
ProductQuicklook.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductQuicklook.prototype.class = 'ProductQuicklook';
// Added by sephora-jsx-loader.js
ProductQuicklook.prototype.getInitialState = function() {
    ProductQuicklook.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductQuicklook.prototype.render = wrapComponentRender(ProductQuicklook.prototype.render);
// Added by sephora-jsx-loader.js
var ProductQuicklookClass = React.createClass(ProductQuicklook.prototype);
// Added by sephora-jsx-loader.js
ProductQuicklookClass.prototype.classRef = ProductQuicklookClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductQuicklookClass, ProductQuicklook);
// Added by sephora-jsx-loader.js
module.exports = ProductQuicklookClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductQuicklook/ProductQuicklook.jsx