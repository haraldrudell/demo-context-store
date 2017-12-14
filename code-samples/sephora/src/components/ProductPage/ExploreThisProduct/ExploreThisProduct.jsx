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
    Sephora.Util.InflatorComps.Comps['ExploreThisProduct'] = function ExploreThisProduct(){
        return ExploreThisProductClass;
    }
}
const { fontSizes, lineHeights, site, space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const Divider = require('components/Divider/Divider');
const SectionDivider = require('components/SectionDivider/SectionDivider');
const Chevron = require('components/Chevron/Chevron');
const Carousel = require('components/Carousel/Carousel');
const BccLink = require('components/Bcc/BccLink/BccLink');
const UrlUtils = require('utils/Url');
const IconInfo = require('components/Icon/IconInfo');
const IconPlay = require('components/Icon/IconPlay');
const Popover = require('components/Popover/Popover');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const GalleryFilters = require('components/ProductPage/ExploreThisProduct/GalleryFilters/GalleryFilters');
const BccVideo = require('components/Bcc/BccVideo/BccVideo');
const EmptyGalleryFilterResults =
    require('components/ProductPage/ExploreThisProduct/EmptyGalleryFilterResults/EmptyGalleryFilterResults');
const BeautyMatchCheckbox =
    require('components/ProductPage/BeautyMatchCheckbox/BeautyMatchCheckbox');
const Ellipsis = require('components/Ellipsis/Ellipsis');
const ProductActions = require('actions/ProductActions');
const Filters = require('utils/Filters');
const analyticsConsts = require('analytics/constants');
const ARTICLES_SECTION_WIDTH = 384;
const BRANDS_WITHOUT_LOOKS = {
    CHANEL: '1065'
};
const SKU_TYPES_WITHOUT_LOOKS = [
    'sample',
    'gwp',
    'msg'
];

const ExploreThisProduct = function () {
    this.state = {
        media: [],
        searchParams: {},
        showMediaItems: 0,
        total: 0,
        mediaPage: 0,
        videos: [],
        videoPage: 0,
        productArticles: [],
        totalVideos: 0,
        filtered: false
    };
};

ExploreThisProduct.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    let isPpageBeautyBoardEnabled = Sephora.configurationSettings.isPpageBeautyBoardEnabled;
    if (isMobile && !isPpageBeautyBoardEnabled) {
        return null;
    }

    const currentProduct = this.props;
    let {
        productArticles = []
    } = currentProduct;

    let {
        media,
        showMediaItems,
        total,
        videoPage,
        videos,
        filtered
    } = this.state;

    if ( !(videos.length || media.length || productArticles.length || filtered) ) {
        return null;
    }

    let articlesCount = Math.min(productArticles.length, 18);
    productArticles = productArticles.slice(0, articlesCount);

    const descLineHeight = lineHeights[2];

    return (
        <div>
            <SectionDivider />
            <Text
                is='h2'
                fontSize='h1'
                lineHeight={1}
                serif={true}
                textAlign={isMobile ? 'left' : 'center'}
                marginBottom={isDesktop ? space[5] : null}>
                Explore This Product
            </Text>
            {isMobile &&
                <Divider
                    color='lightGray'
                    marginY={space[4]} />
            }
            {
                this.shouldShowLooks(isPpageBeautyBoardEnabled, isDesktop) ?
                <Box
                    marginBottom={isMobile ? space[5] : space[6]}>
                    <Grid
                        alignItems='center'
                        gutter={isDesktop ? space[5] : null}
                        marginBottom={space[4]}>
                        <Grid.Cell
                            width='fit'>
                            <Text
                                is='h3'
                                fontSize='h3'
                                fontWeight={700}
                                lineHeight={2}>
                                Looks
                                {total ? ' (' + total + ')' : ''}
                            </Text>
                        </Grid.Cell>
                        <Grid.Cell
                            width={isDesktop ? 'fit' : null}
                            order={isMobile ? 'last' : null}
                            marginTop={isMobile ? space[3] : null}>
                            <BeautyMatchCheckbox
                                name={Filters.BEAUTY_MATCH_CHECKBOX_TYPES.GALLERY}
                                label='Show looks'
                                onSelect={this.applyBeautyMatchFilters}
                                updateOnAction={ProductActions.TYPES.RESET_GALLERY_FILTERS}/>
                        </Grid.Cell>
                        <Grid.Cell
                            width='fit'
                            marginLeft='auto'>
                            <GalleryFilters
                            {...currentProduct} />
                        </Grid.Cell>
                    </Grid>
                    {
                        media.length ?
                            <Carousel
                                gutter={isMobile ? space[4] : space[5]}
                                displayCount={isMobile ? 2 : 5}
                                totalItems={showMediaItems}
                                onLastItemVisible={this.pullNextBeautyBoardMediaPage}
                                preventScrollReset={!filtered}
                                showArrows={isDesktop}
                                showTouts={true}>
                                {
                                    media.slice(0, showMediaItems).map((medium, index) =>
                                        <Box
                                            width='100%'
                                            onClick={(e) =>
                                                this.openBeautyBoardMedium(medium, index+1)}
                                            position='relative'
                                            paddingBottom='100%'
                                            _css={Sephora.isTouch || {
                                                transition: 'opacity .2s',
                                                ':hover': {
                                                    opacity: 0.5
                                                }
                                            }}
                                            backgroundPosition='center'
                                            backgroundSize='cover'
                                            style={medium.url ? {
                                                backgroundImage: `url(${medium.url.normal})`
                                            } : null}>
                                            {!medium.lastItem && medium.isVideo() &&
                                                <IconPlay
                                                    color='white'
                                                    width='30%' height='30%'
                                                    position='absolute'
                                                    top='35%' left='35%' />
                                            }
                                            {medium.lastItem &&
                                                <Flex
                                                    position='absolute'
                                                    width='100%' height='100%'
                                                    alignItems='center'
                                                    justifyContent='center'
                                                    border={1}
                                                    borderColor='moonGray'>
                                                    <Box
                                                        fontSize='h3'
                                                        lineHeight={2}
                                                        fontWeight={700}
                                                        textAlign='center'
                                                        paddingX={space[4]}>
                                                        See more looks in the Gallery
                                                        {' '}
                                                        <Chevron
                                                            direction='right' />
                                                    </Box>
                                                </Flex>
                                            }
                                        </Box>
                                    )
                                }
                            </Carousel> : <EmptyGalleryFilterResults/>
                    }
                </Box> : null
            }
            {(videos.length || productArticles.length) ?
                <Grid
                    justifyContent='space-between'>
                    {videos.length ?
                        <Grid.Cell
                            width={isDesktop
                                ? site.WIDTH - space[7] - ARTICLES_SECTION_WIDTH
                                : null
                            }>
                            <Text
                                is='h3'
                                fontSize='h3'
                                marginBottom={space[4]}
                                fontWeight={700}
                                lineHeight={2}>
                                Videos {`(${videos.length})`}
                            </Text>
                            <Carousel
                                gutter={space[4]}
                                displayCount={isMobile ? 1 : 2}
                                totalItems={videos.length}
                                preventScrollReset={true}
                                showArrows={isDesktop}
                                showTouts={true}
                                controlStyles={{
                                    height: 'auto',
                                    bottom: (fontSizes.h4 * descLineHeight * 2) + space[2]
                                }}>
                                {
                                    videos.map(video =>
                                        <Box
                                            key={video.embed_code}>
                                            <BccVideo
                                                ooyalaId={video.embed_code}
                                                name={video.name}
                                                videoTitle={video.name}
                                                hideDescription={true}
                                                thumbnailRatio={9 / 16}
                                                overlayFlag={isDesktop}
                                                nested={true}
                                                startImagePath={video.preview_image_url_ssl}/>
                                            <Ellipsis
                                                isFixedHeight={isDesktop}
                                                lineHeight={descLineHeight}
                                                marginTop={space[2]}
                                                numberOfLines={isMobile ? 1 : 2}
                                                htmlContent={video.name} />
                                        </Box>
                                    )
                                }
                            </Carousel>
                        </Grid.Cell> : null
                    }
                    {productArticles.length ?
                        <Grid.Cell
                            marginTop={isMobile ? space[5] : null}
                            width={isDesktop ? ARTICLES_SECTION_WIDTH : null}>
                            <Text
                                is='h3'
                                fontSize='h3'
                                marginBottom={space[4]}
                                fontWeight={700}
                                lineHeight={2}>
                                Articles {`(${articlesCount})`}
                            </Text>
                            <Carousel
                                gutter={isMobile ? space[4] : space[5]}
                                displayCount={2}
                                totalItems={articlesCount}
                                preventScrollReset={true}
                                showArrows={isDesktop}
                                showTouts={true}
                                controlStyles={{
                                    height: 'auto',
                                    bottom: (fontSizes.h4 * descLineHeight * 2) + space[2]
                                }}>
                                {productArticles.map((article, index) => {
                                    let {
                                        links = []
                                    } = article;
                                    if (!links.length) {
                                        return null;
                                    }
                                    return (
                                        <BccLink
                                            key={article.name + index}
                                            url={UrlUtils.getLink(UrlUtils.getImagePath(links[0].
                                                targetScreen.targetUrl))}
                                            target={links[0].targetScreen.targetWindow}>
                                            <Box
                                                backgroundPosition='center'
                                                backgroundSize='cover'
                                                /* Odd percentage to match video thumb height */
                                                paddingBottom={isMobile ? '100%' : '88.94%'}
                                                style={{
                                                    backgroundImage: 'url("' +
                                                        links[0].backgroundImage +
                                                        '")'
                                                }} />
                                            <Ellipsis
                                                isFixedHeight={isDesktop}
                                                lineHeight={descLineHeight}
                                                marginTop={space[2]}
                                                numberOfLines={2}
                                                htmlContent={links[0].displayTitle} />
                                        </BccLink>
                                    );
                                })}
                            </Carousel>
                        </Grid.Cell> : null
                    }
                </Grid> : null
            }
        </div>
    );
};


