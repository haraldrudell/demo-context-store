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
    Sephora.Util.InflatorComps.Comps['Button'] = function Button(){
        return ButtonClass;
    }
}
const css = require('glamor').style;
const {
    buttons, borderRadius, colors, fontSizes,
    lineHeights, shade, tracking
} = require('style');
const Base = require('components/Base/Base');

// Base Button Component

const Button = function () {};

Button.prototype.render = function () {
    const {
        href,
        borderColor,
        size,
        block,
        multiline,
        notCaps,
        minWidth,
        baseStyle,
        ...props
    } = this.props;

    let fontSize;
    let paddingY;
    let paddingX;

    switch (size) {
        case 'sm':
            fontSize = fontSizes.h6;
            paddingY = 8;
            paddingX = 12;
            break;
        case 'lg':
            fontSize = fontSizes.h4;
            paddingY = 12;
            paddingX = 24;
            break;
        default:
            fontSize = buttons.FONT_SIZE;
            paddingY = buttons.PADDING_Y;
            paddingX = buttons.PADDING_X;
    }

    const Component = href ? 'a' : 'button';

    const styles = [
        {
            display: block ? 'block' : 'inline-block',
            fontSize,
            fontWeight: '700',
            lineHeight: multiline
                ? lineHeights[2]
                : buttons.LINE_HEIGHT,
            textAlign: 'center',
            textTransform: 'uppercase',
            textDecoration: 'none',
            verticalAlign: 'middle',
            letterSpacing: tracking[1],
            borderWidth: buttons.BORDER_WIDTH,
            borderColor,
            borderRadius,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            paddingLeft: block ? 0 : paddingX,
            paddingRight: block ? 0 : paddingX,
            width: block ? '100%' : null,
            minHeight:
                Math.round(fontSize * buttons.LINE_HEIGHT + paddingY * 2 + buttons.BORDER_WIDTH * 2),
            MozAppearance: 'none',
            WebkitAppearance: 'none',
            ':focus': { outline: 0,
                boxShadow: '0 0 0 1px ' + colors.white + ', 0 0 0 3px ' + shade[4] },
            ':disabled': {
                cursor: 'not-allowed',
                pointerEvents: 'none',
                opacity: 0.3
            }
        },
        notCaps && {
            letterSpacing: 0,
            textTransform: 'none'
        }
    ];

    return (
        <Base
            {...props}
            is={Component}
            href={href}
            minWidth={!block ? minWidth : null}
            baseStyle={[styles, baseStyle]} />
    );
};

Button.prototype.propTypes = {
    /** Pass an href prop to make the Button an <a> tag instead of a <button> */
    href: React.PropTypes.string,
    /** Border color - can either be a key from the style colors object or any color value */
    borderColor: React.PropTypes.string,
    /** Alternate button sizes - `sm`, `lg` */
    size: React.PropTypes.oneOf(['sm', 'lg']),
    /** Full width of container; no side padding */
    block: React.PropTypes.bool
};

Button.prototype.getDefaultProps = function () {
    return {
        color: 'inherit',
        type: 'button',
        backgroundColor: 'transparent',
        borderColor: 'transparent'
    };
};


// Added by sephora-jsx-loader.js
Button.prototype.path = 'Button';
// Added by sephora-jsx-loader.js
Button.prototype.class = 'Button';
// Added by sephora-jsx-loader.js
Button.prototype.getInitialState = function() {
    Button.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Button.prototype.render = wrapComponentRender(Button.prototype.render);
// Added by sephora-jsx-loader.js
var ButtonClass = React.createClass(Button.prototype);
// Added by sephora-jsx-loader.js
ButtonClass.prototype.classRef = ButtonClass;
// Added by sephora-jsx-loader.js
Object.assign(ButtonClass, Button);
// Added by sephora-jsx-loader.js
module.exports = ButtonClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Button/Button.jsx