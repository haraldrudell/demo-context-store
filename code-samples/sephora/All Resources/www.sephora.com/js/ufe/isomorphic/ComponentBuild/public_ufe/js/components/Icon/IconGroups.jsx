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
    Sephora.Util.InflatorComps.Comps['IconGroups'] = function IconGroups(){
        return IconGroupsClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconGroups = function () {};

IconGroups.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 32 31'
            width='1.0325em'>
            <path d='M26 11.8c.7 1.2 1.2 2.6 1.4 4 .1.5.5.9 1 .9h.1c.5-.1.9-.6.8-1.1-.2-1.6-.8-3.2-1.6-4.7-.8-1.4-1.9-2.7-3.2-3.8-.4-.3-1.1-.3-1.4.1-.3.4-.3 1.1.1 1.4 1.2.9 2.1 2 2.8 3.2zM20 28.3c-1.3.5-2.7.7-4 .7-1.4 0-2.8-.2-4-.7-.5-.2-1.1.1-1.3.6-.2.5.1 1.1.6 1.3 1.5.6 3.1.9 4.8.9 1.6 0 3.2-.3 4.8-.9.5-.2.8-.8.6-1.3-.4-.6-.9-.8-1.5-.6zM3.5 16.6h.2c.5 0 .9-.4 1-.9.2-1.4.7-2.7 1.4-4 .7-1.2 1.6-2.3 2.7-3.2.4-.3.5-1 .1-1.4-.4-.4-1-.5-1.4-.1-1.3 1.1-2.4 2.3-3.2 3.8-.8 1.4-1.4 3-1.6 4.7-.1.5.2 1 .8 1.1zM5 19c-2.8 0-5 2.2-5 5s2.2 5 5 5c1.3 0 2.6-.5 3.5-1.4.9-.9 1.5-2.2 1.5-3.6 0-2.8-2.2-5-5-5zm-3 5c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zM16 10c2.5 0 4.6-1.9 4.9-4.3.1-.3.1-.5.1-.7 0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5zm0-8c1.7 0 3 1.3 3 3s-1.3 3-3 3c-1.4 0-2.6-1-2.9-2.4-.1-.2-.1-.4-.1-.6 0-1.7 1.3-3 3-3zM27 19c-2.8 0-5 2.2-5 5 0 1.4.6 2.7 1.5 3.6.9.9 2.1 1.4 3.5 1.4 2.8 0 5-2.2 5-5s-2.2-5-5-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconGroups.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconGroups.prototype.class = 'IconGroups';
// Added by sephora-jsx-loader.js
IconGroups.prototype.getInitialState = function() {
    IconGroups.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconGroups.prototype.render = wrapComponentRender(IconGroups.prototype.render);
// Added by sephora-jsx-loader.js
var IconGroupsClass = React.createClass(IconGroups.prototype);
// Added by sephora-jsx-loader.js
IconGroupsClass.prototype.classRef = IconGroupsClass;
// Added by sephora-jsx-loader.js
Object.assign(IconGroupsClass, IconGroups);
// Added by sephora-jsx-loader.js
module.exports = IconGroupsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconGroups.jsx