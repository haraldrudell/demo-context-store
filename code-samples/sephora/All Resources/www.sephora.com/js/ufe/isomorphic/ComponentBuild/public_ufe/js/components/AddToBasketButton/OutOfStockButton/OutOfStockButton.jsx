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
    Sephora.Util.InflatorComps.Comps['OutOfStockButton'] = function OutOfStockButton(){
        return OutOfStockButtonClass;
    }
}
const Button = require('components/Button/Button');
const ButtonOutline = require('components/Button/ButtonOutline');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonRed = require('components/Button/ButtonRed');
const basketUtils = require('utils/Basket');
const skuUtils = require('utils/Sku');
const Text = require('components/Text/Text');

const OutOfStockButton = function () {};

OutOfStockButton.prototype.render = function () {
    const {
        sku,
        type,
        ...props
    } = this.props;
    let currentSkuType = skuUtils.getProductType(this.props.sku);
    let isPlay = currentSkuType === skuUtils.skuTypes.SUBSCRIPTION;
    let comingSoonText = (sku.isComingSoonTreatment && !isPlay) && 'Coming Soon';
    let oosButtonText = isPlay ?
        'Subscriptions Full' :
        (skuUtils.isBiReward(sku) ? 'Sold Out' : 'Out of Stock');

    const isOutlineButton = type === basketUtils.ADD_TO_BASKET_TYPES.OUTLINE;
    let StockButton = isOutlineButton ? ButtonOutline : ButtonPrimary;

    if (sku.actionFlags && sku.isWithBackInStockTreatment) {
        return (
            <StockButton
                {...props}
                sku={sku}
                onClick={this.emailMeButtonHandler}
                padding='.375em'
                lineHeight='1.125'
                letterSpacing={0}>
                <Text
                    display='block'
                    fontSize='.9375em'
                    fontWeight={400}>
                    {comingSoonText || oosButtonText}
                </Text>
                <Text>{skuUtils.getEmailMeText(sku)}</Text>
            </StockButton>
        );
    } else {
        if (isOutlineButton) {
            StockButton = ButtonPrimary;
        }
        return (
            <StockButton
                {...props}
                sku={sku}
                disabled>
                {comingSoonText || oosButtonText}
            </StockButton>
        );
    }
};


// Added by sephora-jsx-loader.js
OutOfStockButton.prototype.path = 'AddToBasketButton/OutOfStockButton';
// Added by sephora-jsx-loader.js
Object.assign(OutOfStockButton.prototype, require('./OutOfStockButton.c.js'));
var originalDidMount = OutOfStockButton.prototype.componentDidMount;
OutOfStockButton.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: OutOfStockButton');
if (originalDidMount) originalDidMount.apply(this);
if (OutOfStockButton.prototype.ctrlr) OutOfStockButton.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: OutOfStockButton');
// Added by sephora-jsx-loader.js
OutOfStockButton.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
OutOfStockButton.prototype.class = 'OutOfStockButton';
// Added by sephora-jsx-loader.js
OutOfStockButton.prototype.getInitialState = function() {
    OutOfStockButton.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
OutOfStockButton.prototype.render = wrapComponentRender(OutOfStockButton.prototype.render);
// Added by sephora-jsx-loader.js
var OutOfStockButtonClass = React.createClass(OutOfStockButton.prototype);
// Added by sephora-jsx-loader.js
OutOfStockButtonClass.prototype.classRef = OutOfStockButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(OutOfStockButtonClass, OutOfStockButton);
// Added by sephora-jsx-loader.js
module.exports = OutOfStockButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/AddToBasketButton/OutOfStockButton/OutOfStockButton.jsx