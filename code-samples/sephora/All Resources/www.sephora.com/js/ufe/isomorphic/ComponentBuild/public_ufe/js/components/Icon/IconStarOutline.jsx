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
    Sephora.Util.InflatorComps.Comps['IconStarOutline'] = function IconStarOutline(){
        return IconStarOutlineClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconStarOutline = function () {};

IconStarOutline.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 24 24'>
            <path d='M4.5 23.6c-.166 0-.33-.054-.467-.16-.26-.206-.353-.554-.228-.86l3.186-7.817L.32 10.11c-.267-.186-.382-.522-.283-.83.098-.31.388-.52.715-.52h7.758l2.786-7.67c.11-.304.395-.506.735-.49.326.014.608.235.693.547l2.1 7.614h8.427c.327 0 .616.21.715.52.1.308-.016.644-.283.83l-6.673 4.653 3.186 7.818c.124.305.03.654-.23.86-.26.202-.623.215-.896.026L12 18.57l-7.07 4.896c-.13.09-.28.134-.43.134zM3.116 10.245l5.225 3.643c.286.2.395.565.265.884L6.14 20.816l5.43-3.76c.258-.178.603-.178.86 0l5.428 3.76-2.463-6.044c-.13-.32-.02-.686.264-.884l5.224-3.643H14.25c-.338 0-.634-.224-.724-.546l-1.624-5.894-2.16 5.948c-.108.295-.39.49-.707.49h-5.92z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconStarOutline.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconStarOutline.prototype.class = 'IconStarOutline';
// Added by sephora-jsx-loader.js
IconStarOutline.prototype.getInitialState = function() {
    IconStarOutline.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconStarOutline.prototype.render = wrapComponentRender(IconStarOutline.prototype.render);
// Added by sephora-jsx-loader.js
var IconStarOutlineClass = React.createClass(IconStarOutline.prototype);
// Added by sephora-jsx-loader.js
IconStarOutlineClass.prototype.classRef = IconStarOutlineClass;
// Added by sephora-jsx-loader.js
Object.assign(IconStarOutlineClass, IconStarOutline);
// Added by sephora-jsx-loader.js
module.exports = IconStarOutlineClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconStarOutline.jsx