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
    Sephora.Util.InflatorComps.Comps['IconCameraOutline'] = function IconCameraOutline(){
        return IconCameraOutlineClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconCameraOutline = function () {};

IconCameraOutline.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 32 30'
            width='1.067em'>
            <path d='M29 30H3c-1.7 0-3-1.3-3-3V9c0-1.7 1.3-3 3-3h1.1c.8 0 1.4-.4 1.8-1.1l1.3-2.7C8 .8 9.3 0 10.9 0h10.3c1.5 0 2.9.8 3.6 2.2l1.3 2.7c.3.7 1 1.1 1.8 1.1H29c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3zM3 8c-.5 0-1 .4-1 1v18c0 .6.5 1 1 1h26c.6 0 1-.4 1-1V9c0-.6-.5-1-1-1h-1.1c-1.5 0-2.9-.8-3.6-2.2L23 3.1c-.3-.7-1-1.1-1.8-1.1H10.9c-.8 0-1.4.4-1.8 1.1L7.7 5.8C7 7.2 5.7 8 4.1 8H3z'/><path d='M16 25c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm0-14c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconCameraOutline.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconCameraOutline.prototype.class = 'IconCameraOutline';
// Added by sephora-jsx-loader.js
IconCameraOutline.prototype.getInitialState = function() {
    IconCameraOutline.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconCameraOutline.prototype.render = wrapComponentRender(IconCameraOutline.prototype.render);
// Added by sephora-jsx-loader.js
var IconCameraOutlineClass = React.createClass(IconCameraOutline.prototype);
// Added by sephora-jsx-loader.js
IconCameraOutlineClass.prototype.classRef = IconCameraOutlineClass;
// Added by sephora-jsx-loader.js
Object.assign(IconCameraOutlineClass, IconCameraOutline);
// Added by sephora-jsx-loader.js
module.exports = IconCameraOutlineClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconCameraOutline.jsx