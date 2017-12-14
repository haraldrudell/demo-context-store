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
    Sephora.Util.InflatorComps.Comps['ProductQuickLookModal'] = function ProductQuickLookModal(){
        return ProductQuickLookModalClass;
    }
}
/* eslint-disable max-len */
const { fontSizes, forms, lineHeights, modal, space } = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');

const skuUtils = require('utils/Sku');
const urlUtils = require('utils/Url');
const Link = require('components/Link/Link');
const Modal = require('components/Modal/Modal');
const StarRating = require('components/StarRating/StarRating');
const ProductBadges = require('components/Product/ProductBadges/ProductBadges');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductSkuQuantity = require('components/Product/SkuQuantity/SkuQuantity');
const ProductSwatchGroup = require('components/Product/ProductSwatchGroup/ProductSwatchGroup');
const ProductCurrency = require('components/Product/ProductCurrency/ProductCurrency');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ProductLove = require('components/Product/ProductLove/ProductLove');
const ProductLoveButton = require('components/Product/ProductLove/ProductLoveButton/ProductLoveButton');
const ProductLovesCount = require('components/Product/ProductLovesCount/ProductLovesCount');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const MarketingFlags = require('components/Product/MarketingFlags/MarketingFlags');
const ProductQuickLookMessage = require('components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookMessage/ProductQuickLookMessage');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const SKU_TYPES = require('utils/Sku').skuTypes;
const anaConsts = require('analytics/constants');
const certonaDataAt = require('utils/certona').CERTONA_DATA_AT_VALUES;

const ProductQuickLookModal = function () {
    this.props.matchSku = this.props.matchSku ? this.props.currentSku : null;
    this.state = {
        skuQuantity: 1,
        productLovesCount: 0
    };
};

