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
    Sephora.Util.InflatorComps.Comps['IconLocate'] = function IconLocate(){
        return IconLocateClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconLocate = function () {};

IconLocate.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='5 2 14 20'
            width='.75em'>
            <path d='M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconLocate.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconLocate.prototype.class = 'IconLocate';
// Added by sephora-jsx-loader.js
IconLocate.prototype.getInitialState = function() {
    IconLocate.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconLocate.prototype.render = wrapComponentRender(IconLocate.prototype.render);
// Added by sephora-jsx-loader.js
var IconLocateClass = React.createClass(IconLocate.prototype);
// Added by sephora-jsx-loader.js
IconLocateClass.prototype.classRef = IconLocateClass;
// Added by sephora-jsx-loader.js
Object.assign(IconLocateClass, IconLocate);
// Added by sephora-jsx-loader.js
module.exports = IconLocateClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconLocate.jsx