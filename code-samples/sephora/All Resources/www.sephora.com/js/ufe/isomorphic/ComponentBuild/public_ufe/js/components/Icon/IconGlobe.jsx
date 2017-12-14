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
    Sephora.Util.InflatorComps.Comps['IconGlobe'] = function IconGlobe(){
        return IconGlobeClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconGlobe = function () {};

IconGlobe.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 32 32'>
            <path d='M16 0C7.2 0 0 7.1 0 15.9S7.2 32 16 32s16-7.2 16-16.1S24.8 0 16 0zm12.7 22.1h-6.1c.3-1.6.5-3.4.5-5.2h7c-.1 1.9-.6 3.6-1.4 5.2zM4.4 24h5.5c.6 2.3 1.5 4.4 2.6 5.7-3.4-1-6.2-3-8.1-5.7zm-2.5-7h6.9c0 1.8.2 3.6.5 5.2H3.2C2.5 20.5 2 18.8 1.9 17zm1.3-7.1h6.1c-.3 1.6-.5 3.3-.5 5.1H1.9c.1-1.8.6-3.5 1.3-5.1zM27.6 8h-5.5c-.6-2.4-1.5-4.4-2.6-5.7 3.4.8 6.2 2.9 8.1 5.7zM16 29.8c-1.5 0-3.2-2.1-4.3-5.8h8.5c-1 3.6-2.7 5.8-4.2 5.8zm0-27.6c1.5 0 3.2 2.2 4.3 5.8h-8.5c1-3.6 2.7-5.8 4.2-5.8zM21.3 15H10.7c.1-1.9.2-3.7.6-5.2h9.4c.3 1.6.5 3.4.6 5.2zm-.6 7.1h-9.4c-.3-1.5-.5-3.3-.6-5.2h10.5c0 1.9-.2 3.6-.5 5.2zM12.5 2.3c-1.1 1.3-2 3.3-2.6 5.7H4.4c1.9-2.8 4.7-4.9 8.1-5.7zm7 27.4c1.1-1.3 2-3.3 2.6-5.7h5.5c-1.9 2.7-4.7 4.7-8.1 5.7zM23.1 15c0-1.8-.2-3.6-.5-5.2h6.1c.8 1.6 1.2 3.4 1.3 5.2h-6.9z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconGlobe.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconGlobe.prototype.class = 'IconGlobe';
// Added by sephora-jsx-loader.js
IconGlobe.prototype.getInitialState = function() {
    IconGlobe.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconGlobe.prototype.render = wrapComponentRender(IconGlobe.prototype.render);
// Added by sephora-jsx-loader.js
var IconGlobeClass = React.createClass(IconGlobe.prototype);
// Added by sephora-jsx-loader.js
IconGlobeClass.prototype.classRef = IconGlobeClass;
// Added by sephora-jsx-loader.js
Object.assign(IconGlobeClass, IconGlobe);
// Added by sephora-jsx-loader.js
module.exports = IconGlobeClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconGlobe.jsx