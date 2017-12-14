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
    Sephora.Util.InflatorComps.Comps['IconGoogle'] = function IconGoogle(){
        return IconGoogleClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconGoogle = function () {};

IconGoogle.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 100 100'>
            <path d='M.1 48.4c.3-16.3 15.3-30.7 31.7-30.1 7.8-.3 15.1 3.1 21.2 7.8-2.5 2.9-5.3 5.7-8 8.3-7.3-4.9-17.5-6.4-24.7-.6-10.4 7.2-10.8 24-.9 31.7 9.7 8.7 27.9 4.4 30.6-9-6-.1-12.1 0-18.2-.2v-11H62c.6 8.5-.5 17.6-5.7 24.5-7.9 11.3-23.8 14.5-36.2 9.8S-1 61.7.1 48.4zm81.7-12.1h9c0 3.1 0 6 .1 9 3.1 0 6 0 9 .1v9c-3.1 0-6 0-9 .1 0 3.1 0 6-.1 9h-9c0-3.1 0-6-.1-9-3.1 0-6-.1-9-.1v-9c3.1 0 6 0 9-.1 0-2.9 0-6 .1-9z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconGoogle.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconGoogle.prototype.class = 'IconGoogle';
// Added by sephora-jsx-loader.js
IconGoogle.prototype.getInitialState = function() {
    IconGoogle.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconGoogle.prototype.render = wrapComponentRender(IconGoogle.prototype.render);
// Added by sephora-jsx-loader.js
var IconGoogleClass = React.createClass(IconGoogle.prototype);
// Added by sephora-jsx-loader.js
IconGoogleClass.prototype.classRef = IconGoogleClass;
// Added by sephora-jsx-loader.js
Object.assign(IconGoogleClass, IconGoogle);
// Added by sephora-jsx-loader.js
module.exports = IconGoogleClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconGoogle.jsx