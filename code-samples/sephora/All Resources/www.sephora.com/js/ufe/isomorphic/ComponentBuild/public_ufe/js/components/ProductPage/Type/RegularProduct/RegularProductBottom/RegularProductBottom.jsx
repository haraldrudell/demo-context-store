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
    Sephora.Util.InflatorComps.Comps['RegularProductBottom'] = function RegularProductBottom(){
        return RegularProductBottomClass;
    }
}
const { space } = require('style');
const { Box, Image, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const SectionDivider = require('components/SectionDivider/SectionDivider');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');
const skuUtils = require('utils/Sku');
const AncillaryItem = require('components/ProductPage/AncillaryItem/AncillaryItem');
const ExploreThisProduct = require('components/ProductPage/ExploreThisProduct/ExploreThisProduct');
const ProductCarousel = require('components/ProductPage/ProductCarousel/ProductCarousel');
const LazyLoad = require('components/LazyLoad/LazyLoad');
const ProductQuicklook = require('components/Product/ProductQuicklook/ProductQuicklook');
const CertonaCarousel = require('components/Bcc/BccCarousel/BccCarousel');
const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const shouldServiceRun = require('utils/Services').shouldServiceRun;
const BackToTopButton = require('components/BackToTopButton/BackToTopButton');

/**
 * The bottom section of regular product page is neither sku nor user specific.  Thus it has no
 * controller and can be used "as is" from the server-side render.
 *
 * @constructor
 */
const RegularProductBottom = function () {
    this.state = this.props;
};

RegularProductBottom.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    let currentProduct = this.state.currentProduct;
    let {
        currentSku,
        isOpenCustomSets,
        content = {}
    } = currentProduct;
    let {
        regions = {}
    } = content;
    let {
        bottom = []
    } = regions;
    let items = [];
    let isBazaarVoiceEnabled = Sephora.configurationSettings.isBazaarVoiceEnabled;
    let isPpageRatingsEnabled = Sephora.configurationSettings.isPpageRatingsEnabled;
    let isRatingsEnabled = isBazaarVoiceEnabled && isPpageRatingsEnabled;
    let isCertonaEnabled = shouldServiceRun.certona();

    let createItems = function (obj) {
        let item = {};
        item.name = obj.displayName;
        item.href = obj.targetUrl;
        items.push(item);
        if (obj.parentCategory) {
            createItems(obj.parentCategory);
        }

        return items.reverse();
    };

    let useItWithItems = [];
    if (currentProduct.ancillarySkus) {
        currentProduct.ancillarySkus.forEach((item) => {
            let useWithItem = (
                <AncillaryItem {...item} />
            );
            useItWithItems.push(useWithItem);
        });
    }

    let ymalList = [];
    if (currentProduct.ymalSkus) {
        currentProduct.ymalSkus.forEach((item) => {
            ymalList.push(item);
        });
    }

    let simillarSkusList = [];
    if (currentProduct.simillarSkus) {
        currentProduct.simillarSkus.forEach((item) => {
            simillarSkusList.push(item);
        });
    }

    let recentlyViewed = [];
    if (currentProduct.recentlyViewedSkus) {
        currentProduct.recentlyViewedSkus.forEach((item) => {
            let viewedItem =
                <Box
                    position='relative'
                    href={item.targetUrl}
                    _css={!Sephora.isTouch ?
                        { '&:hover [data-ql-trigger]': { opacity: 1 } } : null}>
                    <Image
                        display='block'
                        src={item.image} />
                    {Sephora.isTouch ||
                    <Box
                        data-ql-trigger
                        position='absolute'
                        right={0} bottom={0} left={0}
                        transition='opacity .15s'
                        opacity={0}>
                        <ProductQuicklook
                            productId={item.productId}
                            skuId={item.skuId} />
                    </Box>
                    }
                </Box>;
            recentlyViewed.push(viewedItem);
        });
    }

    const certonaCarousel1 = (
        <CertonaCarousel
            carouselIndex={1}
            skuImageSize={IMAGE_SIZES[135]}
            name='Certona Carousel'
            title='Similar Products'
            isSmallTitle={true}
            showPrice={true}
            showReviews={true}
            showLoves={true}
            showMarketingFlags={false}
            showTouts={true}
            showArrows={true}
            displayCount={isMobile ? 2 : 5}
            carouselItems={!isCertonaEnabled ? simillarSkusList : null}
            componentType={COMPONENT_NAMES.CAROUSEL}
            lazyLoad='img' />
    );

    const certonaCarousel2 = (
        <CertonaCarousel
            carouselIndex={2}
            skuImageSize={IMAGE_SIZES[135]}
            name='Certona Carousel'
            title='You May Also Like'
            isSmallTitle={true}
            showPrice={true}
            showReviews={true}
            showLoves={true}
            showMarketingFlags={false}
            showTouts={true}
            showArrows={true}
            displayCount={isMobile ? 2 : 5}
            carouselItems={!isCertonaEnabled ? ymalList : null}
            componentType={COMPONENT_NAMES.CAROUSEL}
            lazyLoad='img' />
    );


    return (
        <div>
        {isMobile ?
            (!(currentSku.configurableOptions && isOpenCustomSets) &&
            (<div>
                {bottom.length > 0 &&
                    <Box
                        marginTop={space[4]}
                        marginBottom={-space[4]}>
                        <BccComponentList items={bottom} />
                    </Box>
                }
                {currentProduct.brand &&
                    skuUtils.brandShowUserGeneratedContent(currentProduct.brand.brandId) &&
                    <ExploreThisProduct {...currentProduct}/> }
                {isRatingsEnabled &&
                    <LazyLoad
                        id='ratings-reviews'
                        componentClass='RatingsAndReviews'
                        reviewsToShow='3'
                        {...currentProduct} />
                }

                {currentProduct.brand &&
                    (skuUtils.brandShowUserGeneratedContent(currentProduct.brand.brandId) &&
                    useItWithItems.length > 0) &&
                    <div>
                        <SectionDivider />
                        <Text
                            is='h2'
                            serif={true}
                            fontSize='h1'>
                            Use It With
                        </Text>
                        {useItWithItems.map(item =>
                            <div>
                                <Divider
                                    marginY={space[4]}
                                    color='lightGray' />
                                {item}
                            </div>
                        )}
                    </div>
                }
                {currentProduct.brand &&
                    (isCertonaEnabled || simillarSkusList.length > 0) &&
                    <div>
                        <SectionDivider />
                        {certonaCarousel1}
                    </div>
                }

                <SectionDivider />
                {certonaCarousel2}

                {recentlyViewed.length > 0 &&
                    <div>
                        <SectionDivider />
                        <Text
                            is='h2'
                            serif={true}
                            fontSize='h1'
                            marginBottom={space[4]}>
                            Recently Viewed
                        </Text>
                        <ProductCarousel
                            displayCount={4}
                            items={recentlyViewed} />
                    </div>
                }

                <BackToTopButton/>

            </div>))

            :

            <div>
                {bottom.length > 0 &&
                    <Box
                        marginTop={space[5]}>
                        <BccComponentList items={bottom} />
                    </Box>
                }
                {currentProduct.brand && currentProduct.brand &&
                    skuUtils.brandShowUserGeneratedContent(currentProduct.brand.brandId) &&
                    <ExploreThisProduct {...currentProduct}/> }
                {currentProduct.brand &&
                    (isCertonaEnabled || simillarSkusList.length > 0) &&
                    <div>
                        <SectionDivider />
                        {certonaCarousel1}
                    </div>
                }
                {isRatingsEnabled &&
                    <LazyLoad
                        id='ratings-reviews'
                        componentClass='RatingsAndReviews'
                        {...currentProduct} />
                }

                <SectionDivider />

                {certonaCarousel2}

                {recentlyViewed.length > 0 &&
                    <div>
                        <SectionDivider />
                        <Text
                            is='h2'
                            serif={true}
                            fontSize='h1'
                            marginBottom={space[4]}
                            textAlign='center'>
                            Recently Viewed
                        </Text>
                        <ProductCarousel
                            displayCount={10}
                            gutter={space[4]}
                            items={recentlyViewed}
                            lazyLoad='img' />
                    </div>
                }
            </div>
        }
       </div>
    );
};


