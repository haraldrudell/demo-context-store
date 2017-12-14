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
    Sephora.Util.InflatorComps.Comps['IconCheckmark'] = function IconCheckmark(){
        return IconCheckmarkClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconCheckmark = function () {};

IconCheckmark.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 11 8'
            width='1.375em'>
            <path d='M1.3 3.6L0 4.8 3.4 8 11 1.2 9.7 0 3.4 5.6'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconCheckmark.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconCheckmark.prototype.class = 'IconCheckmark';
// Added by sephora-jsx-loader.js
IconCheckmark.prototype.getInitialState = function() {
    IconCheckmark.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconCheckmark.prototype.render = wrapComponentRender(IconCheckmark.prototype.render);
// Added by sephora-jsx-loader.js
var IconCheckmarkClass = React.createClass(IconCheckmark.prototype);
// Added by sephora-jsx-loader.js
IconCheckmarkClass.prototype.classRef = IconCheckmarkClass;
// Added by sephora-jsx-loader.js
Object.assign(IconCheckmarkClass, IconCheckmark);
// Added by sephora-jsx-loader.js
module.exports = IconCheckmarkClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconCheckmark.jsx