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
    Sephora.Util.InflatorComps.Comps['BasketLoves'] = function BasketLoves(){
        return BasketLovesClass;
    }
}
const { measure, space } = require('style');
const { Box, Flex, Text } = require('components/display');
const ButtonOutline = require('components/Button/ButtonOutline');
const Link = require('components/Link/Link');
const IconLove = require('components/Icon/IconLove');
const Carousel = require('components/Carousel/Carousel');
const ProductItem = require('components/Product/ProductItem/ProductItem');
const SkuUtils = require('utils/Sku');
const analyticsConstants = require('analytics/constants');

const BasketLoves = function () {
    this.state = { isLoggedIn: false };
};

BasketLoves.prototype.render = function () {

    const viewAllLovesUrl = '/shopping-list';
    const carouselTitle = 'Your Loves';

    let signInCTA = (
        <Box
            textAlign='center'>
            <Text
                is='h2'
                fontWeight={700}
                marginBottom={space[2]}>
                Your Loves list is waiting for you!
            </Text>
            <Text
                is='p'
                marginBottom={space[4]}
                maxWidth={measure.WIDE}
                marginX='auto'>
                Sign in and discover a new way to collect your favorite beauty products
                and organize all your online and in-store purchases.
            </Text>
            <ButtonOutline
                onClick={this.signInHandler}>
                Sign in
            </ButtonOutline>
        </Box>
    );

    let showLovesCarousel = (
        <Carousel
            gutter={space[5]}
            flex={true}
            displayCount={4}
            totalItems={this.props.loves && this.props.loves.length}
            showArrows={true}
            showTouts={false}
            controlHeight={this.props.imageSize}>
            {this.props.loves && this.props.loves.map(product =>
                <ProductItem
                    analyticsContext={analyticsConstants.CONTEXT.BASKET_LOVES}
                    rootContainerName={carouselTitle}
                    key={product.skuId}
                    isWithBackInStockTreatment={
                        product.actionFlags.backInStockReminderStatus !==
                        'notApplicable'}
                    isCountryRestricted={SkuUtils.isCountryRestricted(product)}
                    showSignUpForEmail={true}
                    isUseAddToBasket={true}
                    showPrice={true}
                    showQuickLook={false}
                    showMarketingFlags={true}
                    imageSize={this.props.imageSize}
                    showReviews={this.props.showReviews}
                    buttonText={this.props.buttonText}
                    {...product} />
            )}
        </Carousel>
    );

    let showEmpty = (
        <Box
            textAlign='center'>
            <Text
                is='p'
                fontWeight={700}
                marginBottom={space[2]}>
                You haven’t loved anything yet!
            </Text>
            <Text
                is='p'
                maxWidth={measure.BASE}
                marginX='auto'>
                Collect all your favorite beauty and
                must-try products by clicking on the
                {' '}
                <IconLove
                    marginX={space[1]}
                    outline={true} />
                {' '}
                while you shop.
            </Text>
        </Box>
    );

    return (
        <div>
            <Flex
                alignItems='baseline'
                justifyContent='space-between'
                marginBottom={space[5]}
                lineHeight={1}>
                <Text
                    is='h2'
                    fontSize='h1'
                    serif={true}>
                    {carouselTitle}
                </Text>
                { (this.props.loves && this.props.loves.length > 0) &&
                    <Link
                        href={viewAllLovesUrl}
                        padding={space[3]}
                        margin={-space[3]}
                        arrowDirection='right'>
                        View Loves
                    </Link>
                }
            </Flex>
            {!this.state.isLoggedIn && signInCTA}
            {this.state.isLoggedIn ?
                (this.props.loves && this.props.loves.length > 0) ? showLovesCarousel : showEmpty
                : null}
        </div>
    );
};


// Added by sephora-jsx-loader.js
BasketLoves.prototype.path = 'Basket/BasketLoves';
// Added by sephora-jsx-loader.js
Object.assign(BasketLoves.prototype, require('./BasketLoves.c.js'));
var originalDidMount = BasketLoves.prototype.componentDidMount;
BasketLoves.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BasketLoves');
if (originalDidMount) originalDidMount.apply(this);
if (BasketLoves.prototype.ctrlr) BasketLoves.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BasketLoves');
// Added by sephora-jsx-loader.js
BasketLoves.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BasketLoves.prototype.class = 'BasketLoves';
// Added by sephora-jsx-loader.js
BasketLoves.prototype.getInitialState = function() {
    BasketLoves.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketLoves.prototype.render = wrapComponentRender(BasketLoves.prototype.render);
// Added by sephora-jsx-loader.js
var BasketLovesClass = React.createClass(BasketLoves.prototype);
// Added by sephora-jsx-loader.js
BasketLovesClass.prototype.classRef = BasketLovesClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketLovesClass, BasketLoves);
// Added by sephora-jsx-loader.js
module.exports = BasketLovesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketLoves/BasketLoves.jsx