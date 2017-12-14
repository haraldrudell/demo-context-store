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
    Sephora.Util.InflatorComps.Comps['IconShare'] = function IconShare(){
        return IconShareClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconShare = function () {};

IconShare.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 32 30'
            width='1.067em'>
            <path d='M10 18h-.3c-.4-.2-.7-.6-.7-1C9 8.5 13.6 4.3 23 4V1c0-.4.2-.8.6-.9.4-.2.8-.1 1.1.2l7 7c.4.4.4 1 0 1.4l-7 7c-.3.3-.7.4-1.1.2-.4-.1-.6-.5-.6-.9v-3c-5.7.1-8.9.4-12.1 5.5-.2.3-.6.5-.9.5zM25 3.4V5c0 .6-.4 1-1 1-7.5 0-11.6 2.4-12.7 7.6C14.8 10.1 18.8 10 24 10c.2 0 .5.1.7.3.2.2.3.4.3.7v1.6L29.6 8 25 3.4z'/><path d='M25.5 30h-23C1.1 30 0 28.9 0 27.5v-17C0 9.1 1.1 8 2.5 8H7c.6 0 1 .4 1 1s-.4 1-1 1H2.5c-.3 0-.5.2-.5.5v17c0 .3.2.5.5.5h23c.3 0 .5-.2.5-.5V18c0-.6.4-1 1-1s1 .4 1 1v9.5c0 1.4-1.1 2.5-2.5 2.5z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconShare.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconShare.prototype.class = 'IconShare';
// Added by sephora-jsx-loader.js
IconShare.prototype.getInitialState = function() {
    IconShare.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconShare.prototype.render = wrapComponentRender(IconShare.prototype.render);
// Added by sephora-jsx-loader.js
var IconShareClass = React.createClass(IconShare.prototype);
// Added by sephora-jsx-loader.js
IconShareClass.prototype.classRef = IconShareClass;
// Added by sephora-jsx-loader.js
Object.assign(IconShareClass, IconShare);
// Added by sephora-jsx-loader.js
module.exports = IconShareClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconShare.jsx