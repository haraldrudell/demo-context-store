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
    Sephora.Util.InflatorComps.Comps['ActionButtons'] = function ActionButtons(){
        return ActionButtonsClass;
    }
}
const {
 space 
} = require('style');
const CheckoutButton = require('components/CheckoutButton/CheckoutButton');
const ApplePayButton = require('components/ApplePayButton/ApplePayButton');
const PayPalButton = require('components/PayPalButton/PayPalButton');
const Grid = require('components/Grid/Grid');
const ApplePay = require('services/ApplePay');
const PayPal = require('utils/PayPal');

const ACTION_TYPES = {
    ONLY_REGULAR: 'ONLY_REGULAR',
    ONLY_PAYPAL: 'ONLY_PAYPAL',
    ONLY_APPLE_PAY: 'ONLY_APPLE_PAY',
    ALL_BUTTONS: 'ALL_BUTTONS',
    DESKTOP: 'DESKTOP',
    DESKTOP_NO_PAYPAL: 'DESKTOP_NO_PAYPAL'
};

let ActionButtons = function () {
    this.state = {};
};

ActionButtons.prototype.render = function () {
    let isPaypalPayment = this.props.isPaypalPayment;
    let isApplePayPayment = this.props.isApplePayPayment;
    let type;
    if (Sephora.isMobile()) {
        type = isApplePayPayment !== ApplePay.TYPES.HIDDEN ?
            (isPaypalPayment !== PayPal.TYPES.HIDDEN ? ACTION_TYPES.ALL_BUTTONS :
                ACTION_TYPES.ONLY_APPLE_PAY) :
            (isPaypalPayment !== PayPal.TYPES.HIDDEN ? ACTION_TYPES.ONLY_PAYPAL :
                ACTION_TYPES.ONLY_REGULAR);
    } else {
        type = isPaypalPayment !== PayPal.TYPES.HIDDEN ? ACTION_TYPES.DESKTOP :
            ACTION_TYPES.DESKTOP_NO_PAYPAL;
    }

    switch (type) {
    case ACTION_TYPES.DESKTOP_NO_PAYPAL:
        return (
                <div>
                    <CheckoutButton block={true} />
                </div>
        );
    case ACTION_TYPES.DESKTOP:
        return (
                <div>
                    <CheckoutButton block={true} />
                    <PayPalButton
                        isPaypalPayment={isPaypalPayment}
                        hasText={true}
                        block={true}
                        marginTop={space[2]} />

                </div>
        );
    case ACTION_TYPES.ALL_BUTTONS:
        return (
                <div>
                    <CheckoutButton
                        block={true}>
                        Continue to Checkout
                    </CheckoutButton>
                    <PayPalButton
                        isPaypalPayment={isPaypalPayment}
                        hasText={true}
                        block={true}
                        marginY={space[2]} />
                    <ApplePayButton
                        isApplePayPayment= {isApplePayPayment}
                        default={true}
                        block={true} />
                </div>
        );
    case ACTION_TYPES.ONLY_PAYPAL:
        return (
                <Grid gutter={space[3]}>
                    <Grid.Cell width={1 / 2}>
                        <PayPalButton block={true} isPaypalPayment={isPaypalPayment} />
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <CheckoutButton block={true} />
                    </Grid.Cell>
                </Grid>
        );
    case ACTION_TYPES.ONLY_APPLE_PAY:
        return (
                <Grid gutter={space[3]}>
                    <Grid.Cell width={1 / 2}>
                        <CheckoutButton block={true} />
                    </Grid.Cell>
                    <Grid.Cell width={1 / 2}>
                        <ApplePayButton
                            isApplePayPayment={isApplePayPayment}
                            block={true} >
                        Apple Pay
                    </ApplePayButton>
                    </Grid.Cell>
                </Grid>
        );
    default:
        return (
                <CheckoutButton
                    block={true}>
                    Checkout
                </CheckoutButton>
        );

    }

};


// Added by sephora-jsx-loader.js
ActionButtons.prototype.path = 'Basket/ActionButtons';
// Added by sephora-jsx-loader.js
Object.assign(ActionButtons.prototype, require('./ActionButtons.c.js'));
var originalDidMount = ActionButtons.prototype.componentDidMount;
ActionButtons.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ActionButtons');
if (originalDidMount) originalDidMount.apply(this);
if (ActionButtons.prototype.ctrlr) ActionButtons.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ActionButtons');
// Added by sephora-jsx-loader.js
ActionButtons.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ActionButtons.prototype.class = 'ActionButtons';
// Added by sephora-jsx-loader.js
ActionButtons.prototype.getInitialState = function() {
    ActionButtons.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ActionButtons.prototype.render = wrapComponentRender(ActionButtons.prototype.render);
// Added by sephora-jsx-loader.js
var ActionButtonsClass = React.createClass(ActionButtons.prototype);
// Added by sephora-jsx-loader.js
ActionButtonsClass.prototype.classRef = ActionButtonsClass;
// Added by sephora-jsx-loader.js
Object.assign(ActionButtonsClass, ActionButtons);
// Added by sephora-jsx-loader.js
module.exports = ActionButtonsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/ActionButtons/ActionButtons.jsx