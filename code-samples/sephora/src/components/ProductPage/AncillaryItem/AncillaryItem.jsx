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
    Sephora.Util.InflatorComps.Comps['AncillaryItem'] = function AncillaryItem(){
        return AncillaryItemClass;
    }
}
const { space } = require('style');
const { Box, Grid, Text } = require('components/display');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const skuUtils = require('utils/Sku');
const layout = require('components/ProductPage/settings').layout;
const ProductDisplayName = require('components/Product/ProductDisplayName/ProductDisplayName');
const ProductQuicklook = require('components/Product/ProductQuicklook/ProductQuicklook');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductBadges = require('components/Product/ProductBadges/ProductBadges');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const analyticsConsts = require('analytics/constants');
const certonaDataAt = require('utils/certona').CERTONA_DATA_AT_VALUES;

const AncillaryItem = function () {
    this.state = { hover: false };
};

AncillaryItem.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    let sku = Object.assign({}, this.props, { type: skuUtils.skuTypes.STANDARD });

    return (
        <Grid
            href={sku.targetUrl}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            gutter={space[4]}>
            <Grid.Cell width='fit'>
                <Box position='relative'>
                    <ProductImage
                        skuImages={sku.skuImages}
                        size={IMAGE_SIZES[97]} />
                     <ProductBadges
                        sku={sku}
                        isSmall />
                    {(isDesktop && !Sephora.isTouch) &&
                        <Box
                            position='absolute'
                            right={0} bottom={0} left={0}
                            transition='opacity .15s'
                            style={{
                                opacity: this.state.hover ? 1 : 0
                            }}>
                            <ProductQuicklook
                                productId={sku.productId}
                                skuId={sku.skuId}
                                rootContainerName={sku.rootContainerName}/>
                        </Box>
                    }
                </Box>
            </Grid.Cell>
            <Grid.Cell width='fill'>
                <Grid gutter={space[4]}>
                    <Grid.Cell width={isDesktop ? 'fill' : null}>
                        <ProductDisplayName
                            fontSize='h4'
                            brandName={sku.brandName}
                            productName={sku.productName}
                            isHovered={this.state.hover} />
                        <SizeAndItemNumber
                            sku={sku}
                            fontSize='h5'
                            marginTop={space[2]}
                            lineHeight={2} />
                        <ProductVariation
                            sku={sku}
                            fontSize='h5'
                            marginTop={space[1]} />
                    </Grid.Cell>
                    <Grid.Cell width={isDesktop ? 'fit' : null}>
                        <Box
                            fontWeight={700}
                            lineHeight={2}
                            marginY={isMobile ? space[3] : null}
                            textAlign={!isMobile ? 'right' : null}>
                            <Text
                                textDecoration={sku.salePrice ? 'line-through' : null}>
                                {sku.listPrice}
                            </Text>
                            {sku.salePrice &&
                                <Text color='red'>
                                    {' '}
                                    {sku.salePrice}
                                </Text>
                            }
                            {sku.valuePrice &&
                                <Box fontWeight={400}>
                                    {sku.valuePrice}
                                </Box>
                            }
                        </Box>
                    </Grid.Cell>
                    <Grid.Cell width={isDesktop ? 'fit' : null}>
                        <Box width={isDesktop ? layout.ACTIONS_WIDTH : null}>
                            <AddToBasketButton
                                data-certona={certonaDataAt.addToBasket}
                                analyticsContext={analyticsConsts.CONTEXT.USE_IT_WITH}
                                block={isDesktop}
                                quantity={1}
                                sku={sku}
                                type={ADD_BUTTON_TYPE.OUTLINE}
                                disabled={skuUtils.isProductDisabled(sku)} />
                        </Box>
                    </Grid.Cell>
                </Grid>
            </Grid.Cell>
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
AncillaryItem.prototype.path = 'ProductPage/AncillaryItem';
// Added by sephora-jsx-loader.js
Object.assign(AncillaryItem.prototype, require('./AncillaryItem.c.js'));
var originalDidMount = AncillaryItem.prototype.componentDidMount;
AncillaryItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: AncillaryItem');
if (originalDidMount) originalDidMount.apply(this);
if (AncillaryItem.prototype.ctrlr) AncillaryItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: AncillaryItem');
// Added by sephora-jsx-loader.js
AncillaryItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
AncillaryItem.prototype.class = 'AncillaryItem';
// Added by sephora-jsx-loader.js
AncillaryItem.prototype.getInitialState = function() {
    AncillaryItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
AncillaryItem.prototype.render = wrapComponentRender(AncillaryItem.prototype.render);
// Added by sephora-jsx-loader.js
var AncillaryItemClass = React.createClass(AncillaryItem.prototype);
// Added by sephora-jsx-loader.js
AncillaryItemClass.prototype.classRef = AncillaryItemClass;
// Added by sephora-jsx-loader.js
Object.assign(AncillaryItemClass, AncillaryItem);
// Added by sephora-jsx-loader.js
module.exports = AncillaryItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/AncillaryItem/AncillaryItem.jsx