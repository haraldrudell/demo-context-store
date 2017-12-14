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
    Sephora.Util.InflatorComps.Comps['IconVenn'] = function IconVenn(){
        return IconVennClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconVenn = function () {};

IconVenn.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 20 13'
            width='1.5385em'>
            <path d='M13.5 0C12.2 0 11 .4 10 1 9 .4 7.8 0 6.5 0 2.9 0 0 2.9 0 6.4c0 3.6 2.9 6.4 6.5 6.4 1.2 0 2.4-.4 3.4-1 1 .7 2.3 1.1 3.6 1.1 3.6 0 6.5-2.9 6.5-6.5C20 2.9 17.1 0 13.5 0zm-7 11.9c-3 0-5.5-2.4-5.5-5.4S3.5 1 6.5 1c.9 0 1.8.2 2.6.7-1.3 1.2-2.2 2.9-2.2 4.8s.8 3.6 2.1 4.7c-.7.4-1.6.7-2.5.7zm3.4-1.2C8.7 9.7 8 8.2 8 6.5s.8-3.2 2-4.2c1.2 1 2 2.5 2 4.2-.1 1.7-.9 3.2-2.1 4.2zm3.6 1.3c-1 0-1.9-.3-2.7-.7 1.4-1.2 2.2-2.9 2.2-4.8s-.8-3.6-2.1-4.8c.7-.4 1.6-.7 2.6-.7 3 0 5.5 2.5 5.5 5.5S16.5 12 13.5 12z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconVenn.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconVenn.prototype.class = 'IconVenn';
// Added by sephora-jsx-loader.js
IconVenn.prototype.getInitialState = function() {
    IconVenn.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconVenn.prototype.render = wrapComponentRender(IconVenn.prototype.render);
// Added by sephora-jsx-loader.js
var IconVennClass = React.createClass(IconVenn.prototype);
// Added by sephora-jsx-loader.js
IconVennClass.prototype.classRef = IconVennClass;
// Added by sephora-jsx-loader.js
Object.assign(IconVennClass, IconVenn);
// Added by sephora-jsx-loader.js
module.exports = IconVennClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconVenn.jsx