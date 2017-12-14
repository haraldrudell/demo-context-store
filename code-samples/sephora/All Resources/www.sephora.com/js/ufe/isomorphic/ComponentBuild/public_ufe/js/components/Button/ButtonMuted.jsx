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
    Sephora.Util.InflatorComps.Comps['ButtonMuted'] = function ButtonMuted(){
        return ButtonMutedClass;
    }
}
const { hover, active } = require('glamor');

const Button = require('components/Button/Button');

var ButtonMuted = function () {};

ButtonMuted.prototype.render = function () {

    const hoverActiveStyles = {
        opacity: 1
    };

    return (
        <Button
            {...this.props}
            baseStyle={[
                {
                    opacity: 0.6,
                    transition: 'opacity .2s'
                },
                active(hoverActiveStyles),
                !Sephora.isTouch && hover(hoverActiveStyles)
            ]} />
    );
};


// Added by sephora-jsx-loader.js
ButtonMuted.prototype.path = 'Button';
// Added by sephora-jsx-loader.js
ButtonMuted.prototype.class = 'ButtonMuted';
// Added by sephora-jsx-loader.js
ButtonMuted.prototype.getInitialState = function() {
    ButtonMuted.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ButtonMuted.prototype.render = wrapComponentRender(ButtonMuted.prototype.render);
// Added by sephora-jsx-loader.js
var ButtonMutedClass = React.createClass(ButtonMuted.prototype);
// Added by sephora-jsx-loader.js
ButtonMutedClass.prototype.classRef = ButtonMutedClass;
// Added by sephora-jsx-loader.js
Object.assign(ButtonMutedClass, ButtonMuted);
// Added by sephora-jsx-loader.js
module.exports = ButtonMutedClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Button/ButtonMuted.jsx