ProductQuickLookModal.prototype.render = function () {
    let {
        isOpen,
        requestClose,
        imageSize,
        leftColWidth,
        product,
        currentSku,
        isCertonaProduct
    } = this.props;

    const productUrl = skuUtils.productUrl(product, currentSku);

    return (
        <Modal
            open={isOpen}
            onDismiss={requestClose}
            width={modal.WIDTH.XL}>
            <Modal.Body>
                <Grid gutter={space[5]}>
                    <Grid.Cell
                        width={leftColWidth}
                        marginBottom={space[5]}>
                        <Box
                            href={productUrl}
                            position='relative'>
                            <ProductImage
                                disableLazyLoad={true}
                                skuImages={currentSku.skuImages}
                                size={imageSize} />
                            <ProductBadges
                                sku={currentSku} />
                        </Box>
                    </Grid.Cell>
                    <Grid.Cell
                        width='fill'
                        marginBottom={space[5]}>

                        <Link
                            href={productUrl}
                            fontSize='h3'
                            lineHeight={2}
                            marginBottom={space[1]}>
                            {product.brand &&
                                <Box
                                    textTransform='uppercase'
                                    fontWeight={700}
                                    className='OneLinkNoTx'
                                    data-at={Sephora.debug.dataAt('ql_brand')}>
                                    {product.brand.displayName}
                                </Box>
                            }
                            <Box
                                data-at={Sephora.debug.dataAt('ql_name')}>
                                {product.displayName}
                            </Box>
                        </Link>

                        <SizeAndItemNumber
                            fontSize='h5'
                            sku={currentSku}
                            marginTop={space[1]} />

                        <Box marginY={space[3]}>
                            <div dangerouslySetInnerHTML={
                                { __html: product.quickLookDescription }
                            } />
                            <Box textAlign='right'>
                                <Link
                                    href={productUrl}
                                    data-QL-product-details
                                    ana-before-unload
                                    ana-evt='QL-links'
                                    fontSize='h6'
                                    fontWeight={700}
                                    textTransform='uppercase'
                                    textDecoration='underline'>
                                    Product Details
                                </Link>
                            </Box>
                        </Box>
                        <ProductVariation
                            hasMinHeight={true}
                            product={product}
                            sku={currentSku} />
                        {(product.skuSelectorType !== skuUtils.skuSwatchType.NONE &&
                          product.regularChildSkus !== undefined)
                                ? <ProductSwatchGroup
                                    product={product}
                                    currentSku={currentSku}
                                    matchSku={this.props.matchSku}
                                    analyticsContext={anaConsts.QUICK_LOOK_MODAL} />
                                : null
                        }
                    </Grid.Cell>
                </Grid>
                <Grid gutter={space[5]}>
                    <Grid.Cell width={leftColWidth}>
                        {!skuUtils.isFlash(currentSku) && !skuUtils.isSubscription(currentSku)
                            ? <Flex
                                fontWeight={700}
                                textTransform='uppercase'
                                fontSize='h6'
                                lineHeight={1}
                                letterSpacing={1}>
                                {product.isHideSocial ||
                                    <Link
                                        display='block'
                                        href={productUrl + '#pdp-reviews'}>
                                        <Box
                                            display='inline-block'
                                            marginRight={space[2]}
                                            top='.625em'>
                                            <StarRating rating={product.rating} />
                                        </Box>
                                        <Text data-at={Sephora.debug.dataAt('ql_rating_label')}>
                                            {(() => {
                                                switch (product.reviews) {
                                                    case undefined:
                                                    case 0:
                                                        return 'Not rated';
                                                    case 1:
                                                        return '1 review';
                                                    default:
                                                        return (product.reviews) + ' reviews';
                                                }
                                            })()}
                                        </Text>
                                    </Link>
                                }
                                {(!skuUtils.isGiftCard(currentSku) &&
                                    !product.isHideSocial) &&
                                    <Box
                                        marginX={space[3]}
                                        borderLeft={1}
                                        borderColor='lightSilver' />
                                }
                                {!skuUtils.isGiftCard(currentSku) &&
                                    <ProductLovesCount product={product} dataAt='ql_love_count' />
                                }
                            </Flex>
                            : null
                        }
                        <MarketingFlags
                            marginTop={space[3]}
                            sku={currentSku} />
                    </Grid.Cell>
                    <Grid.Cell width='fill'>
                        {(!skuUtils.isFlash(currentSku) ||
                            !skuUtils.isSubscription(currentSku)) &&
                            <Box
                                marginLeft={space[3]}
                                width={152}
                                _css={{ float: 'right' }}>
                                <AddToBasketButton
                                    block
                                    data-certona={isCertonaProduct ? certonaDataAt.qlAddToBasketRecs : certonaDataAt.qlAddToBasket}
                                    sku={Object.assign({},
                                        currentSku, { type: SKU_TYPES.STANDARD })}
                                    onSuccess={requestClose}
                                    product={product}
                                    productId={product.productId}
                                    type={ADD_BUTTON_TYPE.RED}
                                    quantity={this.state.skuQuantity}
                                    analyticsContext={anaConsts.QUICK_LOOK_MODAL}
                                    disabled={skuUtils.isProductDisabled(currentSku)} />
                                <Box
                                    marginTop={space[2]}
                                    visibility={!skuUtils.isLoveEligible(currentSku) ?
                                        'hidden' : null}>
                                    <ProductLove
                                        skuId={currentSku.skuId}

                                        // ILLUPH-95525 TODO: change source to qlLove
                                        // when its implemented on API side
                                        loveSource='productPage'
                                        analyticsContext={anaConsts.QUICK_LOOK_MODAL}>
                                        <ProductLoveButton
                                            currentSku={currentSku}
                                            block={true} />
                                    </ProductLove>
                                </Box>
                            </Box>
                        }
                        {(!skuUtils.isFlash(currentSku) ||
                            !skuUtils.isSubscription(currentSku)) &&
                            <Box
                                marginLeft={space[3]}
                                float='right'>
                                <ProductSkuQuantity
                                    currentSku={currentSku}
                                    skuQuantity={this.state.skuQuantity}
                                    handleSkuQuantity={this.handleSkuQuantity}
                                    source='ql_qty'
                                    disabled={
                                        skuUtils.isProductDisabled(currentSku) ||
                                        skuUtils.isGiftCard(currentSku)
                                    } />
                            </Box>
                        }
                        <Box
                            fontSize='h3'
                            lineHeight={2}
                            marginBottom={space[2]}
                            fontWeight={700}
                            data-at={Sephora.debug.dataAt('ql_price_list')}
                            height={forms.HEIGHT}>
                            {currentSku.salePrice ?
                                <Text
                                    fontWeight={400}
                                    color='midGray'
                                    textDecoration='line-through'>
                                    {currentSku.listPrice}
                                </Text>
                                :
                                currentSku.listPrice
                            }
                            {currentSku.salePrice &&
                                <Text color='red'>
                                    {' '}
                                    {currentSku.salePrice}
                                </Text>
                            }
                            <br />
                            <Text fontWeight={400}>
                                {currentSku.valuePrice && currentSku.valuePrice}
                            </Text>
                        </Box>
                        <ProductQuickLookMessage currentSku={currentSku} product={product} />
                    </Grid.Cell>
                </Grid>
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
ProductQuickLookModal.prototype.path = 'GlobalModals/QuickLookModal/ProductQuickLookModal';
// Added by sephora-jsx-loader.js
Object.assign(ProductQuickLookModal.prototype, require('./ProductQuickLookModal.c.js'));
var originalDidMount = ProductQuickLookModal.prototype.componentDidMount;
ProductQuickLookModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ProductQuickLookModal');
if (originalDidMount) originalDidMount.apply(this);
if (ProductQuickLookModal.prototype.ctrlr) ProductQuickLookModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ProductQuickLookModal');
// Added by sephora-jsx-loader.js
ProductQuickLookModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ProductQuickLookModal.prototype.class = 'ProductQuickLookModal';
// Added by sephora-jsx-loader.js
ProductQuickLookModal.prototype.getInitialState = function() {
    ProductQuickLookModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ProductQuickLookModal.prototype.render = wrapComponentRender(ProductQuickLookModal.prototype.render);
// Added by sephora-jsx-loader.js
var ProductQuickLookModalClass = React.createClass(ProductQuickLookModal.prototype);
// Added by sephora-jsx-loader.js
ProductQuickLookModalClass.prototype.classRef = ProductQuickLookModalClass;
// Added by sephora-jsx-loader.js
Object.assign(ProductQuickLookModalClass, ProductQuickLookModal);
// Added by sephora-jsx-loader.js
module.exports = ProductQuickLookModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookModal.jsx