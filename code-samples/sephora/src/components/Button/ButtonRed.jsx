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
    Sephora.Util.InflatorComps.Comps['ButtonRed'] = function ButtonRed(){
        return ButtonRedClass;
    }
}
// Red Primary Button

const ButtonPrimary = require('components/Button/ButtonPrimary');

var ButtonRed = function () {};

ButtonRed.prototype.render = function () {
    return (
        <ButtonPrimary
            {...this.props}
            backgroundColor='red' />
    );
};


// Added by sephora-jsx-loader.js
ButtonRed.prototype.path = 'Button';
// Added by sephora-jsx-loader.js
ButtonRed.prototype.class = 'ButtonRed';
// Added by sephora-jsx-loader.js
ButtonRed.prototype.getInitialState = function() {
    ButtonRed.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ButtonRed.prototype.render = wrapComponentRender(ButtonRed.prototype.render);
// Added by sephora-jsx-loader.js
var ButtonRedClass = React.createClass(ButtonRed.prototype);
// Added by sephora-jsx-loader.js
ButtonRedClass.prototype.classRef = ButtonRedClass;
// Added by sephora-jsx-loader.js
Object.assign(ButtonRedClass, ButtonRed);
// Added by sephora-jsx-loader.js
module.exports = ButtonRedClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Button/ButtonRed.jsx