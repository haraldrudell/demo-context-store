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
    Sephora.Util.InflatorComps.Comps['Service'] = function Service(){
        return ServiceClass;
    }
}
/* eslint-disable max-len */
const { forms, space } = require('style');
const Divider = require('components/Divider/Divider');
const Container = require('components/Container/Container');
const { Flex, Text, Box, Grid } = require('components/display');
const Image = require('components/Image/Image');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const ProductLove = require('components/Product/ProductLove/ProductLove');
const ProductLoveToggle =
    require('components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const ProductDisplayName = require('components/Product/ProductDisplayName/ProductDisplayName');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const skuUtils = require('utils/Sku');
const Link = require('components/Link/Link');
const dateUtils = require('utils/Date');
const LocaleUtils = require('utils/LanguageLocale');

const Service = function() {};

Service.prototype.render = function () {
    const { service } = this.props;
    const isDesktop = Sephora.isDesktop();
    const isMobile = Sephora.isMobile();
    const loveIconSize = 24;

    let getFormattedDate = (date) => {
        date = new Date (date);
        return `${dateUtils.getLongMonth(date.getMonth() + 1)}
            ${date.getDate()}, ${date.getFullYear()}`;
    };
    return (
        <div>
            <Divider
                height={space[2]}
                marginTop={space[5]}
                marginBottom={space[4]}
                color='nearWhite' />
            <Container>
                <Text
                    is='h2'
                    lineHeight={2}
                    fontSize={isDesktop ? 'h3' : null}>
                    {isDesktop ? getFormattedDate(service.dateToDisplay) : service.dateToDisplay}
                    <br />
                    Makeover at {service.store.displayName}
                </Text>
                {service.skus.map(sku => {
                    return (
                        <div>
                            <Divider
                                marginY={space[4]}
                                color='lightGray' />
                            <Grid
                                href={skuUtils.isCountryRestricted(sku) ? null : sku.targetUrl}
                                gutter={isMobile ? space[4] : space[5]}>
                                <Grid.Cell
                                    width='fit'>
                                    <Box
                                        _css={{
                                            '@media (max-width: 374px)': {
                                                width: IMAGE_SIZES[62]
                                            }
                                        }}>
                                        <ProductImage
                                            skuImages={sku.skuImages}
                                            size={IMAGE_SIZES[97]} />
                                    </Box>
                                </Grid.Cell>
                                <Grid.Cell
                                    width='fill'>
                                    <Grid
                                        gutter={space[4]}>
                                        <Grid.Cell
                                            width='fill'>
                                            <ProductDisplayName
                                                fontSize='h4'
                                                brandName={sku.brandName}
                                                productName={sku.productName}
                                                isHovered={this.state.hover} />
                                            <SizeAndItemNumber
                                                sku={sku}
                                                fontSize='h5'
                                                marginTop={space[1]} />
                                            <ProductVariation
                                                sku={sku}
                                                fontSize='h5'
                                                marginTop={space[1]} />
                                        </Grid.Cell>
                                        <Grid.Cell
                                            fontWeight={700}
                                            width={isMobile ? 'fit' : 250}
                                            textAlign={isMobile ? 'right' : null}>
                                            <Text
                                                textDecoration={sku.salePrice
                                                    ? 'line-through'
                                                    : null
                                                }>
                                                {sku.listPrice}
                                            </Text>
                                            {sku.salePrice &&
                                                <Text color='red'>
                                                    {' '}
                                                    {sku.salePrice}
                                                </Text>
                                            }
                                            {sku.valuePrice &&
                                                <Text
                                                    display='block'
                                                    fontWeight={400}>
                                                    {sku.valuePrice}
                                                </Text>
                                            }
                                        </Grid.Cell>
                                        <Grid.Cell
                                            width={isDesktop ? 'fit' : null}
                                            marginTop={isMobile ? space[4] : null}>
                                            <Flex>
                                                {skuUtils.isCountryRestricted(sku) ?
                                                    <Box
                                                        marginRight={space[5]}
                                                        width={165}>
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
                                                    </Box>
                                                : 
                                                    <Box
                                                        visibility={sku.isActive ? null : 'hidden'}
                                                        marginRight={space[5]}
                                                        width={165}>
                                                        <AddToBasketButton
                                                            block={true}
                                                            quantity={1}
                                                            sku={sku}
                                                            type={ADD_BUTTON_TYPE.OUTLINE}
                                                            disabled={skuUtils.isProductDisabled(sku)} />
                                                        {sku.isOutOfStock &&
                                                            <Link
                                                                display='block'
                                                                marginX='auto'
                                                                fontSize='h5'
                                                                paddingY={space[2]}
                                                                marginTop={-space[1]}
                                                                marginBottom={-space[2]}
                                                                primary={true}
                                                                onClick={e => this.showFindInStore(e, sku)}>
                                                                Find in store
                                                            </Link>
                                                        }
                                                    </Box> 
                                                }
                                                <Box
                                                    paddingTop={(forms.HEIGHT - loveIconSize) / 2}
                                                    visibility={sku.isActive ? null : 'hidden'}>
                                                    {
                                                        // ILLUPH-100286 redo source as something generic,
                                                        // and remove the css visibility hidden above
                                                    }
                                                    <ProductLove
                                                        skuId={sku.skuId}
                                                        loveSource='productPage'>
                                                        <ProductLoveToggle
                                                            fontSize={loveIconSize} />
                                                    </ProductLove>
                                                </Box>
                                            </Flex>
                                        </Grid.Cell>
                                    </Grid>
                                </Grid.Cell>
                            </Grid>
                        </div>
                    );
                })}
            </Container>
        </div>
    );
};


// Added by sephora-jsx-loader.js
Service.prototype.path = 'RichProfile/StoreServices/Service';
// Added by sephora-jsx-loader.js
Object.assign(Service.prototype, require('./Service.c.js'));
var originalDidMount = Service.prototype.componentDidMount;
Service.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Service');
if (originalDidMount) originalDidMount.apply(this);
if (Service.prototype.ctrlr) Service.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Service');
// Added by sephora-jsx-loader.js
Service.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Service.prototype.class = 'Service';
// Added by sephora-jsx-loader.js
Service.prototype.getInitialState = function() {
    Service.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Service.prototype.render = wrapComponentRender(Service.prototype.render);
// Added by sephora-jsx-loader.js
var ServiceClass = React.createClass(Service.prototype);
// Added by sephora-jsx-loader.js
ServiceClass.prototype.classRef = ServiceClass;
// Added by sephora-jsx-loader.js
Object.assign(ServiceClass, Service);
// Added by sephora-jsx-loader.js
module.exports = ServiceClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/StoreServices/Service/Service.jsx