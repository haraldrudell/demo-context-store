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
    Sephora.Util.InflatorComps.Comps['IconLooks'] = function IconLooks(){
        return IconLooksClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconLooks = function () {};

IconLooks.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 24 24'>
            <path d='M22.1 0H4.9C3.8 0 3 .8 3 1.9v17.2c0 1 .8 1.9 1.9 1.9h17.2c1 0 1.9-.8 1.9-1.9V1.9C24 .8 23.2 0 22.1 0zm.4 19.1c0 .2-.2.4-.4.4H4.9c-.2 0-.4-.2-.4-.4V1.9c0-.2.2-.4.4-.4h17.2c.2 0 .4.2.4.4v17.2z'/><path d='M19.2 22.5H1.9c-.2 0-.4-.2-.4-.4V4.8c0-.4-.3-.8-.8-.8s-.7.4-.7.8v17.3c0 1 .8 1.9 1.9 1.9h17.3c.4 0 .8-.3.8-.8-.1-.4-.4-.7-.8-.7z'/><path d='M16.2 10.9c.9-.7 1.4-1.8 1.4-3.1 0-2.3-1.8-4.1-4.1-4.1S9.4 5.5 9.4 7.8c0 1.2.6 2.3 1.4 3.1-2.4.9-4.1 3.1-4.1 5.6 0 .4.3.8.8.8h12c.4 0 .8-.3.8-.8-.1-2.5-1.7-4.7-4.1-5.6zm-2.7-5.6c1.4 0 2.6 1.2 2.6 2.6s-1.2 2.6-2.6 2.6-2.6-1.2-2.6-2.6c0-1.5 1.2-2.6 2.6-2.6zM8.3 15.7c.4-2.2 2.6-3.8 5.2-3.8s4.8 1.7 5.2 3.8H8.3z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconLooks.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconLooks.prototype.class = 'IconLooks';
// Added by sephora-jsx-loader.js
IconLooks.prototype.getInitialState = function() {
    IconLooks.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconLooks.prototype.render = wrapComponentRender(IconLooks.prototype.render);
// Added by sephora-jsx-loader.js
var IconLooksClass = React.createClass(IconLooks.prototype);
// Added by sephora-jsx-loader.js
IconLooksClass.prototype.classRef = IconLooksClass;
// Added by sephora-jsx-loader.js
Object.assign(IconLooksClass, IconLooks);
// Added by sephora-jsx-loader.js
module.exports = IconLooksClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconLooks.jsx