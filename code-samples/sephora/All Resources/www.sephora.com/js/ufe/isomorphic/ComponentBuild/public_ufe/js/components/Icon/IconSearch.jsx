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
    Sephora.Util.InflatorComps.Comps['IconSearch'] = function IconSearch(){
        return IconSearchClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconSearch = function () {};

IconSearch.prototype.render = function () {
    return (
        <Icon
            {...this.props}
            viewBox='174.6 541.6 12 12'>
            <path d='M186.4 552.5l-3.5-3.5c.6-.8 1-1.8 1-2.8 0-2.6-2.1-4.6-4.6-4.6-2.6 0-4.6 2.1-4.6 4.6 0 2.6 2.1 4.6 4.6 4.6 1.1 0 2-.4 2.8-1l3.5 3.5c.1.1.3.2.5.2s.3-.1.5-.2c0-.1 0-.5-.2-.8zm-10.6-6.3c0-1.9 1.5-3.4 3.4-3.4s3.4 1.5 3.4 3.4-1.5 3.4-3.4 3.4-3.4-1.6-3.4-3.4z'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconSearch.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconSearch.prototype.class = 'IconSearch';
// Added by sephora-jsx-loader.js
IconSearch.prototype.getInitialState = function() {
    IconSearch.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconSearch.prototype.render = wrapComponentRender(IconSearch.prototype.render);
// Added by sephora-jsx-loader.js
var IconSearchClass = React.createClass(IconSearch.prototype);
// Added by sephora-jsx-loader.js
IconSearchClass.prototype.classRef = IconSearchClass;
// Added by sephora-jsx-loader.js
Object.assign(IconSearchClass, IconSearch);
// Added by sephora-jsx-loader.js
module.exports = IconSearchClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconSearch.jsx