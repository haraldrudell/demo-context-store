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
    Sephora.Util.InflatorComps.Comps['IconTwitter'] = function IconTwitter(){
        return IconTwitterClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconTwitter = function () {};

IconTwitter.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 95 125 125'>
            <path d='M112.5 126.6c-3.8 1.7-7.7 2.7-11.8 3.3 4.3-2.5 7.5-6.6 9.1-11.4-4 2.4-8.4 4.1-13.1 4.9-7.8-8.2-20.7-8.6-29.1-.8-5.4 5.1-7.6 12.5-5.9 19.6-16.5-.8-31.9-8.6-42.3-21.5C14 130 16.8 142 25.8 148c-3.3-.1-6.4-.9-9.3-2.5v.2c0 9.8 6.8 18.2 16.4 20.1-3.1.8-6.2.9-9.3.3 2.7 8.3 10.4 14.1 19.2 14.2-7.3 5.7-16.2 8.8-25.5 8.8-1.7 0-3.3-.1-4.8-.3 9.4 6 20.3 9.3 31.5 9.2 37.7 0 58.4-31.3 58.4-58.4 0-.8 0-1.8-.1-2.6 4-2.8 7.5-6.3 10.2-10.4z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconTwitter.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconTwitter.prototype.class = 'IconTwitter';
// Added by sephora-jsx-loader.js
IconTwitter.prototype.getInitialState = function() {
    IconTwitter.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconTwitter.prototype.render = wrapComponentRender(IconTwitter.prototype.render);
// Added by sephora-jsx-loader.js
var IconTwitterClass = React.createClass(IconTwitter.prototype);
// Added by sephora-jsx-loader.js
IconTwitterClass.prototype.classRef = IconTwitterClass;
// Added by sephora-jsx-loader.js
Object.assign(IconTwitterClass, IconTwitter);
// Added by sephora-jsx-loader.js
module.exports = IconTwitterClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconTwitter.jsx