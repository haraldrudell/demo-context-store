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
    Sephora.Util.InflatorComps.Comps['RewardItem'] = function RewardItem(){
        return RewardItemClass;
    }
}
/* eslint-disable max-len */
const { lineHeights, space } = require('style');
const { Box, Flex, Text } = require('components/display');
const ProductDisplayName = require('components/Product/ProductDisplayName/ProductDisplayName');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ProductQuicklook = require('components/Product/ProductQuicklook/ProductQuicklook');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ButtonOutline = require('components/Button/ButtonOutline');
const ProductBadges = require('components/Product/ProductBadges/ProductBadges');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const urlUtils = require('utils/Url');
const skuUtils = require('utils/Sku');
const userUtils = require('utils/User');
const anaConstants = require('analytics/constants');
const ButtonPrimary = require('components/Button/ButtonPrimary');

const RewardItem = function () {
    this.state = {
        hover: false,
        isInBasket: false,
        isRewardDisabled: true
    };
};

RewardItem.prototype.render = function () {

    const isLink = this.props.targetUrl && this.props.isLink;

    const Comp = isLink ? 'a' : 'div';

    let currentSku = Object.assign({}, this.props);

    const isShortButton =
        Sephora.isMobile() ||
        this.props.isShortButton ||
        (currentSku && (currentSku.imageSize === IMAGE_SIZES[97]));

    const isDisabled = () =>
        !this.state.isInBasket && (!this.props.isEligible || this.state.isRewardDisabled);

    return (
        <Flex
            is={Comp}
            flexDirection='column'
            width={1}
            textAlign='center'
            href={isLink ? urlUtils.addInternalTracking(
                currentSku.targetUrl,
                [currentSku.rootContainerName, currentSku.productId, 'product']
            ) : null}>
            <Box
                position='relative'>
                <Box
                    marginX='auto'
                    position='relative'
                    maxWidth={currentSku.imageSize}
                    onMouseEnter={this.toggleHover}
                    onMouseLeave={this.toggleHover}>
                    <ProductImage
                        skuImages={currentSku.skuImages}
                        size={currentSku.imageSize}
                        disableLazyLoad={currentSku.disableLazyLoad} />

                    <Box
                        position='absolute'
                        top={Sephora.isTouch ? 0 : null}
                        right={0} bottom={0} left={0}
                        transition='opacity .15s'
                        style={{
                            opacity: this.state.hover ? 1 : 0
                        }}>
                        <ProductQuicklook
                            productId={currentSku.productId}
                            skuId={currentSku.skuId}
                            skuType={skuUtils.skuTypes.REWARD}
                            sku={currentSku}
                            rootContainerName={currentSku.rootContainerName} />
                    </Box>
                </Box>

                <Flex
                    justifyContent='center'
                    alignItems='center'
                    fontWeight={700}
                    fontSize='h6'
                    textTransform='lowercase'
                    height={space[5]}
                    whiteSpace='nowrap'>
                    {
                        this.props.isLimitedQuantity ? 'Limited Supply' :
                        this.props.isGoingFast ? 'Going Fast' : null
                    }
                </Flex>

                <ProductDisplayName
                    numberOfLines={4}
                    brandName={currentSku.brandName}
                    productName={currentSku.productName}
                    atPrefix='reward'
                    isHovered={this.state.hover && isLink} />

                <Box
                    fontSize='h5'
                    lineHeight={2}
                    marginTop={space[1]}>
                    <Box
                        fontWeight={700}
                        data-at={Sephora.debug.dataAt('reward_type')}>
                        {skuUtils.isFree(currentSku)
                            ? 'FREE'
                            : currentSku.biType.toLowerCase()
                        }
                    </Box>
                    {currentSku.valuePrice && currentSku.valuePrice}
                </Box>


            </Box>

            {(currentSku.isUseAddToBasket || currentSku.isUseWriteReview) &&
                <Box
                    paddingTop={space[3]}
                    paddingBottom={space[1]}
                    marginTop='auto'>
                    {currentSku.isUseAddToBasket ?
                        userUtils.isAnonymous() ?
                            <ButtonOutline
                                size='sm'
                                onClick={e => this.signInHandler(e)}>
                                Sign in to access
                            </ButtonOutline>
                        :
                            <AddToBasketButton
                                analyticsContext={anaConstants.CONTEXT.BASKET_REWARDS}
                                quantity={1}
                                sku={this.props.isShowAddFullSize ? currentSku.fullSizeSku : currentSku}
                                type={this.state.isInBasket ?
                                    ADD_BUTTON_TYPE.MUTED : ADD_BUTTON_TYPE.OUTLINE}
                                disabled={this.props.isShowAddFullSize ? false : isDisabled()}
                                text={this.props.isShowAddFullSize ? 'Add Full Size' : !this.state.isInBasket ?
                                    ('Add' + (!isShortButton ? ' to Basket' : ''))
                                    : 'Remove'
                                } />
                    :
                        <ButtonPrimary
                            size='sm'
                            href={currentSku.targetUrl}>
                            Write A Review
                        </ButtonPrimary>
                    }
                </Box>
            }

        </Flex>
    );
};


// Added by sephora-jsx-loader.js
RewardItem.prototype.path = 'Reward/RewardItem';
// Added by sephora-jsx-loader.js
Object.assign(RewardItem.prototype, require('./RewardItem.c.js'));
var originalDidMount = RewardItem.prototype.componentDidMount;
RewardItem.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: RewardItem');
if (originalDidMount) originalDidMount.apply(this);
if (RewardItem.prototype.ctrlr) RewardItem.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: RewardItem');
// Added by sephora-jsx-loader.js
RewardItem.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
RewardItem.prototype.class = 'RewardItem';
// Added by sephora-jsx-loader.js
RewardItem.prototype.getInitialState = function() {
    RewardItem.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
RewardItem.prototype.render = wrapComponentRender(RewardItem.prototype.render);
// Added by sephora-jsx-loader.js
var RewardItemClass = React.createClass(RewardItem.prototype);
// Added by sephora-jsx-loader.js
RewardItemClass.prototype.classRef = RewardItemClass;
// Added by sephora-jsx-loader.js
Object.assign(RewardItemClass, RewardItem);
// Added by sephora-jsx-loader.js
module.exports = RewardItemClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Reward/RewardItem/RewardItem.jsx