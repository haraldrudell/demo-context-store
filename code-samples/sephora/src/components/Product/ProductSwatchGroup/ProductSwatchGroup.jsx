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
    Sephora.Util.InflatorComps.Comps['ProductSwatchGroup'] = function ProductSwatchGroup(){
        return ProductSwatchGroupClass;
    }
}
const { swatch } = require('style');
const uiUtils = require('utils/UI');
const skuUtils = require('utils/Sku');
const ProductSwatchItem = require('components/Product/ProductSwatchItem/ProductSwatchItem');
const CustomScroll = require('components/CustomScroll/CustomScroll');
const Flex = require('components/Flex/Flex');

var ProductSwatchGroup = function () {
    this.state = {
        currentSku: null,
        previousSku: null,
        toggledSku: null
    };
};

ProductSwatchGroup.prototype.render = function () {

    let skus = function (product) {
        let {
            regularChildSkus = [],
            onSaleChildSkus = []
        } = product;
        return [].concat([], regularChildSkus, onSaleChildSkus);
    };

    const swatchSize = uiUtils.swatchSize(this.props.product);
    const swatchHeight = swatchSize.height + swatch.PADDING * 2 + swatch.BORDER_WIDTH * 2;

    return (
        <CustomScroll
            _css={{
                /* Show two and half rows of swatches */
                maxHeight: this.props.product.skuSelectorType === skuUtils.skuSwatchType.IMAGE
                    ? swatchHeight * 2.5
                    : null,
                /* Outdent selector so swatch image edge is flush with container edge */
                marginLeft: -(swatch.PADDING + swatch.BORDER_WIDTH)
            }}>
            <Flex flexWrap='wrap'>
                {skus(this.props.product).map((sku, index) =>

                    // TODO: missing validation "&& !showOnSaleOnly"
                    !skuUtils.isSale(sku) &&
                        <ProductSwatchItem
                            key={index}
                            product={this.props.product}
                            sku={sku}
                            size={swatchSize}
                            activeSku={this.state.toggledSku}
                            colorIqSku={this.props.matchSku}
                            handleSkuOnClick={this.handleSkuOnClick}
                            handleSkuOnMouseEnter={this.handleSkuOnMouseEnter}
                            handleSkuOnMouseLeave={this.handleSkuOnMouseLeave}/>
                )}
            </Flex>
        </CustomScroll>
    );

};


// Added by sephora-jsx-loader.js
ProductSwatchGroup.prototype.path = 'Product/ProductSwatchGroup';
// Added by sephora-jsx-loader.js
Object.assign(ProductSwatchGroup.prototype, require('./ProductSwatchGroup.c.js'));
var originalDidMount = ProductSwatchGroup.prototype.componentDidMount;
ProductSwatchGroup.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductSwatchGroup');
if (originalDidMount) originalDidMount.apply(this);
if (ProductSwatchGroup.prototype.ctrlr) ProductSwatchGroup.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductSwatchGroup');
// Added by sephora-jsx-loader.js
ProductSwatchGroup.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductSwatchGroup.prototype.class = 'ProductSwatchGroup';
// Added by sephora-jsx-loader.js
ProductSwatchGroup.prototype.getInitialState = function() {
    ProductSwatchGroup.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductSwatchGroup.prototype.render = wrapComponentRender(ProductSwatchGroup.prototype.render);
// Added by sephora-jsx-loader.js
var ProductSwatchGroupClass = React.createClass(ProductSwatchGroup.prototype);
// Added by sephora-jsx-loader.js
ProductSwatchGroupClass.prototype.classRef = ProductSwatchGroupClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductSwatchGroupClass, ProductSwatchGroup);
// Added by sephora-jsx-loader.js
module.exports = ProductSwatchGroupClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductSwatchGroup/ProductSwatchGroup.jsx