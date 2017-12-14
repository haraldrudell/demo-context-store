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
    Sephora.Util.InflatorComps.Comps['ProductSwatchItem'] = function ProductSwatchItem(){
        return ProductSwatchItemClass;
    }
}
const {
    borderRadius, colors, fontSizes, lineHeights, swatch, space
} = require('style');
const { Box, Flex, Grid, Image } = require('components/display');
const skuUtils = require('utils/Sku');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const uiUtils = require('utils/UI');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;

const FRAGRANCE_SWATCH_SIZE = IMAGE_SIZES[42];

var ProductSwatchItem = function () {};

ProductSwatchItem.prototype.render = function () {

    let {
        product,
        sku,
        activeSku,
        colorIqSku,
        size,
        showSaleBadge,
        useFragranceSwatch
    } = this.props;
    activeSku = activeSku || {};

    const isNotImageSwatch = product.skuSelectorType !== skuUtils.skuSwatchType.IMAGE;
    const isFragranceSwatch =
        useFragranceSwatch && skuUtils.isFragrance(product, sku) && Sephora.isDesktop();

    const styles = {
        swatch: {
            position: 'relative',
            padding: isFragranceSwatch ? 7 : swatch.PADDING,
            borderWidth: isFragranceSwatch ? 1 : swatch.BORDER_WIDTH,
            borderStyle: 'solid',
            borderRadius: 7
        },
        swatchActive: sku.skuId === activeSku.skuId ? {
            cursor: 'default',
            borderColor: colors.black,
            padding: isFragranceSwatch ? 6 : null,
            borderWidth: isFragranceSwatch ? 2 : null
        } : {
            cursor: 'pointer',
            borderColor: isFragranceSwatch ? colors.moonGray : 'transparent',
            ':hover': !Sephora.isTouch ? {
                borderColor: colors.silver
            } : {}
        }
    };
    return (
        <Box
            display='inline-block'
            position='relative'
            height={isFragranceSwatch ? null :
                size.fullSize ? size.fullSize : '100%'}
            _css={isFragranceSwatch ? {
                width: 1 / 3 * 100 + '%',
                padding: `0 ${space[1]}px ${space[2]}px`
            } : null}>
            <Box
                _css={[styles.swatch, styles.swatchActive]}
                onClick={() => {
                    this.props.handleSkuOnClick(sku);
                }}
                onMouseEnter={() => this.props.handleSkuOnMouseEnter(sku)}
                onMouseLeave={() => this.props.handleSkuOnMouseLeave()}
                width={isFragranceSwatch ? '100%' : null}>

                {this.getProductSwatch(product.skuSelectorType, sku, size, showSaleBadge)}

                {sku.isOutOfStock &&
                    <Box
                        rounded={true}
                        position='absolute'
                        top={0}
                        right={0}
                        bottom={0}
                        left={isFragranceSwatch ? 8 : 0}
                        margin={isFragranceSwatch ? null : swatch.PADDING}
                        width={isFragranceSwatch ? FRAGRANCE_SWATCH_SIZE : null}
                        backgroundImage={isNotImageSwatch
                            ? 'url(/img/ufe/swatch-oos-36x72.png)'
                            : `url(/img/ufe/swatch-oos-${size.height}x${size.width}.png)`}
                        backgroundPosition='50%'
                        backgroundRepeat='no-repeat'
                        backgroundSize={isNotImageSwatch ? '100% 100%' : 'contain'} />
                }
                {colorIqSku === sku &&
                    <Box
                        lineHeight={1}
                        fontSize={9}
                        position='absolute'
                        top='50%' left='50%'
                        transform='translate(-50%, -50%)'>
                        COLOR
                        <Box
                            fontWeight={700}
                            letterSpacing={1}>
                            IQ
                        </Box>
                    </Box>
                }
            </Box>
            {(sku.salePrice && showSaleBadge) &&
                <Flex
                    height={swatch.SALE_BADGE_HEIGHT}
                    fontSize='h6'
                    alignItems='center'
                    justifyContent='center'
                    position='absolute'
                    bottom={0}
                    left='50%'
                    transform='translate(-50%,0)'
                    fontWeight={700}
                    paddingX={2}
                    backgroundColor='red'
                    color='white'
                    rounded={2}>
                    SALE
                </Flex>
            }
        </Box>
    );
};

