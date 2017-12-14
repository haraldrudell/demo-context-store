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
    Sephora.Util.InflatorComps.Comps['ListsStoreServices'] = function ListsStoreServices(){
        return ListsStoreServicesClass;
    }
}
const { fontSizes, lineHeights, space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Carousel = require('components/Carousel/Carousel');
const Divider = require('components/Divider/Divider');
const Link = require('components/Link/Link');
const Container = require('components/Container/Container');
const skuUtils = require('utils/Sku');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const ProductItem = require('components/Product/ProductItem/ProductItem');
const ListsHeader = require('components/RichProfile/Lists/ListsHeader');
const EmptyService = require('components/RichProfile/StoreServices/EmptyService/EmptyService');


const ListsStoreServices = function () {
    this.state = {
        digitalMakeoverSamples: null,
        showStoreServices: false,
        showBookResevervation: false
    };
};

ListsStoreServices.prototype.render = function () {
    let isMobile = Sephora.isMobile();

    return (
        <div>
            {this.state.showStoreServices &&
                <div>
                    <Divider
                        height={space[2]}
                        color='nearWhite' />
                    <Container
                        paddingY={this.props.sectionSpace}>
                        <ListsHeader
                            children='In-store Services'
                            link={this.state.digitalMakeoverSamples ?
                                '/in-store-services' : null} />
                        {this.state.digitalMakeoverSamples &&
                            <div>
                                <Text
                                    is='h3'
                                    lineHeight={2}
                                    textAlign={!isMobile ? 'center' : null}
                                    marginTop={space[1]}
                                    marginBottom={isMobile ? space[4] : space[5]}>
                                    {`${this.state.digitalMakeoverSamples[0].dateToDisplay}
                                        - Makeover at
                                        ${this.state.digitalMakeoverSamples[0].store.displayName}`}
                                </Text>
                                <Carousel
                                    flex={true}
                                    displayCount={isMobile ? 2 : 4}
                                    totalItems={this.state.digitalMakeoverSamples.length}
                                    carouselMaxItems={16}
                                    gutter={space[5]}
                                    controlHeight={this.props.imageSize}
                                    showArrows={!isMobile}
                                    showTouts={true}>
                                    {this.state.digitalMakeoverSamples.map(product =>
                                        <Flex
                                            position='relative'
                                            width='100%'
                                            paddingBottom={
                                                (fontSizes.h5 * lineHeights[2]) + space[1]}>
                                            <ProductItem
                                                key={product.skuId}
                                                isWithBackInStockTreatment={
                                                    product.actionFlags &&
                                                    product.actionFlags.backInStockReminderStatus
                                                     !==
                                                    'notApplicable'
                                                }
                                                isCountryRestricted={
                                                    skuUtils.isCountryRestricted(product)
                                                }
                                                showQuickLook={
                                                    product.isActive &&
                                                        !skuUtils.isCountryRestricted(product) 
                                                }
                                                showSignUpForEmail={true}
                                                isUseAddToBasket={product.isActive}
                                                showPrice={true}
                                                showMarketingFlags={true}
                                                imageSize={this.props.imageSize}
                                                rootName={'profile_lists_store_services_carousel'}
                                                {...product} />
                                            {product.isOutOfStock && 
                                                product.isActive &&
                                                !skuUtils.isCountryRestricted(product) &&
                                                <Box
                                                    position='absolute'
                                                    right={0} bottom={0} left={0}>
                                                    <Link
                                                        display='block'
                                                        lineHeight={2}
                                                        padding={space[2]}
                                                        marginY={-space[2]}
                                                        marginX='auto'
                                                        fontSize='h5'
                                                        primary={true}
                                                        onClick={e =>
                                                            this.showFindInStore(e, product)}>
                                                        Find in store
                                                    </Link>
                                                </Box>
                                            }
                                        </Flex>
                                    )}
                                </Carousel>
                            </div>
                        }
                        {this.state.showBookReservation &&
                            <EmptyService
                                buttonWidth={this.props.buttonWidth} />
                        }
                    </Container>
                </div>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
ListsStoreServices.prototype.path = 'RichProfile/Lists/ListsStoreServices';
// Added by sephora-jsx-loader.js
Object.assign(ListsStoreServices.prototype, require('./ListsStoreServices.c.js'));
var originalDidMount = ListsStoreServices.prototype.componentDidMount;
ListsStoreServices.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ListsStoreServices');
if (originalDidMount) originalDidMount.apply(this);
if (ListsStoreServices.prototype.ctrlr) ListsStoreServices.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ListsStoreServices');
// Added by sephora-jsx-loader.js
ListsStoreServices.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ListsStoreServices.prototype.class = 'ListsStoreServices';
// Added by sephora-jsx-loader.js
ListsStoreServices.prototype.getInitialState = function() {
    ListsStoreServices.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ListsStoreServices.prototype.render = wrapComponentRender(ListsStoreServices.prototype.render);
// Added by sephora-jsx-loader.js
var ListsStoreServicesClass = React.createClass(ListsStoreServices.prototype);
// Added by sephora-jsx-loader.js
ListsStoreServicesClass.prototype.classRef = ListsStoreServicesClass;
// Added by sephora-jsx-loader.js
Object.assign(ListsStoreServicesClass, ListsStoreServices);
// Added by sephora-jsx-loader.js
module.exports = ListsStoreServicesClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/Lists/ListsStoreServices/ListsStoreServices.jsx