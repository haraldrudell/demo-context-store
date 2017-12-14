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
    Sephora.Util.InflatorComps.Comps['IconBasket'] = function IconBasket(){
        return IconBasketClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconBasket = function () {};

IconBasket.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 24 22'
            width='1.125em'>
            <path d='M23 7.66h-2.84a1 1 0 0 0-.08-.12l-7.15-7a1 1 0 0 0-.15-.25 1.17 1.17 0 0 0-1.55 0 1 1 0 0 0-.15.22l-7.16 7a1 1 0 0 0-.09.13H1a1 1 0 1 0 0 2h22a1 1 0 1 0 0-1.98zM12 2.5l5.25 5.16H6.75zM18.78 15.85H5.22a1 1 0 1 0 0 2h13.56a1 1 0 1 0 0-2zM20.87 11.76H3.13a1 1 0 1 0 0 2h17.74a1 1 0 1 0 0-2zM16.7 20H7.3a1 1 0 1 0 0 2h9.4a1 1 0 1 0 0-2z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconBasket.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconBasket.prototype.class = 'IconBasket';
// Added by sephora-jsx-loader.js
IconBasket.prototype.getInitialState = function() {
    IconBasket.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconBasket.prototype.render = wrapComponentRender(IconBasket.prototype.render);
// Added by sephora-jsx-loader.js
var IconBasketClass = React.createClass(IconBasket.prototype);
// Added by sephora-jsx-loader.js
IconBasketClass.prototype.classRef = IconBasketClass;
// Added by sephora-jsx-loader.js
Object.assign(IconBasketClass, IconBasket);
// Added by sephora-jsx-loader.js
module.exports = IconBasketClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconBasket.jsx