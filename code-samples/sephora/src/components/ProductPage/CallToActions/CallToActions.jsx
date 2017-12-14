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
    Sephora.Util.InflatorComps.Comps['CallToActions'] = function CallToActions(){
        return CallToActionsClass;
    }
}
const {
 colors, space, zIndex 
} = require('style');
const { Box } = require('components/display');
const skuUtils = require('utils/Sku');
const Flash = require('components/ProductPage/CallToActions/Type/Flash/Flash');
const Reward = require('components/ProductPage/CallToActions/Type/Reward/Reward');
const Play = require('components/ProductPage/CallToActions/Type/Play/Play');
const AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton');
const ADD_BUTTON_TYPE = require('utils/Basket').ADD_TO_BASKET_TYPES;
const ButtonRed = require('components/Button/ButtonRed');
const ProductLove = require('components/Product/ProductLove/ProductLove');
const ProductLoveButton = require('components/Product/ProductLove/ProductLoveButton/ProductLoveButton');
const BiQualify = require('components/BiQualify/BiQualify');
const OutOfStockButton = require('components/AddToBasketButton/OutOfStockButton/OutOfStockButton');
const analyticsConsts = require('analytics/constants');
const certonaDataAt = require('utils/certona').CERTONA_DATA_AT_VALUES;

const CallToActions = function () {
    this.state = { customSetsChoices: [] };
};

CallToActions.prototype.render = function () {
    const currentProduct = this.props;
    const { currentSku } = currentProduct;

    let currentSkuType = skuUtils.getProductType(currentSku);

    let content;
    let isCustomSetsProduct = skuUtils.isCustomSetsSingleSkuProduct(currentProduct) ||
            skuUtils.isCustomSetsGroupedSkuProduct(currentProduct);
    switch (currentSkuType) {
        case skuUtils.skuTypes.FLASH:
            content = <Flash {...currentProduct} />;
            break;
        case skuUtils.skuTypes.SUBSCRIPTION:
            content = <Play {...currentProduct} />;
            break;
        case skuUtils.skuTypes.REWARD:
            content = <Reward
                    basket={this.props.basket}
                    currentProduct={currentProduct} />;
            break;
        default:
            content = isCustomSetsProduct ?
                this.getCustomSetButton(currentSku, currentProduct)
                :
                <div>
                    {skuUtils.isBiExclusive(currentSku) &&
                        <BiQualify
                            fontSize={Sephora.isMobile() ? 'h4' : 'h5'}
                            marginBottom={space[2]}
                            currentSku={currentSku} />
                    }
                    {this.getBasketButton(currentSkuType)}
                    {this.getLoveButton(currentSku)}
                </div>;
            break;
    }

    let readyToDisplay = this.props.isUserSpecificReady;

    return readyToDisplay ?(
        <Box
            _css={Sephora.isMobile() ? {
                textAlign: 'center',
                position: 'fixed',
                zIndex: zIndex.HEADER,
                backfaceVisibility: 'hidden',
                right: 0,
                bottom: 0,
                left: 0,
                padding: space[4],
                backgroundColor: colors.white,
                boxShadow: '0 -2px 8px 0 rgba(0,0,0,0.10)'
            } : {}}>
            {content}
        </Box>
    ) : <div/>;
};

CallToActions.prototype.getBasketButton = function () {
    let currentProduct = this.props;
    let {
        currentSku,
        currentSkuQuantity
    } = currentProduct;
    return <AddToBasketButton
            data-certona={certonaDataAt.addToBasket}
            product={currentProduct}
            productId={currentProduct.productId}
            block={true}
            quantity={currentSkuQuantity}
            sku={currentSku}
            type={ADD_BUTTON_TYPE.RED}
            disabled={skuUtils.isProductDisabled(currentSku)}
            analyticsContext={analyticsConsts.CONTEXT.BASKET_PRODUCT} />;
};

CallToActions.prototype.getLoveButton = function (currentSku, isCustomSetsProduct) {
    return Sephora.isDesktop() && !skuUtils.isSample(currentSku) &&
        <Box
            marginTop={space[2]}>
            <ProductLove
                skuId={currentSku.skuId}
                customSetsChoices={isCustomSetsProduct ? this.state.customSetsChoices : null}
                loveSource='productPage'>
                <ProductLoveButton
                    currentSku={currentSku}
                    isCustomSetsProduct={isCustomSetsProduct}
                    block={true}
                    disabled={!skuUtils.isLoveEligible(currentSku)} />
            </ProductLove>
        </Box>;
};

CallToActions.prototype.getCustomSetButton = function (currentSku, currentProduct) {
    let disableCustomSetsAddToBasket = skuUtils.isProductDisabled(currentSku) ||
        !this.state.customSetsChoices.length;
    return Sephora.isMobile() ?
        (currentSku.isOutOfStock ?
            <OutOfStockButton
                product={currentProduct}
                width='100%'
                sku={currentSku} /> :
            <ButtonRed
                block={true}
                onClick={this.openCustomSets}>
                Choose Your Items
            </ButtonRed>)
        :
        <Box>
            {currentSku.isOutOfStock ?
                <OutOfStockButton
                    product={currentProduct}
                    width='100%'
                    sku={currentSku} /> :
                <ButtonRed
                    block={true}
                    disabled={disableCustomSetsAddToBasket}
                    onClick={this.props.addCustomSets}
                    letterSpacing={0}>
                    Add all to Basket
                </ButtonRed>}
            {this.getLoveButton(currentSku, false, true)}
        </Box>;
};


// Added by sephora-jsx-loader.js
CallToActions.prototype.path = 'ProductPage/CallToActions';
// Added by sephora-jsx-loader.js
Object.assign(CallToActions.prototype, require('./CallToActions.c.js'));
var originalDidMount = CallToActions.prototype.componentDidMount;
CallToActions.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CallToActions');
if (originalDidMount) originalDidMount.apply(this);
if (CallToActions.prototype.ctrlr) CallToActions.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CallToActions');
// Added by sephora-jsx-loader.js
CallToActions.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CallToActions.prototype.class = 'CallToActions';
// Added by sephora-jsx-loader.js
CallToActions.prototype.getInitialState = function() {
    CallToActions.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CallToActions.prototype.render = wrapComponentRender(CallToActions.prototype.render);
// Added by sephora-jsx-loader.js
var CallToActionsClass = React.createClass(CallToActions.prototype);
// Added by sephora-jsx-loader.js
CallToActionsClass.prototype.classRef = CallToActionsClass;
// Added by sephora-jsx-loader.js
Object.assign(CallToActionsClass, CallToActions);
// Added by sephora-jsx-loader.js
module.exports = CallToActionsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/CallToActions/CallToActions.jsx