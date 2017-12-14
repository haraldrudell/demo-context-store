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
    Sephora.Util.InflatorComps.Comps['IconPinterest'] = function IconPinterest(){
        return IconPinterestClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconPinterest = function () {};

IconPinterest.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 125 125'>
            <path d='M62.5 12.5c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 93.4c-4.4 0-8.7-.6-12.8-1.9 1.8-2.8 4.4-7.6 5.4-11.4.5-2 2.7-10.3 2.7-10.3 1.4 2.7 5.6 4.9 9.9 4.9 13.1 0 22.5-12 22.5-26.9 0-14.3-11.7-25.1-26.7-25.1-18.7 0-28.6 12.5-28.6 26.2 0 6.3 3.4 14.3 8.8 16.7.8.4 1.3.2 1.5-.6.1-.6.8-3.6 1.2-4.9.1-.4.1-.8-.3-1.3-1.8-2.2-3.3-6.2-3.3-9.9 0-9.6 7.3-18.8 19.6-18.8 10.6 0 18.1 7.3 18.1 17.6 0 11.7-5.9 19.8-13.6 19.8-4.2 0-7.5-3.5-6.4-7.8C61.7 67 64 61.4 64 57.8c0-3.4-1.8-6.1-5.5-6.1-4.3 0-7.8 4.5-7.8 10.5 0 3.8 1.3 6.4 1.3 6.4S47.7 87 46.8 90.4c-.8 3.8-.5 8.9-.1 12.4-16.1-6.3-27.6-22-27.6-40.3 0-23.9 19.4-43.4 43.4-43.4 23.9 0 43.4 19.4 43.4 43.4 0 23.9-19.5 43.4-43.4 43.4z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconPinterest.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconPinterest.prototype.class = 'IconPinterest';
// Added by sephora-jsx-loader.js
IconPinterest.prototype.getInitialState = function() {
    IconPinterest.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconPinterest.prototype.render = wrapComponentRender(IconPinterest.prototype.render);
// Added by sephora-jsx-loader.js
var IconPinterestClass = React.createClass(IconPinterest.prototype);
// Added by sephora-jsx-loader.js
IconPinterestClass.prototype.classRef = IconPinterestClass;
// Added by sephora-jsx-loader.js
Object.assign(IconPinterestClass, IconPinterest);
// Added by sephora-jsx-loader.js
module.exports = IconPinterestClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconPinterest.jsx