// Added by sephora-jsx-loader.js
RegularProductBottom.prototype.path = 'ProductPage/Type/RegularProduct/RegularProductBottom';
// Added by sephora-jsx-loader.js
Object.assign(RegularProductBottom.prototype, require('./RegularProductBottom.c.js'));
var originalDidMount = RegularProductBottom.prototype.componentDidMount;
RegularProductBottom.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RegularProductBottom');
if (originalDidMount) originalDidMount.apply(this);
if (RegularProductBottom.prototype.ctrlr) RegularProductBottom.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RegularProductBottom');
// Added by sephora-jsx-loader.js
RegularProductBottom.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RegularProductBottom.prototype.class = 'RegularProductBottom';
// Added by sephora-jsx-loader.js
RegularProductBottom.prototype.getInitialState = function() {
    RegularProductBottom.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RegularProductBottom.prototype.render = wrapComponentRender(RegularProductBottom.prototype.render);
// Added by sephora-jsx-loader.js
var RegularProductBottomClass = React.createClass(RegularProductBottom.prototype);
// Added by sephora-jsx-loader.js
RegularProductBottomClass.prototype.classRef = RegularProductBottomClass;
// Added by sephora-jsx-loader.js
Object.assign(RegularProductBottomClass, RegularProductBottom);
// Added by sephora-jsx-loader.js
module.exports = RegularProductBottomClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/RegularProduct/RegularProductBottom/RegularProductBottom.jsx