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
    Sephora.Util.InflatorComps.Comps['IconStar'] = function IconStar(){
        return IconStarClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconStar = function () {};

IconStar.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 32 32'>
            <path d='M16 0l4.9 10.5L32 12.2l-8 8.2L25.9 32 16 26.5 6.1 32 8 20.4l-8-8.2 11.1-1.7L16 0z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconStar.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconStar.prototype.class = 'IconStar';
// Added by sephora-jsx-loader.js
IconStar.prototype.getInitialState = function() {
    IconStar.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconStar.prototype.render = wrapComponentRender(IconStar.prototype.render);
// Added by sephora-jsx-loader.js
var IconStarClass = React.createClass(IconStar.prototype);
// Added by sephora-jsx-loader.js
IconStarClass.prototype.classRef = IconStarClass;
// Added by sephora-jsx-loader.js
Object.assign(IconStarClass, IconStar);
// Added by sephora-jsx-loader.js
module.exports = IconStarClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconStar.jsx