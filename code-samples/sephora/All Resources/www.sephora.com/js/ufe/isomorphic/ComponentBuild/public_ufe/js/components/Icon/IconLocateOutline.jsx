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
    Sephora.Util.InflatorComps.Comps['IconLocateOutline'] = function IconLocateOutline(){
        return IconLocateOutlineClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconLocateOutline = function () {};

IconLocateOutline.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='0 0 16 23.3'
            width='.6867em'>
            <path d='M8 0C3.6 0 0 3.6 0 8c0 4.9 7.1 14.6 7.4 15 .1.2.4.3.6.3s.4-.1.6-.3c.3-.4 7.4-10.1 7.4-15 0-4.4-3.6-8-8-8zm0 21.3C6.3 18.9 1.5 11.7 1.5 8c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5c0 3.7-4.8 10.9-6.5 13.3z'/><path d='M8 4.4C6 4.4 4.4 6 4.4 8S6 11.6 8 11.6 11.6 10 11.6 8 10 4.4 8 4.4zm0 5.8c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconLocateOutline.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconLocateOutline.prototype.class = 'IconLocateOutline';
// Added by sephora-jsx-loader.js
IconLocateOutline.prototype.getInitialState = function() {
    IconLocateOutline.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconLocateOutline.prototype.render = wrapComponentRender(IconLocateOutline.prototype.render);
// Added by sephora-jsx-loader.js
var IconLocateOutlineClass = React.createClass(IconLocateOutline.prototype);
// Added by sephora-jsx-loader.js
IconLocateOutlineClass.prototype.classRef = IconLocateOutlineClass;
// Added by sephora-jsx-loader.js
Object.assign(IconLocateOutlineClass, IconLocateOutline);
// Added by sephora-jsx-loader.js
module.exports = IconLocateOutlineClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconLocateOutline.jsx