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
    Sephora.Util.InflatorComps.Comps['ProductDisplayName'] = function ProductDisplayName(){
        return ProductDisplayNameClass;
    }
}
const { fontSizes, lineHeights } = require('style');
const { Box, Text } = require('components/display');
const uiUtils = require('utils/UI');

const ProductDisplayName = function () {};

ProductDisplayName.prototype.render = function () {
    const {
        brandName,
        productName,
        fontSize = 'h5',
        atPrefix = 'sku_item',
        numberOfLines,
        isHovered,
        ...props
    } = this.props;

    const lineHeight = lineHeights[2];

    return (
        <Box
            {...props}
            fontSize={fontSize}
            lineHeight={lineHeight}
            transition='opacity .2s'
            opacity={isHovered ? 0.5 : 1}
            _css={numberOfLines ? {
                overflow: 'hidden',
                maxHeight: lineHeight * fontSizes[fontSize] * numberOfLines,
                '&': uiUtils.isSupportsLineClamp() ? {
                    display: '-webkit-box',
                    WebkitLineClamp: numberOfLines,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis'
                } : {}
            } : {}}>
            {brandName &&
                <Text
                    lineHeight={1}
                    fontWeight={700}
                    textTransform='uppercase'
                    className='OneLinkNoTx'
                    data-at={Sephora.debug.dataAt(atPrefix + '_brand')}
                    dangerouslySetInnerHTML={{ __html: brandName }} />
            }
            {brandName && <br />}
            <Text
                data-at={Sephora.debug.dataAt(atPrefix + '_name')}
                dangerouslySetInnerHTML={{ __html: productName }} />
        </Box>
    );
};


// Added by sephora-jsx-loader.js
ProductDisplayName.prototype.path = 'Product/ProductDisplayName';
// Added by sephora-jsx-loader.js
ProductDisplayName.prototype.class = 'ProductDisplayName';
// Added by sephora-jsx-loader.js
ProductDisplayName.prototype.getInitialState = function() {
    ProductDisplayName.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductDisplayName.prototype.render = wrapComponentRender(ProductDisplayName.prototype.render);
// Added by sephora-jsx-loader.js
var ProductDisplayNameClass = React.createClass(ProductDisplayName.prototype);
// Added by sephora-jsx-loader.js
ProductDisplayNameClass.prototype.classRef = ProductDisplayNameClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductDisplayNameClass, ProductDisplayName);
// Added by sephora-jsx-loader.js
module.exports = ProductDisplayNameClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductDisplayName/ProductDisplayName.jsx