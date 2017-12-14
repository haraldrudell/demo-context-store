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
    Sephora.Util.InflatorComps.Comps['ButtonWhite'] = function ButtonWhite(){
        return ButtonWhiteClass;
    }
}
const { active, hover } = require('glamor');

// White shadow button

const Button = require('components/Button/Button');

var ButtonWhite = function () {};

ButtonWhite.prototype.render = function () {

    const {
        shadowOffset = '0 0',
        shadowBlur = '4px',
        shadowOpacity = '0.15',
        ...props
    } = this.props;

    const hoverActiveStyles = {
        boxShadow: `${shadowOffset} 20px rgba(0,0,0,${shadowOpacity})`
    };

    return (
        <Button
            {...props}
            backgroundColor='white'
            baseStyle={[
                {
                    transition: 'box-shadow .15s ease-in-out',
                    boxShadow: `${shadowOffset} ${shadowBlur} rgba(0,0,0,${shadowOpacity})`
                },
                active(hoverActiveStyles),
                !Sephora.isTouch && hover(hoverActiveStyles)
            ]} />
    );
};


// Added by sephora-jsx-loader.js
ButtonWhite.prototype.path = 'Button';
// Added by sephora-jsx-loader.js
ButtonWhite.prototype.class = 'ButtonWhite';
// Added by sephora-jsx-loader.js
ButtonWhite.prototype.getInitialState = function() {
    ButtonWhite.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
ButtonWhite.prototype.render = wrapComponentRender(ButtonWhite.prototype.render);
// Added by sephora-jsx-loader.js
var ButtonWhiteClass = React.createClass(ButtonWhite.prototype);
// Added by sephora-jsx-loader.js
ButtonWhiteClass.prototype.classRef = ButtonWhiteClass;
// Added by sephora-jsx-loader.js
Object.assign(ButtonWhiteClass, ButtonWhite);
// Added by sephora-jsx-loader.js
module.exports = ButtonWhiteClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Button/ButtonWhite.jsx