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
    Sephora.Util.InflatorComps.Comps['ButtonPrimary'] = function ButtonPrimary(){
        return ButtonPrimaryClass;
    }
}
const { active, hover } = require('glamor');
const { colors } = require('style');

// Primary Button: solid background (default black, red hover), white text

const Button = require('components/Button/Button');

var ButtonPrimary = function () {};

ButtonPrimary.prototype.render = function () {

    const hoverActiveStyles = {
        opacity: 0.75
    };

    return (
        <Button
            {...this.props}
            baseStyle={[
                {
                    transition: 'opacity .2s',
                    ':disabled': {
                        opacity: 1,
                        color: colors.lightSilver,
                        backgroundColor: colors.lightGray
                    }
                },
                active(hoverActiveStyles),
                !Sephora.isTouch && hover(hoverActiveStyles)
            ]} />
    );
};

ButtonPrimary.prototype.getDefaultProps = function () {
    return {
        color: colors.white,
        backgroundColor: colors.black
    };
};


// Added by sephora-jsx-loader.js
ButtonPrimary.prototype.path = 'Button';
// Added by sephora-jsx-loader.js
ButtonPrimary.prototype.class = 'ButtonPrimary';
// Added by sephora-jsx-loader.js
ButtonPrimary.prototype.getInitialState = function() {
    ButtonPrimary.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ButtonPrimary.prototype.render = wrapComponentRender(ButtonPrimary.prototype.render);
// Added by sephora-jsx-loader.js
var ButtonPrimaryClass = React.createClass(ButtonPrimary.prototype);
// Added by sephora-jsx-loader.js
ButtonPrimaryClass.prototype.classRef = ButtonPrimaryClass;
// Added by sephora-jsx-loader.js
Object.assign(ButtonPrimaryClass, ButtonPrimary);
// Added by sephora-jsx-loader.js
module.exports = ButtonPrimaryClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Button/ButtonPrimary.jsx