/**
 *
 * Determines if Looks should be shown for this product based on brand, type (don't show if it's
 * a reward, or a birthday gift, for instance).
 *
 * Do not show if media is not present and filtering is not enabled (since you could end up with no
 * media due to filtering, but still want to show the comonent in that case)
 *
 * @param isPpageBeautyBoardEnabled
 * @param isDesktop
 * @returns {*}
 */
ExploreThisProduct.prototype.shouldShowLooks = function (isPpageBeautyBoardEnabled, isDesktop) {
    let isOlapicBeautyBoardEnabled = Sephora.configurationSettings.isOlapicBeautyBoardEnabled;
    if ((!isPpageBeautyBoardEnabled && isDesktop) || !isOlapicBeautyBoardEnabled) {
        return false;
    }

    let showForBrand =
        Object.values(BRANDS_WITHOUT_LOOKS).indexOf(this.props.brand.brandId) === -1;
    let showForType =
        SKU_TYPES_WITHOUT_LOOKS.indexOf(this.props.currentSku.type.toLowerCase()) === -1;

    let shouldShow = (showForBrand && showForType && !this.isGift(this.props.currentSku)) &&
        (this.state.media.length || this.state.filtered);

    //Analytics
    if (shouldShow && this.state.media.length) {
        if (digitalData.page.attributes.featureVariantKeys.indexOf(
            analyticsConsts.PAGE_VARIANTS.EXPLORE_LOOKS) === -1) {
            digitalData.page.attributes.featureVariantKeys.push(
                analyticsConsts.PAGE_VARIANTS.EXPLORE_LOOKS
                );
        }
    }

    return shouldShow;
};


