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
    Sephora.Util.InflatorComps.Comps['IconPlay'] = function IconPlay(){
        return IconPlayClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconPlay = function () {};

IconPlay.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 32 32'>
            <path d='M16 32C7.2 32 0 24.8 0 16S7.2 0 16 0s16 7.2 16 16-7.2 16-16 16zm0-30C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm-2.5 20.6c-.2 0-.5-.1-.7-.2-.5-.3-.8-.8-.8-1.3V10.9c0-.5.3-1.1.8-1.3.5-.3 1.1-.2 1.5 0l8 5.1c.4.3.7.8.7 1.3s-.3 1-.7 1.3l-8 5.1c-.2.1-.5.2-.8.2z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconPlay.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconPlay.prototype.class = 'IconPlay';
// Added by sephora-jsx-loader.js
IconPlay.prototype.getInitialState = function() {
    IconPlay.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconPlay.prototype.render = wrapComponentRender(IconPlay.prototype.render);
// Added by sephora-jsx-loader.js
var IconPlayClass = React.createClass(IconPlay.prototype);
// Added by sephora-jsx-loader.js
IconPlayClass.prototype.classRef = IconPlayClass;
// Added by sephora-jsx-loader.js
Object.assign(IconPlayClass, IconPlay);
// Added by sephora-jsx-loader.js
module.exports = IconPlayClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconPlay.jsx