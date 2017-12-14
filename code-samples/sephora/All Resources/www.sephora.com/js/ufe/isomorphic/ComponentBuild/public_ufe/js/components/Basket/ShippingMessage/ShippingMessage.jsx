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
    Sephora.Util.InflatorComps.Comps['ShippingMessage'] = function ShippingMessage(){
        return ShippingMessageClass;
    }
}
const Text = require('components/Text/Text');

const ShippingMessage = function () {
    this.state = {
        basket: {
            basketLevelMessages: [{
                messages: {
                    0: ''
                }
            }]
        }
    };
};

ShippingMessage.prototype.render = function () {
    let basket = this.state.basket;

    let message = null;

    if (Array.isArray(basket.realTimeVIBMessages) &&
            basket.realTimeVIBMessages.length > 0) {
        message = basket.realTimeVIBMessages[0];
    } else if (basket.basketLevelMessages) {
        message = basket.basketLevelMessages[0].messages[0];
    }

    return message ?
        <Text
            {...this.props}
            is='p'
            fontWeight={700}
            dangerouslySetInnerHTML={{
                __html: message
            }} />
    : null;
};


// Added by sephora-jsx-loader.js
ShippingMessage.prototype.path = 'Basket/ShippingMessage';
// Added by sephora-jsx-loader.js
Object.assign(ShippingMessage.prototype, require('./ShippingMessage.c.js'));
var originalDidMount = ShippingMessage.prototype.componentDidMount;
ShippingMessage.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: ShippingMessage');
if (originalDidMount) originalDidMount.apply(this);
if (ShippingMessage.prototype.ctrlr) ShippingMessage.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: ShippingMessage');
// Added by sephora-jsx-loader.js
ShippingMessage.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
ShippingMessage.prototype.class = 'ShippingMessage';
// Added by sephora-jsx-loader.js
ShippingMessage.prototype.getInitialState = function() {
    ShippingMessage.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ShippingMessage.prototype.render = wrapComponentRender(ShippingMessage.prototype.render);
// Added by sephora-jsx-loader.js
var ShippingMessageClass = React.createClass(ShippingMessage.prototype);
// Added by sephora-jsx-loader.js
ShippingMessageClass.prototype.classRef = ShippingMessageClass;
// Added by sephora-jsx-loader.js
Object.assign(ShippingMessageClass, ShippingMessage);
// Added by sephora-jsx-loader.js
module.exports = ShippingMessageClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/ShippingMessage/ShippingMessage.jsx