ProductSwatchItem.prototype.getProductSwatch = function (skuType, sku, size, showSale) {
    let {
        product,
        useFragranceSwatch,
        disableLazyLoad = false
    } = this.props;
    const isFragranceSwatch =
        useFragranceSwatch && skuUtils.isFragrance(product, sku) && Sephora.isDesktop();
    switch (skuType) {
        case skuUtils.skuSwatchType.TEXT:
        case skuUtils.skuSwatchType.SIZE:
            return <Box
                rounded={true}
                paddingX={swatch.TEXT_PADDING_HORZ}
                paddingY={swatch.TEXT_PADDING_VERT}
                lineHeight={1}
                textAlign='center'
                whiteSpace='nowrap'
                border={swatch.TEXT_BORDER_WIDTH}
                fontSize={swatch.FONT_SIZE}
                borderColor='moonGray'>
                {skuType === skuUtils.skuSwatchType.TEXT ? sku.swatchText : sku.size}
            </Box>;
        case skuUtils.skuSwatchType.IMAGE:
            return isFragranceSwatch ?
                <Grid
                    alignItems='center'
                    gutter={space[2]}>
                    <Grid.Cell
                        width='fit'>
                        <ProductImage
                            skuImages={sku.skuImages}
                            size={FRAGRANCE_SWATCH_SIZE}
                            disableLazyLoad={disableLazyLoad} />
                    </Grid.Cell>
                    <Grid.Cell
                        width='fill'
                        textTransform='uppercase'
                        overflow='hidden'
                        fontSize='h6'
                        lineHeight={2}
                        maxHeight={lineHeights[2] * fontSizes.h6 * 3}
                        _css={uiUtils.isSupportsLineClamp() ? {
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            textOverflow: 'ellipsis'
                        } : null}>
                        {sku.variationValue}
                    </Grid.Cell>
                </Grid>
                :
                <div>
                    {this.props.showColorMatchBadge && 
                        this.props.showColorMatchBadge.skuId === sku.skuId &&
                            <Box
                                fontSize={10}
                                fontWeight={700}
                                letterSpacing='-.4px'
                                position='absolute'
                                top='50%' left='50%'
                                transform='translate(-50%, -50%)'
                                _css={{
                                    textShadow: `0 0 4px ${colors.white}`
                                }}>
                                MATCH
                            </Box>
                    }
                    <Image
                        rounded={true}
                        display='block'
                        width={size.width}
                        height={size.height}
                        src={sku.smallImage}
                        disableLazyLoad={disableLazyLoad}/>
                </div>;

        default:
            return null;
    }
};


// Added by sephora-jsx-loader.js
ProductSwatchItem.prototype.path = 'Product/ProductSwatchItem';
// Added by sephora-jsx-loader.js
Object.assign(ProductSwatchItem.prototype, require('./ProductSwatchItem.c.js'));
var originalDidMount = ProductSwatchItem.prototype.componentDidMount;
ProductSwatchItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductSwatchItem');
if (originalDidMount) originalDidMount.apply(this);
if (ProductSwatchItem.prototype.ctrlr) ProductSwatchItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductSwatchItem');
// Added by sephora-jsx-loader.js
ProductSwatchItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductSwatchItem.prototype.class = 'ProductSwatchItem';
// Added by sephora-jsx-loader.js
ProductSwatchItem.prototype.getInitialState = function() {
    ProductSwatchItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductSwatchItem.prototype.render = wrapComponentRender(ProductSwatchItem.prototype.render);
// Added by sephora-jsx-loader.js
var ProductSwatchItemClass = React.createClass(ProductSwatchItem.prototype);
// Added by sephora-jsx-loader.js
ProductSwatchItemClass.prototype.classRef = ProductSwatchItemClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductSwatchItemClass, ProductSwatchItem);
// Added by sephora-jsx-loader.js
module.exports = ProductSwatchItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductSwatchItem/ProductSwatchItem.jsx