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
    Sephora.Util.InflatorComps.Comps['IconCamera'] = function IconCamera(){
        return IconCameraClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconCamera = function () {};

IconCamera.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 32 29'
            width='1.125em'>
            <path d='M1.142 6.7h1.3c1.7 0 3.3-.9 4.1-2.5l1.5-3c.4-.8 1.2-1.2 2-1.2h11.8c.9 0 1.7.5 2 1.2l1.5 3c.8 1.5 2.3 2.5 4.1 2.5h1.3c.6 0 1.1.5 1.1 1.1v20.1c0 .6-.5 1.1-1.1 1.1h-29.6c-.6 0-1.1-.5-1.1-1.1V7.8c0-.6.5-1.1 1.1-1.1zm14.9 19c5 0 9.1-4 9.1-8.9s-4.1-8.9-9.1-8.9-9.1 4-9.1 8.9 4 8.9 9.1 8.9zm0-15.7c3.8 0 6.9 3 6.9 6.7s-3.1 6.7-6.9 6.7-6.9-3-6.9-6.7 3.1-6.7 6.9-6.7z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconCamera.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconCamera.prototype.class = 'IconCamera';
// Added by sephora-jsx-loader.js
IconCamera.prototype.getInitialState = function() {
    IconCamera.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconCamera.prototype.render = wrapComponentRender(IconCamera.prototype.render);
// Added by sephora-jsx-loader.js
var IconCameraClass = React.createClass(IconCamera.prototype);
// Added by sephora-jsx-loader.js
IconCameraClass.prototype.classRef = IconCameraClass;
// Added by sephora-jsx-loader.js
Object.assign(IconCameraClass, IconCamera);
// Added by sephora-jsx-loader.js
module.exports = IconCameraClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconCamera.jsx