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
    Sephora.Util.InflatorComps.Comps['IconLove'] = function IconLove(){
        return IconLoveClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconLove = function () {};

IconLove.prototype.render = function () {
    const {
        outline,
        ...props
    } = this.props;

    return (
        <Icon
            {...props}
            viewBox='0 0 32 26'
            width='1.25em'>
            {outline
            ?
                <path d='M16.003 26c-.915 0-1.772-.354-2.417-1L2.364 13.78C.84 12.254 0 10.228 0 8.07 0 3.078 4.153-.012 8-.012c2.225 0 4.223.822 5.778 2.377L16 4.586l2.222-2.222C19.777.81 21.775-.013 24-.013c3.848 0 8 3.09 8 8.084 0 2.157-.84 4.184-2.364 5.708L18.413 25c-.643.645-1.5 1-2.41 1zM8 1.988c-2.886 0-6 2.326-6 6.084 0 1.623.63 3.147 1.778 4.294L15 23.587c.533.533 1.463.535 2 0L28.22 12.364C29.368 11.217 30 9.694 30 8.07c0-3.757-3.114-6.083-6-6.083-1.174 0-2.884.31-4.364 1.792l-2.93 2.928c-.39.39-1.022.39-1.413 0l-2.93-2.93C10.884 2.3 9.174 1.99 8 1.99z'/>
            :
                <path d='M16.003 26c-.915 0-1.772-.354-2.417-1L2.364 13.78C.84 12.254 0 10.228 0 8.07 0 3.078 4.153-.012 8-.012c2.225 0 4.223.822 5.778 2.377L16 4.586l2.222-2.222C19.777.81 21.775-.013 24-.013c3.848 0 8 3.09 8 8.084 0 2.157-.84 4.184-2.364 5.708L18.413 25c-.643.645-1.5 1-2.41 1z'/>
            }
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconLove.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconLove.prototype.class = 'IconLove';
// Added by sephora-jsx-loader.js
IconLove.prototype.getInitialState = function() {
    IconLove.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconLove.prototype.render = wrapComponentRender(IconLove.prototype.render);
// Added by sephora-jsx-loader.js
var IconLoveClass = React.createClass(IconLove.prototype);
// Added by sephora-jsx-loader.js
IconLoveClass.prototype.classRef = IconLoveClass;
// Added by sephora-jsx-loader.js
Object.assign(IconLoveClass, IconLove);
// Added by sephora-jsx-loader.js
module.exports = IconLoveClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconLove.jsx