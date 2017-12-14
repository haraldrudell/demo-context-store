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
    Sephora.Util.InflatorComps.Comps['Flex'] = function Flex(){
        return FlexClass;
    }
}
const Box = require('components/Box/Box');

/** Flexbox component */

const Flex = function () {};

Flex.prototype.render = function () {
    const {
        display,
        isInline,
        ...props
    } = this.props;

    const defaultDisplay = isInline ? 'inline-flex' : 'flex';

    return (
        <Box
            {...props}
            display={display || defaultDisplay} />
    );
};


// Added by sephora-jsx-loader.js
Flex.prototype.path = 'Flex';
// Added by sephora-jsx-loader.js
Flex.prototype.class = 'Flex';
// Added by sephora-jsx-loader.js
Flex.prototype.getInitialState = function() {
    Flex.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Flex.prototype.render = wrapComponentRender(Flex.prototype.render);
// Added by sephora-jsx-loader.js
var FlexClass = React.createClass(Flex.prototype);
// Added by sephora-jsx-loader.js
FlexClass.prototype.classRef = FlexClass;
// Added by sephora-jsx-loader.js
Object.assign(FlexClass, Flex);
// Added by sephora-jsx-loader.js
module.exports = FlexClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Flex/Flex.jsx