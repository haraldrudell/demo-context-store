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
    Sephora.Util.InflatorComps.Comps['RegularProductTop'] = function RegularProductTop(){
        return RegularProductTopClass;
    }
}
const { site, space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const SkuQuantity = require('components/Product/SkuQuantity/SkuQuantity');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');

const skuUtils = require('utils/Sku');
const UrlUtils = require('utils/Url');
const layout = require('components/ProductPage/settings').layout;
const AncillaryItem = require('components/ProductPage/AncillaryItem/AncillaryItem');
const HeroMediaList = require('components/ProductPage/HeroMediaList/HeroMediaList');
const ProductBadges = require('components/Product/ProductBadges/ProductBadges');
const Swatches = require('components/ProductPage/Swatches/Swatches');
const Price = require('components/ProductPage/Price/Price');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const CallToActions = require('components/ProductPage/CallToActions/CallToActions');
const RatingsSummary = require('components/ProductPage/RatingsAndReviews/RatingsSummary/RatingsSummary');
const Info = require('components/ProductPage/Info/Info');
const FindInStore = require('components/ProductPage/FindInStore/FindInStore');
const CustomSets = require('components/ProductPage/CustomSets/CustomSets');
const ProductLove = require('components/Product/ProductLove/ProductLove');
const MarketingFlags = require('components/Product/MarketingFlags/MarketingFlags');
const ProductLoveToggle =
    require('components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle');
const ProductLovesCount = require('components/Product/ProductLovesCount/ProductLovesCount');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const DisplayName = require('components/ProductPage/DisplayName/DisplayName');
const BreadCrumbs = require('components/BreadCrumbs/BreadCrumbs');
const ColorIQ = require('components/ProductPage/ColorIQ/ColorIQ');
const AddFlash = require('components/ProductPage/AddFlash/AddFlash');
const TokyWoky = require('components/TokyWoky/TokyWoky');
const CHANEL = 'CHANEL';
const SHIPPING_MESSAGES = {
    FREE: 'free shipping',
    SPEND: 'spend $50 for free shipping',
    EMPTY: '&nbsp;'
};


/**
 * The top section of regular product page is both sku and user specific.  It will be updated as
 * quickly as possible (asyncRender = Immediate) for re-rendering with the sku-specific data
 *
 * @constructor
 */
const RegularProductTop = function () {
    this.state = {
        isSkuReady: false,
        targetResolved: false,
        addFlashOnPdpContent: null,
        ...this.props
    };
};

/**
 * The default free shipping message used for anonymous users with nothing in basket (and thus
 * for whom no user-specific data was requested from api
 */
let getDefaultFreeShippingMessage = function(sku) {
    let skuPrice = skuUtils.parsePrice(sku.salePrice ? sku.salePrice : sku.listPrice);

    if (skuPrice >= skuUtils.MINIMUM_PRICE_FOR_FREE_SHIPPING) {
        return SHIPPING_MESSAGES.FREE;
    } else {
        return SHIPPING_MESSAGES.SPEND;
    }
};

RegularProductTop.prototype.render = function () {
    let currentProduct = this.state.currentProduct;
    let isOpenCustomSets = this.state.isOpenCustomSets;
    let searchKeyword = UrlUtils.getParamsByName('keyword');
    let {
        currentSku,
        content = {},
        productBanner
    } = currentProduct;
    let { regions = {} } = content;
    let {
        bottom = [],
        left = []
    } = regions;


    if (skuUtils.isSample(currentSku)) {
        currentSku.freeShippingMessage = SHIPPING_MESSAGES.FREE;
    } else if (!currentProduct.isUserSpecificReady) {
        currentSku.freeShippingMessage = SHIPPING_MESSAGES.EMPTY;
    } else if (currentProduct.usingDefaultUserSpecificData) {
        currentSku.freeShippingMessage = getDefaultFreeShippingMessage(currentSku);
    }

    let categoryBreadCrumbItems = [];
    let items = [];

    let createItems = function (obj) {
        let item = {};
        item.name = obj.displayName;
        item.href = obj.targetUrl;
        items.push(item);
        if (obj.parentCategory) {
            createItems(obj.parentCategory);
        }

        return items;
    };

    if (currentProduct.parentCategory) {
        categoryBreadCrumbItems = createItems(currentProduct.parentCategory);
        categoryBreadCrumbItems = categoryBreadCrumbItems.reverse();
    }

    let useItWithItems = [];
    if (currentProduct.ancillarySkus) {
        currentProduct.ancillarySkus.forEach((item) => {
            let useWithItem = (
                <AncillaryItem {...item} />
            );
            useItWithItems.push(useWithItem);
        });
    }

    let colorIQMatchSku = skuUtils.getColorIQMatchSku(currentProduct.regularChildSkus);
    let showColorIQOnPPage =
        skuUtils.showColorIQOnPPage(currentProduct) ?
            colorIQMatchSku
            :
            false;

    return (
        <Box className={ !this.state.isSkuReady ? 'isDefault' : null } >
            { Sephora.isMobile() ?
                (currentSku.configurableOptions && isOpenCustomSets ?
                    <CustomSets {...currentProduct} /> :
                    <div>
                        {productBanner && productBanner.length &&
                            <Box
                                borderBottom={1}
                                borderColor='lightGray'>
                                <BccComponentList
                                    items={productBanner}
                                    disableLazyLoadCount={productBanner.length}/>
                            </Box>
                        }
                        <Box textAlign='center'>
                            <Text
                                is='p'
                                textTransform='uppercase'
                                display={currentSku.isOutOfStock ||
                                    !currentSku.freeShippingMessage ? 'none' : null}
                                fontSize='h5'
                                fontWeight={700}
                                paddingY={space[2]}
                                marginX={-space[4]}
                                paddingX={space[4]}
                                marginBottom={space[4]}
                                lineHeight={2}
                                borderBottom={1}
                                borderColor='lightGray'
                                dangerouslySetInnerHTML=
                                    {{ __html: currentSku.freeShippingMessage }} />
                            <Box marginY={space[4]}>
                                <DisplayName {...currentProduct} />
                                <MarketingFlags
                                    marginTop={space[2]}
                                    sku={currentSku} />
                            </Box>
                            <Box
                                position='relative'
                                marginBottom={space[4]}>
                                <HeroMediaList
                                    product={currentProduct}
                                    showOverlayVideoOnMobile={false}
                                    virtualArtist={this.state.virtualArtist}
                                    />

                                <ProductBadges
                                    left={-site.PADDING_MW}
                                    sku={currentSku} />

                                { !skuUtils.isSample(currentSku) && <Box
                                        position='absolute'
                                        bottom={-7} left={0}>
                                        <ProductLove
                                            loveSource='productPage'
                                            skuId={currentSku.skuId}>
                                            <ProductLoveToggle
                                                fontSize={22}/>
                                        </ProductLove>
                                    </Box>
                                }
                            </Box>
                            <Price {...currentProduct} />
                            <ProductVariation
                                product={currentProduct}
                                sku={currentSku}
                                textAlign='center' />
                            {showColorIQOnPPage &&
                                <ColorIQ sku={currentSku} product={currentProduct} />
                            }
                            <SizeAndItemNumber
                                sku={currentSku}
                                fontSize='h5'
                                marginTop={space[1]} />

                        </Box>

                        <Swatches {...currentProduct}
                            showColorMatch={showColorIQOnPPage} />
                        {this.state.pPageOffersReceived && <AddFlash />
                        }
                        <Box
                            marginTop={space[4]}>
                            <RatingsSummary {...currentProduct}/>
                            <Info {...currentProduct}/>
                            { !skuUtils.isSample(currentSku) &&
                                <FindInStore {...currentProduct} /> }
                            <CallToActions {...currentProduct} />
                        </Box>
                    </div>)

                :
                <div>
                    {searchKeyword &&
                        <div>
                            <Text
                                is='h3'
                                fontSize='h3'
                                paddingY={space[3]}>
                                <b>“{searchKeyword}”</b> — 1 result
                            </Text>
                            <Divider />
                        </div>
                    }
                    <BreadCrumbs items={categoryBreadCrumbItems}/>
                    {left.length > 0 &&
                        <Box
                            marginBottom={space[6]}>
                            <BccComponentList
                                items={left}
                                disableLazyLoadCount={left.length} />
                        </Box>
                    }
                    <Grid
                        justifyContent='space-between'>
                        <Grid.Cell
                            position='relative'
                            width={layout.SIDEBAR_WIDTH}>
                            <HeroMediaList
                                product={currentProduct}
                                virtualArtist={this.state.virtualArtist} />
                            <ProductBadges
                                sku={currentProduct.hoveredSku || currentSku} />
                        </Grid.Cell>
                        <Grid.Cell width={layout.MAIN_WIDTH}>
                            <Grid
                                gutter={space[3]}
                                marginBottom={space[3]}>
                                <Grid.Cell width='fill'>
                                    <DisplayName {...currentProduct} />
                                    <SizeAndItemNumber
                                        sku={currentProduct.hoveredSku || currentSku}
                                        fontSize='h5'
                                        marginTop={space[1]}
                                        marginBottom={space[3]} />
                                    <Box
                                        fontSize='h5'
                                        fontWeight={700}
                                        lineHeight={1}>
                                        {currentProduct.isHideSocial ||
                                        <Box display='inline-block'>
                                            <RatingsSummary {...currentProduct}/>
                                        </Box>
                                        }
                                        {(!skuUtils.isGiftCard(currentSku) &&
                                        !currentProduct.isHideSocial) &&
                                        <Box
                                            display='inline-block'
                                            height='1.125em'
                                            verticalAlign='text-bottom'
                                            marginX={space[3]}
                                            borderLeft={1}
                                            borderColor='moonGray'/>
                                        }
                                        {skuUtils.isGiftCard(currentSku) ||
                                        <ProductLovesCount
                                            product={currentProduct}
                                            dataAt='product_love_count'/>
                                        }
                                    </Box>
                                    <MarketingFlags
                                        marginTop={space[2]}
                                        sku={currentProduct.hoveredSku || currentSku} />
                                </Grid.Cell>
                                <Grid.Cell
                                    width={124}>
                                    <Price {...currentProduct} />
                                    {(currentSku.freeShippingMessage &&
                                      !currentSku.isOutOfStock) &&
                                        <Text
                                            is='p'
                                            textTransform='uppercase'
                                            fontSize='h5'
                                            fontWeight={700}
                                            lineHeight={2}
                                            marginTop={space[2]}
                                            dangerouslySetInnerHTML=
                                                {{ __html: currentSku.freeShippingMessage }} />
                                    }
                                </Grid.Cell>
                                <Grid.Cell
                                    width={238}>
                                    {this.state.pPageOffersReceived && <AddFlash />
                                    }
                                    <Grid
                                        gutter={space[3]}>
                                        <Grid.Cell
                                            width='fit'>
                                            <SkuQuantity
                                                name='Product page'
                                                currentSku={currentSku}
                                                skuQuantity={currentProduct.currentSkuQuantity || 1}
                                                hideLabel={true}
                                                handleSkuQuantity={this.handleSkuQuantity}
                                                disabled={
                                                    skuUtils.isProductDisabled(currentSku) ||
                                                    skuUtils.isGiftCard(currentSku) ||
                                                    skuUtils.isSample(currentSku)
                                                }/>
                                        </Grid.Cell>
                                        <Grid.Cell
                                            width='fill'>
                                            <CallToActions
                                                {...currentProduct}
                                                addCustomSets={() => {
                                                    this.customSets.addToBasket();
                                                }}/>
                                            { !skuUtils.isSample(currentSku) && <Box
                                                marginTop={space[5]}>
                                                <FindInStore {...currentProduct} />
                                             </Box>
                                            }
                                        </Grid.Cell>
                                    </Grid>
                                </Grid.Cell>
                            </Grid>
                            { currentSku.configurableOptions ?
                                <Box
                                    borderTop={1}
                                    borderBottom={1}
                                    borderColor='lightGray'>
                                    <CustomSets
                                        {...currentProduct}
                                        ref={customSets => this.customSets = customSets}/>
                                </Box>
                                :
                                <div>
                                    <ProductVariation
                                        hasMinHeight={true}
                                        product={currentProduct}
                                        sku={currentProduct.hoveredSku || currentSku} />
                                    {showColorIQOnPPage &&
                                        <ColorIQ sku={currentSku} product={currentProduct} />
                                    }
                                    <Swatches
                                        {...currentProduct}
                                        showColorMatch={showColorIQOnPPage} />
                                </div>
                            }
                            {productBanner && productBanner.length &&
                                <Box
                                    marginTop={space[6]}>
                                    <BccComponentList
                                    items={productBanner}
                                    disableLazyLoadCount={productBanner.length}/>
                                </Box>
                            }
                            {useItWithItems.length > 0 &&
                            <Box
                                borderTop={1}
                                borderColor='lightGray'
                                paddingTop={space[4]}
                                marginTop={space[6]}>
                                <Text
                                    is='h3'
                                    fontSize='h3'
                                    fontWeight={700}
                                    marginBottom={space[4]}>
                                    Use It With
                                </Text>
                                {useItWithItems.map(item =>
                                    <div>
                                        {item}
                                        <Divider
                                            marginY={space[4]}
                                            color='lightGray'/>
                                    </div>
                                )}
                            </Box>
                            }
                            <Box
                                marginTop={space[6]}>
                                <Info {...currentProduct} />
                            </Box>
                        </Grid.Cell>
                    </Grid>
                </div>
            }
            {!(currentProduct.brand && currentProduct.brand.displayName === CHANEL) &&
            <TokyWoky targetResolved={this.state.targetResolved}
                      targetResults={this.state.targetResults} />
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
RegularProductTop.prototype.path = 'ProductPage/Type/RegularProduct/RegularProductTop';
// Added by sephora-jsx-loader.js
Object.assign(RegularProductTop.prototype, require('./RegularProductTop.c.js'));
var originalDidMount = RegularProductTop.prototype.componentDidMount;
RegularProductTop.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RegularProductTop');
if (originalDidMount) originalDidMount.apply(this);
if (RegularProductTop.prototype.ctrlr) RegularProductTop.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RegularProductTop');
// Added by sephora-jsx-loader.js
RegularProductTop.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RegularProductTop.prototype.class = 'RegularProductTop';
// Added by sephora-jsx-loader.js
RegularProductTop.prototype.getInitialState = function() {
    RegularProductTop.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RegularProductTop.prototype.render = wrapComponentRender(RegularProductTop.prototype.render);
// Added by sephora-jsx-loader.js
var RegularProductTopClass = React.createClass(RegularProductTop.prototype);
// Added by sephora-jsx-loader.js
RegularProductTopClass.prototype.classRef = RegularProductTopClass;
// Added by sephora-jsx-loader.js
Object.assign(RegularProductTopClass, RegularProductTop);
// Added by sephora-jsx-loader.js
module.exports = RegularProductTopClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/RegularProduct/RegularProductTop/RegularProductTop.jsx