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
    Sephora.Util.InflatorComps.Comps['Price'] = function Price(){
        return PriceClass;
    }
}
const { lineHeights } = require('style');
const { Box, Text } = require('components/display');
const skuUtils = require('utils/Sku');

const Price = function () {};

Price.prototype.render = function () {
    let currentProduct = this.props;
    let {
        fontSize = 'h3',
        textAlign = Sephora.isMobile() ? 'center' : 'left',
        currentSku,
        hoveredSku
    } = currentProduct;
    let focusedSku = hoveredSku || currentSku;

    return (
        <Box
            fontSize={fontSize}
            textAlign={textAlign}
            lineHeight={2}
            fontWeight={700}>
            {focusedSku.salePrice ?
                <div>
                    <Text
                        textDecoration='line-through'
                        fontWeight={400}
                        color='silver'>
                        {focusedSku.listPrice}
                    </Text>
                    {' '}
                    <Text
                        color='red'>
                        {focusedSku.salePrice}
                    </Text>
                </div>
            :
                skuUtils.isFree(focusedSku) ? 'FREE' :
                    (focusedSku.biType ? focusedSku.biType.toLowerCase() : focusedSku.listPrice)

            }
            {focusedSku.valuePrice &&
                <Box
                    fontSize='.875em'
                    marginTop='.125em'
                    fontWeight={400}>
                    {focusedSku.valuePrice}
                </Box>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
Price.prototype.path = 'ProductPage/Price';
// Added by sephora-jsx-loader.js
Price.prototype.class = 'Price';
// Added by sephora-jsx-loader.js
Price.prototype.getInitialState = function() {
    Price.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Price.prototype.render = wrapComponentRender(Price.prototype.render);
// Added by sephora-jsx-loader.js
var PriceClass = React.createClass(Price.prototype);
// Added by sephora-jsx-loader.js
PriceClass.prototype.classRef = PriceClass;
// Added by sephora-jsx-loader.js
Object.assign(PriceClass, Price);
// Added by sephora-jsx-loader.js
module.exports = PriceClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Price/Price.jsx