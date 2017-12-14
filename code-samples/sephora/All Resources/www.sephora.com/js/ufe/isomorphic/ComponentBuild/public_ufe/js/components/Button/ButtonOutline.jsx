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
    Sephora.Util.InflatorComps.Comps['ButtonOutline'] = function ButtonOutline(){
        return ButtonOutlineClass;
    }
}
const { hover, active } = require('glamor');
const { colors } = require('style');

// Outline Button

const Button = require('components/Button/Button');

var ButtonOutline = function () {};

ButtonOutline.prototype.render = function () {

    const hoverActiveStyles = {
        opacity: 0.6
    };

    return (
        <Button
            {...this.props}
            baseStyle={[
                {
                    transition: 'opacity .2s',
                    ':disabled': {
                        opacity: 0.1
                    }
                },
                active(hoverActiveStyles),
                !Sephora.isTouch && hover(hoverActiveStyles)
            ]} />
    );
};

ButtonOutline.prototype.getDefaultProps = function () {
    return {
        color: colors.black,
        borderColor: 'currentcolor'
    };
};


// Added by sephora-jsx-loader.js
ButtonOutline.prototype.path = 'Button';
// Added by sephora-jsx-loader.js
ButtonOutline.prototype.class = 'ButtonOutline';
// Added by sephora-jsx-loader.js
ButtonOutline.prototype.getInitialState = function() {
    ButtonOutline.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ButtonOutline.prototype.render = wrapComponentRender(ButtonOutline.prototype.render);
// Added by sephora-jsx-loader.js
var ButtonOutlineClass = React.createClass(ButtonOutline.prototype);
// Added by sephora-jsx-loader.js
ButtonOutlineClass.prototype.classRef = ButtonOutlineClass;
// Added by sephora-jsx-loader.js
Object.assign(ButtonOutlineClass, ButtonOutline);
// Added by sephora-jsx-loader.js
module.exports = ButtonOutlineClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Button/ButtonOutline.jsx