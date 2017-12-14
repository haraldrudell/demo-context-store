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
    Sephora.Util.InflatorComps.Comps['Lists'] = function Lists(){
        return ListsClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Carousel = require('components/Carousel/Carousel');
const Divider = require('components/Divider/Divider');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Container = require('components/Container/Container');
const SkuUtils = require('utils/Sku');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const ProfileTopNav = require('components/RichProfile/ProfileTopNav/ProfileTopNav');
const PleaseSignInBlock = require('components/RichProfile/MyAccount/PleaseSignIn');
const Loves = require('components/Loves/Loves');
const ListsStoreServices = require('./ListsStoreServices/ListsStoreServices');
const ListsHeader = require('./ListsHeader');
const localeUtils = require('utils/LanguageLocale');

const Lists = function () {
    this.state = {
        loves: null,
        pastPurchase: {
            purchaseDateStore: '',
            items: null
        },
        userIsBi: null
    };
};

Lists.prototype.render = function () {
    let pastPurchase = this.state.pastPurchase;
    let userIsBi = this.state.userIsBi;
    let isMobile = Sephora.isMobile();
    let viewAllPurchasesUrl = isMobile ? '/account/beautybag/purchases' : '/purchase-history';

    const sectionSpace = isMobile ? space[5] : space[6];
    const buttonWidth = '18.5em';
    const imageSize = IMAGE_SIZES[162];

    const getComponentType = function (item) {
        let Item;
        if (SkuUtils.isBiReward(item.sku)) {
            Item = require('components/Reward/RewardItem/RewardItem');
        } else if (SkuUtils.isSample(item.sku)) {
            Item = require('components/Product/SampleItem/SampleItem');
        } else {
            Item = require('components/Product/ProductItem/ProductItem');
        }
        return <Item
                    isWithBackInStockTreatment={
                        item.sku.actionFlags.backInStockReminderStatus !== 'notApplicable'
                    }
                    isCountryRestricted={
                        SkuUtils.isCountryRestricted(item.sku)}
                    showQuickLook={
                        !SkuUtils.isCountryRestricted(item.sku)
                    }
                    showSignUpForEmail={true}
                    isUseAddToBasket={item.sku.fullSizeSku ?
                        item.sku.actionFlags.isFullSizeSkuOrderable :
                        (item.sku.actionFlags.isAddToBasket ||
                        item.sku.isOutOfStock)}
                    isPastPurchaseItem={true}
                    isShowAddFullSize={item.sku.actionFlags.isFullSizeSkuOrderable}
                    showPrice={true}
                    showMarketingFlags={true}
                    imageSize={imageSize}
                    key={item.sku.skuId}
                    skuImages={item.sku.skuImages}
                    rootName={'profile_lists_purchases_carousel'}
                    {...item.sku}/>;
    };

    return (
        <div>
            <ProfileTopNav section='lists' />
            {!Sephora.isRootRender && this.isUserReady() &&
                <Box textAlign={!isMobile ? 'center' : null}>
                    <Container
                        paddingY={sectionSpace}>
                        {this.isUserAtleastRecognized() ||
                            <div>
                                <ListsHeader
                                    children='Loves' />
                                <PleaseSignInBlock />
                            </div>
                        }
                        {this.isUserAtleastRecognized() &&
                            <Loves
                                compType={'ListsLoves'}
                                maxLoves={12}
                                compProps={
                                    { imageSize: imageSize }
                                } />
                        }
                    </Container>

                    <Divider
                        height={space[2]}
                        color='nearWhite' />

                    <Container
                        paddingY={sectionSpace}>
                        <ListsHeader
                            children='Purchases'
                            link={(pastPurchase.items && pastPurchase.items.length > 0) ?
                                viewAllPurchasesUrl : null} />
                        {pastPurchase.purchaseDateStore &&
                            <Text
                                is='h3'
                                lineHeight={2}
                                textAlign={!isMobile ? 'center' : null}
                                marginTop={space[1]}
                                marginBottom={isMobile ? space[4] : space[5]}>
                                {pastPurchase.purchaseDateStore}
                            </Text>
                        }

                        {!this.isUserAtleastRecognized() &&
                            <PleaseSignInBlock />
                        }

                        { this.isUserAtleastRecognized() &&
                            <div>
                                { (pastPurchase.items && pastPurchase.items.length > 0) &&
                                    <Carousel
                                        displayCount={isMobile ? 2 : 4}
                                        totalItems={pastPurchase.items.length}
                                        carouselMaxItems={12}
                                        flex={true}
                                        gutter={space[5]}
                                        controlHeight={imageSize}
                                        showArrows={Sephora.isDesktop()}
                                        showTouts={true}>
                                        {pastPurchase.items.map(item =>
                                           getComponentType(item)
                                        )}
                                    </Carousel>
                                }
                                { (pastPurchase.items && pastPurchase.items.length === 0) &&
                                    <Text
                                        is='p'
                                        lineHeight={2}
                                        fontSize={!isMobile ? 'h3' : null}
                                        marginTop={space[2]}>
                                        Keep track of all your past online and
                                        {isMobile ? ' ' : <br />}
                                        in-store purchases here.
                                    </Text>
                                }
                                { (userIsBi === false) &&
                                    <div>
                                        <Text
                                            is='p'
                                            lineHeight={2}
                                            fontSize={!isMobile ? 'h3' : null}
                                            marginTop={space[2]}
                                            marginBottom={space[5]}>
                                            You need to be a Beauty Insider member
                                            {isMobile ? ' ' : <br />}
                                            to view your past purchases.
                                        </Text>
                                        <ButtonPrimary
                                            size={!isMobile ? 'lg' : null}
                                            minWidth={buttonWidth}
                                            onClick={()=> {
                                                this.biRegisterHandler();
                                            }}>
                                            Join Beauty Insider
                                        </ButtonPrimary>
                                    </div>
                                }
                            </div>
                        }
                    </Container>
                    { this.isUserAtleastRecognized() &&
                        <ListsStoreServices
                            buttonWidth={buttonWidth}
                            sectionSpace={sectionSpace}
                            imageSize={imageSize} />
                    }
                    {!this.isUserAtleastRecognized() && localeUtils.isUS() &&
                        <div>
                            <Divider
                                height={space[2]}
                                color='nearWhite' />
                            <Container
                                paddingY={sectionSpace}>
                                <ListsHeader
                                    children='In-store Services' />
                                <PleaseSignInBlock />
                            </Container>
                        </div>
                    }
                </Box>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
Lists.prototype.path = 'RichProfile/Lists';
// Added by sephora-jsx-loader.js
Object.assign(Lists.prototype, require('./Lists.c.js'));
var originalDidMount = Lists.prototype.componentDidMount;
Lists.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Lists');
if (originalDidMount) originalDidMount.apply(this);
if (Lists.prototype.ctrlr) Lists.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Lists');
// Added by sephora-jsx-loader.js
Lists.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Lists.prototype.class = 'Lists';
// Added by sephora-jsx-loader.js
Lists.prototype.getInitialState = function() {
    Lists.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Lists.prototype.render = wrapComponentRender(Lists.prototype.render);
// Added by sephora-jsx-loader.js
var ListsClass = React.createClass(Lists.prototype);
// Added by sephora-jsx-loader.js
ListsClass.prototype.classRef = ListsClass;
// Added by sephora-jsx-loader.js
Object.assign(ListsClass, Lists);
// Added by sephora-jsx-loader.js
module.exports = ListsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/Lists/Lists.jsx