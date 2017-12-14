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
    Sephora.Util.InflatorComps.Comps['IconTumblr'] = function IconTumblr(){
        return IconTumblrClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconTumblr = function () {};

IconTumblr.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 125 125'>
            <path d='M75 112.5c10 0 19.9-3.6 23.2-7.9l.7-.9-6.2-18.4c-.1-.2-.2-.3-.4-.3H78.4c-.2 0-.4-.1-.4-.3-.2-.6-.3-1.4-.3-2.3V60c0-.2.2-.4.4-.4h16.3c.2 0 .4-.2.4-.4v-23c0-.2-.2-.4-.4-.4H78.2c-.2 0-.4-.2-.4-.4V12.9c0-.2-.2-.4-.4-.4H48.9c-2 0-4.4 1.5-4.7 4.3-1.4 11.6-6.7 18.5-16.7 21.9l-1.1.3c-.2.1-.3.2-.3.4v19.8c0 .2.2.4.4.4h10.1v24.3c.1 19.4 13.6 28.6 38.4 28.6zm19.1-9.4c-3.1 3-9.5 5.2-15.7 5.3h-.7c-20.2 0-25.6-15.4-25.6-24.5v-28c0-.2-.2-.4-.4-.4H42c-.2 0-.4-.2-.4-.4V42.3c0-.2.1-.3.3-.4 10.4-4.1 16.3-12.1 17.8-24.6.1-.7.7-.7.7-.7h13c.2 0 .4.2.4.4v22.4c0 .2.2.4.4.4h16.2c.2 0 .4.2.4.4V55c0 .2-.2.4-.4.4H74.1c-.2 0-.4.2-.4.4v26.6c.1 6 3 9 8.6 9 2.3 0 4.9-.5 7.2-1.4.2-.1.5 0 .5.3l4.1 12.3c.2.2.1.4 0 .5z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconTumblr.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconTumblr.prototype.class = 'IconTumblr';
// Added by sephora-jsx-loader.js
IconTumblr.prototype.getInitialState = function() {
    IconTumblr.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconTumblr.prototype.render = wrapComponentRender(IconTumblr.prototype.render);
// Added by sephora-jsx-loader.js
var IconTumblrClass = React.createClass(IconTumblr.prototype);
// Added by sephora-jsx-loader.js
IconTumblrClass.prototype.classRef = IconTumblrClass;
// Added by sephora-jsx-loader.js
Object.assign(IconTumblrClass, IconTumblr);
// Added by sephora-jsx-loader.js
module.exports = IconTumblrClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconTumblr.jsx