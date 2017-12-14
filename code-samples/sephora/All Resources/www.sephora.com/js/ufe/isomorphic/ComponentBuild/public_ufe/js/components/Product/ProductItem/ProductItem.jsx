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
    Sephora.Util.InflatorComps.Comps['ProductItem'] = function ProductItem(){
        return ProductItemClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const urlUtils = require('utils/Url');
const skuUtils = require('utils/Sku');
const LocaleUtils = require('utils/LanguageLocale');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const certonaDataAt = require('utils/certona').CERTONA_DATA_AT_VALUES;

const ProductItem = function () {
    this.state = { hover: false };
};

const ProductDisplayName = require('components/Product/ProductDisplayName/ProductDisplayName');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductLove = require('components/Product/ProductLove/ProductLove');
const ProductLoveToggle =
    require('components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle');
const ProductQuicklook = require('components/Product/ProductQuicklook/ProductQuicklook');
const StarRating = require('components/StarRating/StarRating');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ProductBadges = require('components/Product/ProductBadges/ProductBadges');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const SKU_TYPES = require('utils/Sku').skuTypes;
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;

ProductItem.prototype.render = function () {

    const { showQuickLook = true } = this.props;

    let currentSku = Object.assign({}, this.props, { type: SKU_TYPES.STANDARD });
    let isCountryRestricted = !!this.props.isCountryRestricted;

    return (
        <Flex
            flexDirection='column'
            width={1}
            textAlign='center'
            href={isCountryRestricted ? null : urlUtils.addInternalTracking(
                currentSku.targetUrl,
                [currentSku.rootContainerName, currentSku.productId, 'product']
            )}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            onClick={this.onClick}>
            <Box
                position='relative'>
                <Box
                    marginBottom={!currentSku.showMarketingFlags ?
                        space[3] : null}
                    marginX='auto'
                    position='relative'
                    maxWidth={currentSku.imageSize}>

                    <ProductImage
                        skuImages={currentSku.skuImages}
                        src={currentSku.skuImages.image}
                        size={currentSku.imageSize}
                        disableLazyLoad={currentSku.disableLazyLoad} />

                    {
                        Sephora.isDesktop() && !Sephora.isTouch && showQuickLook
                            ?
                                <Box
                                    position='absolute'
                                    right={0} bottom={0} left={0}
                                    transition='opacity .15s'
                                    style={{
                                        opacity: this.state.hover ? 1 : 0
                                    }}>
                                    <ProductQuicklook
                                        isCertonaProduct={currentSku.isCertonaProduct}
                                        productId={currentSku.productId}
                                        skuId={currentSku.skuId}
                                        rootContainerName={currentSku.rootContainerName ||
                                            this.props.rootName}/>
                                </Box>
                            :
                                null
                    }
                    {currentSku.showLoves && !Sephora.isTouch &&
                        <Box
                            position='absolute'
                            top={-space[1]} right={0}
                            transition='opacity .15s'
                            style={{
                                opacity: this.state.hover ? 1 : 0
                            }}>
                            <ProductLove
                                loveSource='productPage'
                                skuId={currentSku.skuId}>
                                <ProductLoveToggle
                                    fontSize={15}
                                    width={24}
                                    height={24} />
                            </ProductLove>
                        </Box>
                    }
                </Box>

                <ProductBadges
                    left='8%'
                    isSmall={true}
                    sku={currentSku} />

                {currentSku.showMarketingFlags &&
                    <Flex
                        justifyContent='center'
                        alignItems='center'
                        fontWeight={700}
                        fontSize='h6'
                        textTransform='lowercase'
                        height={space[5]}
                        whiteSpace='nowrap'
                        data-at={Sephora.debug.dataAt('sku_item_flags')}>
                        {
                            this.props.isLimitedEdition ? 'Limited Edition' :
                            this.props.isSephoraExclusive ? 'Exclusive' :
                            this.props.isOnlineOnly ? 'Online Only' : null
                        }
                    </Flex>
                }

                {currentSku.displayNumber &&
                    <Box
                        fontSize='h00'
                        fontWeight={300}
                        lineHeight={1}
                        marginBottom={space[2]}
                        data-at={Sephora.debug.dataAt('product_num')}>
                        {currentSku.displayNumber}.
                    </Box>
                }

                <ProductDisplayName
                    numberOfLines={4}
                    brandName={currentSku.brandName}
                    productName={currentSku.productName}
                    isHovered={this.state.hover} />

                {currentSku.showPrice &&
                    <Box
                        fontSize='h5'
                        fontWeight={700}
                        marginTop={space[1]}
                        lineHeight={2}>
                        <Text
                            data-at={Sephora.debug.dataAt('sku_item_price_list')}
                            textDecoration={currentSku.salePrice ? 'line-through' : null}>
                            {currentSku.listPrice}
                        </Text>
                        {currentSku.salePrice &&
                            <Text
                                color='red'
                                data-at={Sephora.debug.dataAt('sku_item_price_sale')}>
                                {' '}
                                {currentSku.salePrice}
                            </Text>
                        }
                        {currentSku.valuePrice &&
                            <Text
                                fontWeight={400}
                                data-at={Sephora.debug.dataAt('sku_item_price_value')}>
                                {' '}
                                {currentSku.valuePrice}
                            </Text>
                        }
                    </Box>
                }

                {currentSku.moreColors &&
                    <Box
                        color='gray'
                        fontSize='h6'
                        marginTop={space[2]}>
                        {currentSku.moreColors} more color{currentSku.moreColors > 1 ?
                        's' : ''}
                    </Box>
                }

                {currentSku.showReviews &&
                    <Box marginTop={space[2]}>
                        <StarRating
                            rating={currentSku.starRatings}
                            marginX='auto' />
                    </Box>
                }

            </Box>

            {(currentSku.isUseAddToBasket || currentSku.isUseWriteReview) &&
                <Box
                    paddingTop={space[3]}
                    paddingBottom={space[1]}
                    marginTop='auto'>
                    {currentSku.isUseAddToBasket ?
                        isCountryRestricted ?
                        <Text
                            is='p'
                            fontSize='h5'
                            color='gray'
                            lineHeight={2}>
                            This item cannot be shipped to
                            {
                                LocaleUtils.isCanada() ?
                                ' Canada' :
                                ' the United States'
                            }
                        </Text>
                        :
                        <AddToBasketButton
                            data-certona={certonaDataAt.addToBasket}
                            analyticsContext={this.props.analyticsContext}
                            quantity={1}
                            sku={currentSku}
                            type={ADD_BUTTON_TYPE.OUTLINE}
                            disabled={skuUtils.isProductDisabled(currentSku)}
                            text={this.props.buttonText}
                            size={Sephora.isMobile() ||
                                currentSku.imageSize === IMAGE_SIZES[97] ? 'sm' : null} />
                    :
                        <ButtonPrimary
                            size='sm'
                            href={currentSku.targetUrl}>
                            Write A Review
                        </ButtonPrimary>
                    }
                </Box>
            }

        </Flex>
    );
};


// Added by sephora-jsx-loader.js
ProductItem.prototype.path = 'Product/ProductItem';
// Added by sephora-jsx-loader.js
Object.assign(ProductItem.prototype, require('./ProductItem.c.js'));
var originalDidMount = ProductItem.prototype.componentDidMount;
ProductItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductItem');
if (originalDidMount) originalDidMount.apply(this);
if (ProductItem.prototype.ctrlr) ProductItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductItem');
// Added by sephora-jsx-loader.js
ProductItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductItem.prototype.class = 'ProductItem';
// Added by sephora-jsx-loader.js
ProductItem.prototype.getInitialState = function() {
    ProductItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductItem.prototype.render = wrapComponentRender(ProductItem.prototype.render);
// Added by sephora-jsx-loader.js
var ProductItemClass = React.createClass(ProductItem.prototype);
// Added by sephora-jsx-loader.js
ProductItemClass.prototype.classRef = ProductItemClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductItemClass, ProductItem);
// Added by sephora-jsx-loader.js
module.exports = ProductItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Product/ProductItem/ProductItem.jsx