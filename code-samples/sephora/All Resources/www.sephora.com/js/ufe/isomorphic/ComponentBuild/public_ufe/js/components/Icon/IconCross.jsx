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
    Sephora.Util.InflatorComps.Comps['IconCross'] = function IconCross(){
        return IconCrossClass;
    }
}
/* eslint-disable max-len */
const Icon = require('./Icon');

const IconCross = function () {};

IconCross.prototype.render = function () {
    const {
        x,
        ...props
    } = this.props;

    return (
        <Icon
            {...props}
            transition='transform .2s'
            transform={x ? 'rotate(45deg)' : null}
            viewBox='0 0 17 17'>
            <path d='M17 7.5H9.5V0h-2v7.5H0v2h7.5V17h2V9.5H17'/>
        </Icon>
    );
};


// Added by sephora-jsx-loader.js
IconCross.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
IconCross.prototype.class = 'IconCross';
// Added by sephora-jsx-loader.js
IconCross.prototype.getInitialState = function() {
    IconCross.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
IconCross.prototype.render = wrapComponentRender(IconCross.prototype.render);
// Added by sephora-jsx-loader.js
var IconCrossClass = React.createClass(IconCross.prototype);
// Added by sephora-jsx-loader.js
IconCrossClass.prototype.classRef = IconCrossClass;
// Added by sephora-jsx-loader.js
Object.assign(IconCrossClass, IconCross);
// Added by sephora-jsx-loader.js
module.exports = IconCrossClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/IconCross.jsx