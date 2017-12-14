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
    Sephora.Util.InflatorComps.Comps['IconTruck'] = function IconTruck(){
        return IconTruckClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconTruck = function () {};

IconTruck.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 22 16'
            width='1.375em'>
            <path d='M19 4h-3V0H2C.9 0 0 .9 0 2v11h2c0 1.7 1.3 3 3 3s3-1.3 3-3h6c0 1.7 1.3 3 3 3s3-1.3 3-3h2V8l-3-4zM5 14.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm13.5-9l2 2.5H16V5.5h2.5zm-1.5 9c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconTruck.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconTruck.prototype.class = 'IconTruck';
// Added by sephora-jsx-loader.js
IconTruck.prototype.getInitialState = function() {
    IconTruck.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconTruck.prototype.render = wrapComponentRender(IconTruck.prototype.render);
// Added by sephora-jsx-loader.js
var IconTruckClass = React.createClass(IconTruck.prototype);
// Added by sephora-jsx-loader.js
IconTruckClass.prototype.classRef = IconTruckClass;
// Added by sephora-jsx-loader.js
Object.assign(IconTruckClass, IconTruck);
// Added by sephora-jsx-loader.js
module.exports = IconTruckClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconTruck.jsx