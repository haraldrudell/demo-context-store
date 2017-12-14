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
    Sephora.Util.InflatorComps.Comps['BccCarousel'] = function BccCarousel(){
        return BccCarouselClass;
    }
}
const { space } = require('style');
const { Box, Image } = require('components/display');
const Link = require('components/Link/Link');
const Carousel = require('components/Carousel/Carousel');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const certonaDataAt = require('utils/certona').CERTONA_DATA_AT_VALUES;

const BccCarousel = function () {

    // TODO: Carousel contents need to be served on the server side
    this.state = {
        carouselItems: []
    };
};

BccCarousel.prototype.render = function () {
    let {
        showSKUNumbering,
        showMarketingFlags,
        showLoves,
        showReviews,
        showPrice,
        displayCount,
        carouselMaxItems,
        totalItems,
        componentType,
        imagePath,
        title,
        isSmallTitle,
        isLeftTitle,
        subHead,
        moreTarget,
        isEnableCircle,
        carouselImageSize,
        isCertonaCarousel,
        skuImageSize,
        showArrows,
        name,
        showTouts,
        isUseAddToBasket,
        showSignUpForEmail,
        buttonText,
        children,
        disableLazyLoad = false,
        ...props
    } = this.props;

    // if no arrows, ProductItem should be flush with its container
    const hasArrows = showArrows && Sephora.isDesktop() && (totalItems > displayCount);

    const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;

    const Item = (componentType === COMPONENT_NAMES.CAROUSEL)
        ? require('components/Product/ProductItem/ProductItem')
        : componentType === COMPONENT_NAMES.REWARDS_CAROUSEL
            ? require('components/Reward/RewardItem/RewardItem') : null;

    const imageSize = Sephora.isDesktop()
        ? carouselImageSize || skuImageSize
        : IMAGE_SIZES[135];

    if (this.state.carouselItems && this.state.carouselItems.length > 0) {
        return (
            <div>
                {(title || subHead || moreTarget) &&
                <Box
                    marginBottom={space[5]}
                    textAlign={Sephora.isMobile() || isLeftTitle ? 'left' : 'center'}
                    position='relative'>
                    {title &&
                    <Box
                        is='h2'
                        lineHeight={1}
                        fontSize={Sephora.isMobile() || isSmallTitle ? 'h1' : 'h0'}
                        serif={true}>
                        {imagePath
                            ? <Image src={imagePath} alt={title} />
                            : title
                        }
                    </Box>
                    }
                    {subHead &&
                    <Box
                        is='h3'
                        marginTop={title ? space[2] : null}
                        fontWeight={300}
                        fontSize={Sephora.isMobile() ? 'h4' : 'h3'}>
                        {subHead}
                    </Box>
                    }
                    {moreTarget &&
                    <Box
                        lineHeight={1}
                        textAlign='right'
                        marginTop={imagePath ? space[3] : null}
                        position={imagePath ? null : 'absolute'}
                        bottom={0} right={0}>
                        <Link
                            padding={space[3]}
                            margin={-space[3]}
                            arrowDirection='right'
                            href={moreTarget.targetUrl}>
                            See more
                        </Link>
                    </Box>
                    }
                </Box>
                }
                <Box
                    /* prevent large pop-in (image height + product desc) */
                    minHeight={imageSize + 60}>
                    <Carousel
                        displayCount={Sephora.isMobile() ? 2 : displayCount}
                        showTouts={showTouts}
                        showArrows={hasArrows}
                        carouselMaxItems={carouselMaxItems}
                        totalItems={totalItems}
                        isEnableCircle={isEnableCircle}
                        name={name}
                        controlHeight={imageSize}
                        flex={true}
                        gutter={space[5]}
                        lazyLoad='img'>
                        {
                            this.state.carouselItems.map((item, index) => {
                                if (!item.isBlank) {
                                    item.isLink = true;
                                    item.isUseAddToBasket = isUseAddToBasket;
                                    item.showSignUpForEmail = showSignUpForEmail;
                                    item.imageSize = imageSize;
                                    item.rootContainerName = isCertonaCarousel ? title : name;
                                    item.showPrice = showPrice;
                                    item.showReviews = showReviews;
                                    item.buttonText = buttonText;
                                    item.showLoves = showLoves;
                                    item.showMarketingFlags = showMarketingFlags;
                                    item.disableLazyLoad = disableLazyLoad;
                                    if (isEnableCircle && (index + 1 > totalItems)) {
                                        item.displayNumber = showSKUNumbering ?
                                        index + (Sephora.isMobile() ? 2 :
                                            displayCount) - this.state.carouselItems.length + 1
                                            : null;
                                    } else {
                                        item.displayNumber = showSKUNumbering ? index + 1 : null;
                                    }

                                    return <Item 
                                                key={index}
                                                data-certona={
                                                    this.props.isCertonaCarousel ? 
                                                    certonaDataAt.addToBasketRecs 
                                                    : certonaDataAt.addToBasket}
                                                {...item} />;
                                } else {
                                    return null;
                                }
                            })
                        }
                    </Carousel>
                </Box>
            </div>
        );
    } else {
        return <div></div>;
    }
};


// Added by sephora-jsx-loader.js
BccCarousel.prototype.path = 'Bcc/BccCarousel';
// Added by sephora-jsx-loader.js
Object.assign(BccCarousel.prototype, require('./BccCarousel.c.js'));
var originalDidMount = BccCarousel.prototype.componentDidMount;
BccCarousel.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BccCarousel');
if (originalDidMount) originalDidMount.apply(this);
if (BccCarousel.prototype.ctrlr) BccCarousel.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BccCarousel');
// Added by sephora-jsx-loader.js
BccCarousel.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BccCarousel.prototype.class = 'BccCarousel';
// Added by sephora-jsx-loader.js
BccCarousel.prototype.getInitialState = function() {
    BccCarousel.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BccCarousel.prototype.render = wrapComponentRender(BccCarousel.prototype.render);
// Added by sephora-jsx-loader.js
var BccCarouselClass = React.createClass(BccCarousel.prototype);
// Added by sephora-jsx-loader.js
BccCarouselClass.prototype.classRef = BccCarouselClass;
// Added by sephora-jsx-loader.js
Object.assign(BccCarouselClass, BccCarousel);
// Added by sephora-jsx-loader.js
module.exports = BccCarouselClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Bcc/BccCarousel/BccCarousel.jsx