// Added by sephora-jsx-loader.js
ExploreThisProduct.prototype.path = 'ProductPage/ExploreThisProduct';
// Added by sephora-jsx-loader.js
Object.assign(ExploreThisProduct.prototype, require('./ExploreThisProduct.c.js'));
var originalDidMount = ExploreThisProduct.prototype.componentDidMount;
ExploreThisProduct.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ExploreThisProduct');
if (originalDidMount) originalDidMount.apply(this);
if (ExploreThisProduct.prototype.ctrlr) ExploreThisProduct.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ExploreThisProduct');
// Added by sephora-jsx-loader.js
ExploreThisProduct.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ExploreThisProduct.prototype.class = 'ExploreThisProduct';
// Added by sephora-jsx-loader.js
ExploreThisProduct.prototype.getInitialState = function() {
    ExploreThisProduct.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ExploreThisProduct.prototype.render = wrapComponentRender(ExploreThisProduct.prototype.render);
// Added by sephora-jsx-loader.js
var ExploreThisProductClass = React.createClass(ExploreThisProduct.prototype);
// Added by sephora-jsx-loader.js
ExploreThisProductClass.prototype.classRef = ExploreThisProductClass;
// Added by sephora-jsx-loader.js
Object.assign(ExploreThisProductClass, ExploreThisProduct);
// Added by sephora-jsx-loader.js
module.exports = ExploreThisProductClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/ExploreThisProduct/ExploreThisProduct.jsx