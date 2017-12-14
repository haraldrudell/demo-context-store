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
    Sephora.Util.InflatorComps.Comps['SampleItem'] = function SampleItem(){
        return SampleItemClass;
    }
}
const space = require('style').space;
const { Box, Flex, Text } = require('components/display');
const ProductDisplayName = require('components/Product/ProductDisplayName/ProductDisplayName');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductQuicklook = require('components/Product/ProductQuicklook/ProductQuicklook');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const Tooltip = require('components/Tooltip/Tooltip');
const urlUtils = require('utils/Url');
const skuUtils = require('utils/Sku');
const anaConstants = require('analytics/constants');

const SampleItem = function () {
    this.state = {
        hover: false,
        isInBasket: false,
        isSamplesMax: false
    };
};

SampleItem.prototype.render = function () {

    const isLink = this.props.targetUrl && this.props.isLink;

    const Comp = isLink ? 'a' : 'div';

    let currentSku = Object.assign({}, this.props);

    return (
        <Flex
            is={Comp}
            flexDirection='column'
            width={1}
            textAlign='center'
            href={isLink ? urlUtils.addInternalTracking(
                currentSku.targetUrl,
                [currentSku.rootContainerName, currentSku.productId, 'product']
            ) : null}>
            <div>
                <Box
                    marginX='auto'
                    marginBottom={space[3]}
                    position='relative'
                    maxWidth={currentSku.imageSize}
                    onMouseEnter={this.toggleHover}
                    onMouseLeave={this.toggleHover}>
                    {(Sephora.isDesktop() && this.props.isToolTipEnabled) ?
                        <Tooltip
                            display='block'
                            multiline={true}
                            title={currentSku.variationValue}>
                            <ProductImage
                                skuImages={currentSku.skuImages}
                                size={currentSku.imageSize} />
                        </Tooltip>
                        :
                        <ProductImage
                            skuImages={currentSku.skuImages}
                            size={currentSku.imageSize} />
                    }
                    <Box
                        position='absolute'
                        top={Sephora.isTouch ? 0 : null}
                        right={0} bottom={0} left={0}
                        transition='opacity .15s'
                        style={{
                            opacity: this.state.hover ? 1 : 0
                        }}>
                        <ProductQuicklook
                            productId={currentSku.productId}
                            skuId={currentSku.skuId}
                            skuType={skuUtils.skuTypes.SAMPLE}
                            sku={currentSku}
                            rootContainerName={currentSku.rootContainerName}
                            buttonText='View Larger'/>
                    </Box>
                </Box>
                {(Sephora.isMobile() || this.props.isShowAddFullSize) &&
                    <ProductDisplayName
                        numberOfLines={this.props.isShowAddFullSize ? 3 : null}
                        productName={this.props.isShowAddFullSize ? currentSku.productName :
                            currentSku.variationValue}
                        brandName={this.props.isShowAddFullSize ? currentSku.brandName : null}
                        isHovered={this.state.hover && isLink} />
                }
                {this.props.isShowAddFullSize &&
                    <Box
                        fontSize='h5'
                        fontWeight={700}
                        marginTop={space[1]}
                        lineHeight={2}>
                        {currentSku.listPrice}
                    </Box>
                }
            </div>
            {/* for past purchase carousel, samples without full size sku don't display a button */}
            {(!this.props.isPastPurchaseItem || this.props.isShowAddFullSize) &&
                <Box
                    paddingTop={space[3]}
                    paddingBottom={space[1]}
                    marginTop='auto'>
                    <AddToBasketButton
                        analyticsContext={anaConstants.CONTEXT.BASKET_SAMPLES}
                        samplePanel={this.props.samplePanel}
                        quantity={1}
                        sku={this.props.isShowAddFullSize ? currentSku.fullSizeSku : currentSku}
                        type={this.state.isInBasket ?
                            ADD_BUTTON_TYPE.MUTED : ADD_BUTTON_TYPE.OUTLINE}
                        disabled={!this.props.isShowAddFullSize &&
                            !this.state.isInBasket && this.state.isSamplesMax}
                        text={this.props.isShowAddFullSize ? 'Add Full Size' :
                            !this.state.isInBasket ? 'Add' : 'Remove'} />
                </Box>
            }
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
SampleItem.prototype.path = 'Product/SampleItem';
// Added by sephora-jsx-loader.js
Object.assign(SampleItem.prototype, require('./SampleItem.c.js'));
var originalDidMount = SampleItem.prototype.componentDidMount;
SampleItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: SampleItem');
if (originalDidMount) originalDidMount.apply(this);
if (SampleItem.prototype.ctrlr) SampleItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: SampleItem');
// Added by sephora-jsx-loader.js
SampleItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
SampleItem.prototype.class = 'SampleItem';
// Added by sephora-jsx-loader.js
SampleItem.prototype.getInitialState = function() {
    SampleItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
SampleItem.prototype.render = wrapComponentRender(SampleItem.prototype.render);
// Added by sephora-jsx-loader.js
var SampleItemClass = React.createClass(SampleItem.prototype);
// Added by sephora-jsx-loader.js
SampleItemClass.prototype.classRef = SampleItemClass;
// Added by sephora-jsx-loader.js
Object.assign(SampleItemClass, SampleItem);
// Added by sephora-jsx-loader.js
module.exports = SampleItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/SampleItem/SampleItem.jsx