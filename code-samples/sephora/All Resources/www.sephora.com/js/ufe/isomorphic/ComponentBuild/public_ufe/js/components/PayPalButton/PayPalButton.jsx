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
    Sephora.Util.InflatorComps.Comps['PayPalButton'] = function PayPalButton(){
        return PayPalButtonClass;
    }
}
const css = require('glamor').css;
const space = require('style').space;
const ButtonOutline = require('components/Button/ButtonOutline');
const Text = require('components/Text/Text');
const Image = require('components/Image/Image');
const PayPal = require('utils/PayPal');

const PayPalButton = function () {
    this.state = {};
};

PayPalButton.prototype.render = function () {
    const {
        hasText,
        isPaypalPayment,
        ...props
    } = this.props;
    let isDisabled = isPaypalPayment === PayPal.TYPES.DISABLED;
    return isPaypalPayment !== PayPal.TYPES.HIDDEN ?
    <ButtonOutline
        {...props}
        size='lg'
        onClick={this.checkoutWithPayPal}
        disabled={isDisabled}
        paddingY='0px'>
        {hasText &&
            <Text
                marginRight={space[3]}
                verticalAlign='middle'>
                Pay With
            </Text>
        }
        <Image
            width={98}
            height={24}
            src='/img/ufe/logo-paypal.svg'
            verticalAlign='middle' />
        <span
            id='paypal-container'
            className={css({
                display: 'none'
            })} />
    </ButtonOutline> : null;
};


// Added by sephora-jsx-loader.js
PayPalButton.prototype.path = 'PayPalButton';
// Added by sephora-jsx-loader.js
Object.assign(PayPalButton.prototype, require('./PayPalButton.c.js'));
var originalDidMount = PayPalButton.prototype.componentDidMount;
PayPalButton.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PayPalButton');
if (originalDidMount) originalDidMount.apply(this);
if (PayPalButton.prototype.ctrlr) PayPalButton.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PayPalButton');
// Added by sephora-jsx-loader.js
PayPalButton.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PayPalButton.prototype.class = 'PayPalButton';
// Added by sephora-jsx-loader.js
PayPalButton.prototype.getInitialState = function() {
    PayPalButton.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PayPalButton.prototype.render = wrapComponentRender(PayPalButton.prototype.render);
// Added by sephora-jsx-loader.js
var PayPalButtonClass = React.createClass(PayPalButton.prototype);
// Added by sephora-jsx-loader.js
PayPalButtonClass.prototype.classRef = PayPalButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(PayPalButtonClass, PayPalButton);
// Added by sephora-jsx-loader.js
module.exports = PayPalButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/PayPalButton/PayPalButton.jsx