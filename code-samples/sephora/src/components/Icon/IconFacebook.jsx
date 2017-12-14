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
    Sephora.Util.InflatorComps.Comps['IconFacebook'] = function IconFacebook(){
        return IconFacebookClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconFacebook = function () {};

IconFacebook.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 125 125'>
            <path d='M107.1 12.5H18c-3.1 0-5.5 2.4-5.5 5.5v88.9c0 3.2 2.4 5.6 5.5 5.6h47.9V73.8H53V58.7h13V47.6c0-12.9 7.9-20 19.4-20 5.5 0 10.2.4 11.7.6v13.5h-8c-6.3 0-7.5 2.9-7.5 7.4v9.7h14.9l-1.9 15.1H81.5v38.7H107c3.1 0 5.5-2.4 5.5-5.5V18c.1-3.1-2.4-5.5-5.4-5.5z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconFacebook.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconFacebook.prototype.class = 'IconFacebook';
// Added by sephora-jsx-loader.js
IconFacebook.prototype.getInitialState = function() {
    IconFacebook.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconFacebook.prototype.render = wrapComponentRender(IconFacebook.prototype.render);
// Added by sephora-jsx-loader.js
var IconFacebookClass = React.createClass(IconFacebook.prototype);
// Added by sephora-jsx-loader.js
IconFacebookClass.prototype.classRef = IconFacebookClass;
// Added by sephora-jsx-loader.js
Object.assign(IconFacebookClass, IconFacebook);
// Added by sephora-jsx-loader.js
module.exports = IconFacebookClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconFacebook.jsx