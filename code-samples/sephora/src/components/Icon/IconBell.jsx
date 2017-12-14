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
    Sephora.Util.InflatorComps.Comps['IconBell'] = function IconBell(){
        return IconBellClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconBell = function () {};

IconBell.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 23 25.8'
            width='.9em'>
            <path d='M22.8 20.5l-4-5.4V9.8c0-3.8-2.9-6.9-6.6-7.3V.8c.1-.4-.2-.8-.7-.8s-.8.4-.8.8v1.7C7 2.9 4.1 6 4.1 9.8V15l-4 5.4c-.1.3-.1.6 0 .9.1.3.4.4.7.4h21.4c.3 0 .6-.2.7-.4.1-.3.1-.6-.1-.8zm-20.4-.4l3.2-4.4v-.1s0-.1.1-.1v-.2-5.5C5.7 6.6 8.3 4 11.5 4c3.2 0 5.8 2.6 5.8 5.8v5.8c0 .1 0 .1.1.1v.1l3.2 4.4H2.4zM12.7 22.9h-2.5c-.5 0-.8.4-.8.8 0 1.1.9 2 2.1 2 1.1 0 2.1-.9 2.1-2 0-.4-.4-.8-.9-.8z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconBell.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconBell.prototype.class = 'IconBell';
// Added by sephora-jsx-loader.js
IconBell.prototype.getInitialState = function() {
    IconBell.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconBell.prototype.render = wrapComponentRender(IconBell.prototype.render);
// Added by sephora-jsx-loader.js
var IconBellClass = React.createClass(IconBell.prototype);
// Added by sephora-jsx-loader.js
IconBellClass.prototype.classRef = IconBellClass;
// Added by sephora-jsx-loader.js
Object.assign(IconBellClass, IconBell);
// Added by sephora-jsx-loader.js
module.exports = IconBellClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconBell.jsx