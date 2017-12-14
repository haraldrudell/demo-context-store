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
    Sephora.Util.InflatorComps.Comps['ProductLoveButton'] = function ProductLoveButton(){
        return ProductLoveButtonClass;
    }
}
const colors = require('style').colors;
const { Box } = require('components/display');

const IconLove = require('components/Icon/IconLove');
const ButtonOutline = require('components/Button/ButtonOutline');
const certonaDataAt = require('utils/certona').CERTONA_DATA_AT_VALUES;

var ProductLoveButton = function () {};

ProductLoveButton.prototype.render = function () {
    const {
        block,
        sku,
        mouseEnter,
        mouseLeave,
        isActive,
        hover,
        isCustomSetsProduct,
        handleOnClick
    } = this.props;
    let extraText = isCustomSetsProduct ? ' All' : '';
    return (
        <ButtonOutline
            data-at={Sephora.debug.dataAt(isActive ? 'loved' : 'unloved')}
            data-certona={certonaDataAt.qlLoves}
            block={block}
            onClick={(e) => handleOnClick(e, sku)}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            _css={{
                '&:active, &:hover': {
                    opacity: 1
                }
            }}>
            <Box
                display='inline-block'
                lineHeight={0}
                position='relative'
                top='-.0625em'
                marginRight={ extraText ? '0.1em' : '.5em' }
                verticalAlign='middle'>
                <IconLove
                    outline={!isActive && !hover}
                    color={
                        isActive || hover ? colors.red : colors.black
                    } />
            </Box>
            {isActive ?
                hover ? 'Unlove' + extraText : 'Loved' + extraText
                : 'Add' + extraText + ' to Loves'
            }
        </ButtonOutline>
    );
};


// Added by sephora-jsx-loader.js
ProductLoveButton.prototype.path = 'Product/ProductLove/ProductLoveButton';
// Added by sephora-jsx-loader.js
ProductLoveButton.prototype.class = 'ProductLoveButton';
// Added by sephora-jsx-loader.js
ProductLoveButton.prototype.getInitialState = function() {
    ProductLoveButton.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductLoveButton.prototype.render = wrapComponentRender(ProductLoveButton.prototype.render);
// Added by sephora-jsx-loader.js
var ProductLoveButtonClass = React.createClass(ProductLoveButton.prototype);
// Added by sephora-jsx-loader.js
ProductLoveButtonClass.prototype.classRef = ProductLoveButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductLoveButtonClass, ProductLoveButton);
// Added by sephora-jsx-loader.js
module.exports = ProductLoveButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductLove/ProductLoveButton/ProductLoveButton.jsx