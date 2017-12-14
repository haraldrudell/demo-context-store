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
    Sephora.Util.InflatorComps.Comps['IconInstagram'] = function IconInstagram(){
        return IconInstagramClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconInstagram = function () {};

IconInstagram.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 125 125'>
            <path d='M62.5 21.6c13.4 0 14.9 0 20.2.3 4.8.2 7.5 1.1 9.3 1.7 2.3.9 4 2 5.8 3.8s2.8 3.4 3.8 5.8c.7 1.8 1.5 4.4 1.7 9.3.2 5.3.3 6.8.3 20.2s0 14.9-.3 20.2c-.2 4.8-1.1 7.5-1.7 9.3-.9 2.3-2 4-3.8 5.8s-3.4 2.8-5.8 3.8c-1.8.7-4.4 1.5-9.3 1.7-5.3.2-6.8.3-20.2.3s-14.9 0-20.2-.3c-4.8-.2-7.5-1.1-9.3-1.7-2.3-.9-4-2-5.8-3.8s-2.8-3.4-3.8-5.8c-.7-1.8-1.5-4.4-1.7-9.3-.2-5.3-.3-6.8-.3-20.2s0-14.9.3-20.2c.2-4.8 1.1-7.5 1.7-9.3.9-2.3 2-4 3.8-5.8s3.4-2.8 5.8-3.8c1.8-.7 4.4-1.5 9.3-1.7 5.3-.3 6.8-.3 20.2-.3m0-9.1c-13.6 0-15.3.1-20.6.3s-8.9 1.1-12.1 2.3c-3.3 1.3-6.1 2.9-8.8 5.8-2.7 2.7-4.5 5.6-5.8 8.8s-2.1 6.8-2.3 12.1c-.2 5.4-.3 7.1-.3 20.6s.1 15.3.3 20.6c.2 5.4 1.1 8.9 2.3 12.1 1.3 3.3 2.9 6.1 5.8 8.8 2.7 2.7 5.6 4.5 8.8 5.8 3.2 1.3 6.8 2.1 12.1 2.3 5.4.2 7.1.3 20.6.3s15.3-.1 20.6-.3c5.4-.2 8.9-1.1 12.1-2.3 3.3-1.3 6.1-2.9 8.8-5.8 2.7-2.7 4.5-5.6 5.8-8.8 1.3-3.2 2.1-6.8 2.3-12.1.2-5.4.3-7.1.3-20.6s-.1-15.3-.3-20.6c-.2-5.4-1.1-8.9-2.3-12.1-1.3-3.3-2.9-6.1-5.8-8.8-2.7-2.7-5.6-4.5-8.8-5.8-3.2-1.3-6.8-2.1-12.1-2.3s-7-.3-20.6-.3z'/>
            <path d='M62.5 36.7c-14.2 0-25.8 11.5-25.8 25.8s11.5 25.8 25.8 25.8 25.8-11.5 25.8-25.8-11.6-25.8-25.8-25.8zm0 42.4c-9.2 0-16.6-7.5-16.6-16.6s7.5-16.6 16.6-16.6 16.6 7.5 16.6 16.6-7.4 16.6-16.6 16.6z'/><circle cx='62.5' cy='62.5' r='6'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconInstagram.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconInstagram.prototype.class = 'IconInstagram';
// Added by sephora-jsx-loader.js
IconInstagram.prototype.getInitialState = function() {
    IconInstagram.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconInstagram.prototype.render = wrapComponentRender(IconInstagram.prototype.render);
// Added by sephora-jsx-loader.js
var IconInstagramClass = React.createClass(IconInstagram.prototype);
// Added by sephora-jsx-loader.js
IconInstagramClass.prototype.classRef = IconInstagramClass;
// Added by sephora-jsx-loader.js
Object.assign(IconInstagramClass, IconInstagram);
// Added by sephora-jsx-loader.js
module.exports = IconInstagramClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconInstagram.jsx