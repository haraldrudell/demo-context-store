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
    Sephora.Util.InflatorComps.Comps['Basketpage'] = function Basketpage(){
        return BasketpageClass;
    }
}
const { site, space } = require('style');
const { Box, Flex, Grid, Text } = require('components/display');
const BasketList = require('components/Basket/BasketList/BasketList');
const BasketTitle = require('components/Basket/BasketTitle/BasketTitle');
const MobileSamplesList = require('components/Basket/Samples/MobileSamplesList/MobileSamplesList');
const Container = require('components/Container/Container');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');
const CertonaCarousel = require('components/Bcc/BccCarousel/BccCarousel');
const Divider = require('components/Divider/Divider');
const ShippingMessage = require('components/Basket/ShippingMessage/ShippingMessage');
const OrderSummary = require('components/Basket/OrderSummary/OrderSummary');
const InternationalShipping = require('components/Basket/InternationalShipping/InternationalShipping');
const RewardsCallToAction = require('components/Basket/Rewards/RewardsCallToAction/RewardsCallToAction');
const SamplesCallToAction = require('components/Basket/Samples/SamplesCallToAction/SamplesCallToAction');
const PromoSection = require('components/Basket/PromoSection/PromoSection');
const NeedAssistance = require('components/Basket/NeedAssistance/NeedAssistance');
const SampleRewardTabs = require('components/Basket/SampleRewardTabs/SampleRewardTabs');
const BasketTargeters = require('components/Basket/BasketTargeters/BasketTargeters');
const BasketLinkShopping = require('components/Basket/BasketLinkShopping/BasketLinkShopping');
const Loves = require('components/Loves/Loves');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const COMPONENT_NAMES = require('utils/BCC').COMPONENT_NAMES;

const Basketpage = function () {
    return null;
};

Basketpage.prototype.getInitialState = Basketpage;

Basketpage.prototype.render = function () {

    let domPrefix = Sephora.isMobile() ? 'm' : 'www';
    let seoJSON = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://' + domPrefix + '.sephora.com/',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://' + domPrefix + '.sephora.com/shop/search/{search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    };
    let {
        regions = {
            content: []
        }
    } = this.props;

    const mwPad = site.PADDING_MW;
    const mwPadHalf = mwPad / 2;
    const bccCarouselsCount = regions.content && regions.content.length ?
        regions.content.filter(item => item.componentType === COMPONENT_NAMES.CAROUSEL).length : 0;

    return (
        <div>
        {Sephora.isMobile() ?
            <Box
                backgroundColor='nearWhite'
                paddingTop={space[2]}>
                <ShippingMessage
                    padding={mwPad}
                    lineHeight={2}
                    textAlign='center'
                    backgroundColor='white' />
                <Box
                    marginTop={mwPad}>
                    <BasketList />
                </Box>
                <Box
                    margin={mwPadHalf}>
                    <BasketTargeters />
                </Box>
                {regions.content.length > 0 &&
                    <Box
                        padding={mwPad}
                        backgroundColor='white'>
                        <BccComponentList items={regions.content} />
                    </Box>
                }
                <Box
                    padding={mwPad}
                    margin={mwPadHalf}
                    backgroundColor='white'>
                    <SamplesCallToAction />
                    <MobileSamplesList />
                </Box>
                <Box
                    padding={mwPad}
                    margin={mwPadHalf}
                    backgroundColor='white'>
                    <RewardsCallToAction />
                </Box>
                <Box
                    padding={mwPad}
                    margin={mwPadHalf}
                    backgroundColor='white'>
                    <PromoSection />
                </Box>
                <Box
                    padding={mwPad}
                    marginY={mwPadHalf}
                    backgroundColor='white'>
                    <CertonaCarousel
                        isUseAddToBasket={true}
                        carouselIndex={bccCarouselsCount + 1}
                        name='Certona Carousel'
                        showPrice={true}
                        showReviews={true}
                        showLoves={true}
                        showTouts={true}
                        showMarketingFlags={true}
                        componentType={COMPONENT_NAMES.CAROUSEL}
                    />
                </Box>
                <Box
                    paddingX={mwPad}
                    paddingTop={mwPad}
                    marginTop={mwPadHalf}
                    backgroundColor='white'>
                    <OrderSummary />
                </Box>
            </Box>
            :
            <Container paddingY={space[5]}>
                <BasketTitle />
                <Flex
                    justifyContent='space-between'
                    alignItems='baseline'
                    lineHeight={2}
                    marginBottom={space[3]}>
                    <div><ShippingMessage /></div>
                    <BasketLinkShopping />
                </Flex>
                <Grid
                    gutter={space[7]}>
                    <Grid.Cell width={2 / 3}>
                        <Divider
                            height={2}
                            color='black'
                            marginBottom={space[3]} />
                        <SampleRewardTabs />
                        <Box
                            padding={space[3]}
                            marginTop={space[3]}
                            marginBottom={space[5]}
                            backgroundColor='nearWhite'>
                            <BasketList />
                        </Box>
                        <BccComponentList
                            items={regions.content}
                            propsCallback={function (componentType) {
                                if (componentType === COMPONENT_NAMES.CAROUSEL) {
                                    return {
                                        isSmallTitle: true,
                                        isLeftTitle: true,
                                        buttonText: 'Add',
                                        carouselImageSize: IMAGE_SIZES[97]
                                    };
                                } else {
                                    return null;
                                }
                            }} />
                        <Loves
                            compType={'BasketLoves'}
                            compProps={
                            {
                                showReviews: true,
                                buttonText: 'Add',
                                imageSize: IMAGE_SIZES[97],
                                showTouts: true
                            }
                            }
                            maxLoves={12} />
                    </Grid.Cell>
                    <Grid.Cell width={1 / 3}>
                        <Box
                            padding={space[4]}
                            marginBottom={space[4]}
                            border={2}
                            borderColor='lightGray'>
                            <OrderSummary/>
                        </Box>
                        <Box
                            marginBottom={space[5]}
                            fontSize='h5'>
                            <InternationalShipping />
                        </Box>
                        <BasketTargeters />
                        <NeedAssistance/>
                    </Grid.Cell>
                </Grid>
            </Container>
        }
        <script type='application/ld+json'
        dangerouslySetInnerHTML={
        {
            __html: JSON.stringify(seoJSON)
        }
        }>
        </script>
        </div>
    );
};


// Added by sephora-jsx-loader.js
Basketpage.prototype.path = 'Basket';
// Added by sephora-jsx-loader.js
Basketpage.prototype.isForcedRoot = true;
// Added by sephora-jsx-loader.js
Basketpage.prototype.pageClientRender = true;
// Added by sephora-jsx-loader.js
Basketpage.prototype.class = 'Basketpage';
// Added by sephora-jsx-loader.js
Basketpage.prototype.getInitialState = function() {
    Basketpage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Basketpage.prototype.render = wrapComponentRender(Basketpage.prototype.render);
// Added by sephora-jsx-loader.js
var BasketpageClass = React.createClass(Basketpage.prototype);
// Added by sephora-jsx-loader.js
BasketpageClass.prototype.classRef = BasketpageClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketpageClass, Basketpage);
// Added by sephora-jsx-loader.js
module.exports = BasketpageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/pages/Basket/Basketpage.r.jsx