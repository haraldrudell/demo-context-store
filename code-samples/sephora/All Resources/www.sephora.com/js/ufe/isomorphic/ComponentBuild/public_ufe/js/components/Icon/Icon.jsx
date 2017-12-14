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
    Sephora.Util.InflatorComps.Comps['Icon'] = function Icon(){
        return IconClass;
    }
}
const Base = require('components/Base/Base');

const Icon = function () {};

Icon.prototype.render = function () {
    const {
        width = '1em',
        height = '1em',
        ...props
    } = this.props;

    return (
        <Base
            {...props}
            is='svg'
            baseStyle={{
                position: 'relative',
                display: 'inline-block',
                verticalAlign: 'text-bottom',
                fontSize: 'inherit',
                fill: 'currentColor',
                width,
                height
            }} />
    );
};


// Added by sephora-jsx-loader.js
Icon.prototype.path = 'Icon';
// Added by sephora-jsx-loader.js
Icon.prototype.class = 'Icon';
// Added by sephora-jsx-loader.js
Icon.prototype.getInitialState = function() {
    Icon.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Icon.prototype.render = wrapComponentRender(Icon.prototype.render);
// Added by sephora-jsx-loader.js
var IconClass = React.createClass(Icon.prototype);
// Added by sephora-jsx-loader.js
IconClass.prototype.classRef = IconClass;
// Added by sephora-jsx-loader.js
Object.assign(IconClass, Icon);
// Added by sephora-jsx-loader.js
module.exports = IconClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Icon/Icon.jsx