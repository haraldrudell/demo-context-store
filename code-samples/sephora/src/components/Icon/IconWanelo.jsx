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
    Sephora.Util.InflatorComps.Comps['IconWanelo'] = function IconWanelo(){
        return IconWaneloClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconWanelo = function () {};

IconWanelo.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 130 130'>
            <path d='M17.5 17.5h27.1v27.1H17.5V17.5zm33.9 0h27.1v27.1H51.4V17.5zm34 0h27.1v27.1H85.4V17.5zM17.5 51.4h27.1v27.1H17.5V51.4zm33.9 0h27.1v27.1H51.4V51.4zm34 0h27.1v27.1H85.4V51.4zm-67.9 34h27.1v27.1H17.5V85.4zm33.9 0h27.1v27.1H51.4V85.4z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconWanelo.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconWanelo.prototype.class = 'IconWanelo';
// Added by sephora-jsx-loader.js
IconWanelo.prototype.getInitialState = function() {
    IconWanelo.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconWanelo.prototype.render = wrapComponentRender(IconWanelo.prototype.render);
// Added by sephora-jsx-loader.js
var IconWaneloClass = React.createClass(IconWanelo.prototype);
// Added by sephora-jsx-loader.js
IconWaneloClass.prototype.classRef = IconWaneloClass;
// Added by sephora-jsx-loader.js
Object.assign(IconWaneloClass, IconWanelo);
// Added by sephora-jsx-loader.js
module.exports = IconWaneloClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconWanelo.jsx