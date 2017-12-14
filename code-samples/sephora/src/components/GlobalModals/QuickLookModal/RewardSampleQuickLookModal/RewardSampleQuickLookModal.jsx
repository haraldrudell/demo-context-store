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
    Sephora.Util.InflatorComps.Comps['RewardSampleQuickLookModal'] = function RewardSampleQuickLookModal(){
        return RewardSampleQuickLookModalClass;
    }
}
const { colors, modal, space } = require('style');
const { Box, Grid, Text } = require('components/display');

const Modal = require('components/Modal/Modal');
const ProductBadges = require('components/Product/ProductBadges/ProductBadges');
const ButtonOutline = require('components/Button/ButtonOutline');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const Link = require('components/Link/Link');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const skuUtils = require('utils/Sku');

const RewardSampleQuickLookModal = function () {
    this.state = {
        isInBasket: false,
        isRewardDisabled: true
    };
};

RewardSampleQuickLookModal.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    let {
        isOpen,
        requestClose,
        imageSize,
        leftColWidth,
        currentSku,
        skuType,
        product
    } = this.props;
    const rewardModalQuantity = 1;

    const isSample = skuUtils.isSample(currentSku);

    const flags = [];
    if (currentSku.isGoingFast) {
        flags.push('Going Fast');
    }

    if (currentSku.isLimitedQuantity) {
        flags.push('Limited Supply');
    }

    let getFullSizeUrl = () => {
        if (isSample) {
            return currentSku.targetUrl;
        } else {
            return '/product/' + currentSku.fullSizeProductId + '?skuId=' +
                currentSku.fullSizeSkuId;
        }
    };

    let getTargetUrl = () => {
        if (currentSku.fullSizeSku) {
            return `${currentSku.fullSizeSku.targetUrl}?skuId=${currentSku.fullSizeSku.skuId}`;
        } else {
            return product.targetUrl + '?skuId=' + currentSku.skuId;
        }
    };

    // TODO: clean this up!
    let productUrl = (() => {
        if (currentSku.fullSizeProductUrl) {
            if (product.productId) {
                return getFullSizeUrl();
            } else {
                return null;
            }
        } else {
            return currentSku.targetUrl ? getTargetUrl() : null;
        }
    })();

    const mainActions = (
        <Grid
            gutter={modal.ACTIONS_GUTTER}
            width={isDesktop ? modal.ACTIONS_WIDTH : null}>
            { productUrl &&
                <Grid.Cell width={1 / 2}>
                    <ButtonOutline
                        block={true}
                        href={productUrl}>
                        {currentSku.fullSizeProductUrl || currentSku.fullSizeSku
                            ? 'View Full Size'
                            : 'View Details'
                        }
                    </ButtonOutline>
                </Grid.Cell>
            }
            {!isSample &&
                <Grid.Cell width={1 / 2}>
                    <AddToBasketButton
                        block={true}
                        sku={currentSku}
                        type={this.state.isInBasket ?
                            ADD_BUTTON_TYPE.PRIMARY : ADD_BUTTON_TYPE.RED}
                        disabled={!this.state.isInBasket && this.state.isRewardDisabled}
                        text={this.state.isInBasket ?
                            'Remove' : 'Add to Basket'}
                        quantity={rewardModalQuantity} />
                </Grid.Cell>
            }
        </Grid>
    );

    const getBrandName = () => {
        let brandName = '';

        if (isSample) {
            if (product.brand) {
                brandName = product.brand.displayName;
            } else {
                brandName = currentSku.brandName;
            }
        } else {
            brandName = currentSku.brandName ? currentSku.brandName :
                currentSku.rewardsInfo && currentSku.rewardsInfo.brandName;
        }

        return brandName;
    };

    const productName = isSample ? product.displayName : currentSku.rewardsInfo ?
        currentSku.rewardsInfo.productName : currentSku.productName;

    const ProductNameComp = productUrl ? Link : Box;

    const productNameBlock = (
        <ProductNameComp
            display='block'
            href={productUrl}
            fontSize={isMobile ? 'h4' : 'h3'}
            lineHeight={2}
            marginBottom={space[1]}>
            <Box
                textTransform='uppercase'
                fontWeight={700}
                className='OneLinkNoTx'
                data-at={Sephora.debug.dataAt('ql_brand')}>
                {getBrandName()}
            </Box>
            <Box
                data-at={Sephora.debug.dataAt('ql_name')}>
                {productName}
            </Box>
        </ProductNameComp>
    );

    return (
        <Modal
            open={isOpen}
            onDismiss={requestClose}
            width={modal.WIDTH.LG}>
            {isMobile &&
                <Modal.Header>
                    <Modal.Title>
                        Quick look
                    </Modal.Title>
                </Modal.Header>
            }
            <Modal.Body
                style={isMobile ? {
                    textAlign: 'center'
                } : {}}>
                <Grid
                    gutter={isDesktop ? space[5] : null}>
                    <Grid.Cell
                        width={isDesktop ? leftColWidth : null}>

                        {isMobile && productNameBlock}

                        <Box
                            position='relative'>
                            <Box
                                href={productUrl}
                                maxWidth={imageSize}
                                marginX='auto'
                                onClick={productUrl &&
                                    (() => Sephora.analytics.utils.setNextPageData(
                                        { inkData: 'quicklook_prod-image_click' }
                                    ))}>
                                <ProductImage
                                    disableLazyLoad={true}
                                    skuImages={currentSku.skuImages}
                                    /* TODO: API to add 300 image size path */
                                    size={IMAGE_SIZES[450]} />
                            </Box>
                            <ProductBadges
                                left={isMobile ? modal.PADDING_MW : 0}
                                sku={currentSku} />
                        </Box>
                    </Grid.Cell>
                    <Grid.Cell
                        display='flex'
                        flexDirection='column'
                        width={isDesktop ? 'fill' : null}>
                        <div>
                            {isDesktop && productNameBlock}
                            <SizeAndItemNumber
                                fontSize='h6'
                                sku={currentSku}
                                marginTop={space[1]}
                                marginBottom={space[3]} />
                            <ProductVariation
                                fontSize='h6'
                                product={product}
                                sku={currentSku} />

                            <Box
                                lineHeight={1}
                                letterSpacing={1}
                                textTransform='uppercase'
                                fontWeight={700}
                                fontSize='h6'
                                marginTop={space[3]}
                                data-at={Sephora.debug.dataAt('ql_flags')}>
                                {
                                    flags.map((flag, index) => {
                                        const flagStyle = index > 0 ? {
                                            borderLeftWidth: 1,
                                            borderColor: colors.lightSilver,
                                            marginLeft: space[2],
                                            paddingLeft: space[2]
                                        } : {};
                                        return (
                                            <Text
                                                key={index}
                                                color={flag === 'New' ? colors.black : colors.red}
                                                _css={flagStyle}>
                                                {flag}
                                            </Text>
                                        );
                                    })
                                }
                            </Box>

                            {currentSku.ingredientDesc && !isSample &&
                                <Box
                                    marginTop={space[3]}
                                    dangerouslySetInnerHTML={{
                                        __html: currentSku.ingredientDesc
                                    }} />
                            }

                            <Box
                                fontSize='h3'
                                lineHeight={2}
                                marginTop={space[4]}>
                                <Box
                                    fontWeight={700}>
                                    {skuUtils.isFree(currentSku)
                                        ? 'FREE'
                                        : currentSku.biType.toLowerCase()
                                    }
                                </Box>
                                {currentSku.valuePrice &&
                                    <span
                                        data-at={Sephora.debug.dataAt('ql_price_list')}>
                                        {currentSku.valuePrice}
                                    </span>
                                }
                            </Box>
                        </div>
                        {isDesktop &&
                            <Box
                                marginTop='auto'
                                paddingTop={space[6]}>
                                {mainActions}
                            </Box>
                        }
                    </Grid.Cell>
                </Grid>
            </Modal.Body>
            {isMobile &&
                <Modal.Footer>
                    {mainActions}
                </Modal.Footer>
            }
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
RewardSampleQuickLookModal.prototype.path = 'GlobalModals/QuickLookModal/RewardSampleQuickLookModal';
// Added by sephora-jsx-loader.js
Object.assign(RewardSampleQuickLookModal.prototype, require('./RewardSampleQuickLookModal.c.js'));
var originalDidMount = RewardSampleQuickLookModal.prototype.componentDidMount;
RewardSampleQuickLookModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RewardSampleQuickLookModal');
if (originalDidMount) originalDidMount.apply(this);
if (RewardSampleQuickLookModal.prototype.ctrlr) RewardSampleQuickLookModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RewardSampleQuickLookModal');
// Added by sephora-jsx-loader.js
RewardSampleQuickLookModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RewardSampleQuickLookModal.prototype.class = 'RewardSampleQuickLookModal';
// Added by sephora-jsx-loader.js
RewardSampleQuickLookModal.prototype.getInitialState = function() {
    RewardSampleQuickLookModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RewardSampleQuickLookModal.prototype.render = wrapComponentRender(RewardSampleQuickLookModal.prototype.render);
// Added by sephora-jsx-loader.js
var RewardSampleQuickLookModalClass = React.createClass(RewardSampleQuickLookModal.prototype);
// Added by sephora-jsx-loader.js
RewardSampleQuickLookModalClass.prototype.classRef = RewardSampleQuickLookModalClass;
// Added by sephora-jsx-loader.js
Object.assign(RewardSampleQuickLookModalClass, RewardSampleQuickLookModal);
// Added by sephora-jsx-loader.js
module.exports = RewardSampleQuickLookModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/QuickLookModal/RewardSampleQuickLookModal/RewardSampleQuickLookModal.jsx