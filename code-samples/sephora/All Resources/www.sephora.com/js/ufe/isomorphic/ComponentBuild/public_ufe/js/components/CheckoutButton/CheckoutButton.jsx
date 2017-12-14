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
    Sephora.Util.InflatorComps.Comps['CheckoutButton'] = function CheckoutButton(){
        return CheckoutButtonClass;
    }
}
const ButtonRed = require('components/Button/ButtonRed');

const CheckoutButton = function () {
    this.state = {
        basket: {
            items: []
        }
    };
};

CheckoutButton.prototype.render = function () {
    const {
        children,
        ...props
    } = this.props;
    let isBasketEmpty = !this.state.basket.items || !this.state.basket.items.length;
    return (
        <ButtonRed
            {...props}
            disabled={isBasketEmpty}
            size='lg'
            onClick={this.checkout}>
            {children ? children : 'Checkout'}
        </ButtonRed>
    );
};


// Added by sephora-jsx-loader.js
CheckoutButton.prototype.path = 'CheckoutButton';
// Added by sephora-jsx-loader.js
Object.assign(CheckoutButton.prototype, require('./CheckoutButton.c.js'));
var originalDidMount = CheckoutButton.prototype.componentDidMount;
CheckoutButton.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CheckoutButton');
if (originalDidMount) originalDidMount.apply(this);
if (CheckoutButton.prototype.ctrlr) CheckoutButton.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CheckoutButton');
// Added by sephora-jsx-loader.js
CheckoutButton.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CheckoutButton.prototype.class = 'CheckoutButton';
// Added by sephora-jsx-loader.js
CheckoutButton.prototype.getInitialState = function() {
    CheckoutButton.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CheckoutButton.prototype.render = wrapComponentRender(CheckoutButton.prototype.render);
// Added by sephora-jsx-loader.js
var CheckoutButtonClass = React.createClass(CheckoutButton.prototype);
// Added by sephora-jsx-loader.js
CheckoutButtonClass.prototype.classRef = CheckoutButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(CheckoutButtonClass, CheckoutButton);
// Added by sephora-jsx-loader.js
module.exports = CheckoutButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/CheckoutButton/CheckoutButton.jsx