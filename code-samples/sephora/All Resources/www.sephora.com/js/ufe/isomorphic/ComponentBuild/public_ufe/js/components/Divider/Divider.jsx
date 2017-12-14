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
    Sephora.Util.InflatorComps.Comps['Divider'] = function Divider(){
        return DividerClass;
    }
}
const Base = require('components/Base/Base');

const Divider = function () {};

Divider.prototype.render = function () {
    const {
        height,
        color,
        ...props
    } = this.props;

    return (
        <Base
            {...props}
            color={color || 'lightGray'}
            borderBottom={height || 1} />
    );
};

Divider.prototype.propTypes = {
    height: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ])
};


// Added by sephora-jsx-loader.js
Divider.prototype.path = 'Divider';
// Added by sephora-jsx-loader.js
Divider.prototype.class = 'Divider';
// Added by sephora-jsx-loader.js
Divider.prototype.getInitialState = function() {
    Divider.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Divider.prototype.render = wrapComponentRender(Divider.prototype.render);
// Added by sephora-jsx-loader.js
var DividerClass = React.createClass(Divider.prototype);
// Added by sephora-jsx-loader.js
DividerClass.prototype.classRef = DividerClass;
// Added by sephora-jsx-loader.js
Object.assign(DividerClass, Divider);
// Added by sephora-jsx-loader.js
module.exports = DividerClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Divider/Divider.jsx