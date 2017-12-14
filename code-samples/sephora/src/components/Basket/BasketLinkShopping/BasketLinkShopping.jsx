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
    Sephora.Util.InflatorComps.Comps['BasketLinkShopping'] = function BasketLinkShopping(){
        return BasketLinkShoppingClass;
    }
}
const space = require('style').space;
const Link = require('components/Link/Link');

const BasketLinkShopping = function () {};

BasketLinkShopping.prototype.render = function () {
    return (
        <Link
            onClick={this.handleClick}
            arrowDirection='right'
            padding={space[3]}
            margin={-space[3]}>
            Continue shopping
        </Link>
    );
};


// Added by sephora-jsx-loader.js
BasketLinkShopping.prototype.path = 'Basket/BasketLinkShopping';
// Added by sephora-jsx-loader.js
Object.assign(BasketLinkShopping.prototype, require('./BasketLinkShopping.c.js'));
var originalDidMount = BasketLinkShopping.prototype.componentDidMount;
BasketLinkShopping.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BasketLinkShopping');
if (originalDidMount) originalDidMount.apply(this);
if (BasketLinkShopping.prototype.ctrlr) BasketLinkShopping.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BasketLinkShopping');
// Added by sephora-jsx-loader.js
BasketLinkShopping.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BasketLinkShopping.prototype.class = 'BasketLinkShopping';
// Added by sephora-jsx-loader.js
BasketLinkShopping.prototype.getInitialState = function() {
    BasketLinkShopping.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BasketLinkShopping.prototype.render = wrapComponentRender(BasketLinkShopping.prototype.render);
// Added by sephora-jsx-loader.js
var BasketLinkShoppingClass = React.createClass(BasketLinkShopping.prototype);
// Added by sephora-jsx-loader.js
BasketLinkShoppingClass.prototype.classRef = BasketLinkShoppingClass;
// Added by sephora-jsx-loader.js
Object.assign(BasketLinkShoppingClass, BasketLinkShopping);
// Added by sephora-jsx-loader.js
module.exports = BasketLinkShoppingClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Basket/BasketLinkShopping/BasketLinkShopping.jsx