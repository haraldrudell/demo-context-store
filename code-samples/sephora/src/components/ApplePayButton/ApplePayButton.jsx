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
    Sephora.Util.InflatorComps.Comps['ApplePayButton'] = function ApplePayButton(){
        return ApplePayButtonClass;
    }
}
const {
    space
} = require('style');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ApplePay = require('services/ApplePay');
const Flex = require('components/Flex/Flex');
const Text = require('components/Text/Text');
const Image = require('components/Image/Image');

const ApplePayButton = function () {
    this.state = {};
};

ApplePayButton.prototype.render = function () {
    let isApplePayPayment = this.props.isApplePayPayment;
    let isDisabled = isApplePayPayment === ApplePay.TYPES.DISABLED;
    return isApplePayPayment !== ApplePay.TYPES.HIDDEN ?
        <ButtonPrimary onClick={this.onClick}
            size='lg'
            disabled={isDisabled}
            {...this.props}>
            {
                this.props.default ?
                    <Flex
                        isInline={true}
                        alignItems='center'>
                        <Text
                            marginRight={space[2]}
                            fontWeight={400}
                            letterSpacing={0}
                            textTransform='none'>
                            Buy with
                        </Text>
                        <Image
                            src='/img/ufe/logo-apple-pay.svg'
                            width={42}
                            height={20} />
                    </Flex> :
                    this.props.children
            }
        </ButtonPrimary> : <div></div>;

};


// Added by sephora-jsx-loader.js
ApplePayButton.prototype.path = 'ApplePayButton';
// Added by sephora-jsx-loader.js
Object.assign(ApplePayButton.prototype, require('./ApplePayButton.c.js'));
var originalDidMount = ApplePayButton.prototype.componentDidMount;
ApplePayButton.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ApplePayButton');
if (originalDidMount) originalDidMount.apply(this);
if (ApplePayButton.prototype.ctrlr) ApplePayButton.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ApplePayButton');
// Added by sephora-jsx-loader.js
ApplePayButton.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ApplePayButton.prototype.class = 'ApplePayButton';
// Added by sephora-jsx-loader.js
ApplePayButton.prototype.getInitialState = function() {
    ApplePayButton.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ApplePayButton.prototype.render = wrapComponentRender(ApplePayButton.prototype.render);
// Added by sephora-jsx-loader.js
var ApplePayButtonClass = React.createClass(ApplePayButton.prototype);
// Added by sephora-jsx-loader.js
ApplePayButtonClass.prototype.classRef = ApplePayButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(ApplePayButtonClass, ApplePayButton);
// Added by sephora-jsx-loader.js
module.exports = ApplePayButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ApplePayButton/ApplePayButton.jsx