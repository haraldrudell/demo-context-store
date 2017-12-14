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
    Sephora.Util.InflatorComps.Comps['Base'] = function Base(){
        return BaseClass;
    }
}
/**
 * The Base component provides an API to apply padding, margin,
 * and other styles to any component. All props for the
 * Base component are available to other components to help
 * with contextual styling. It is not intended for use directly,
 * but it can be used to create other custom components.
 */

const Base = function () {};

const {
    borderRadius, colors, fonts, fontSizes, lineHeights, tracking
} = require('style');
const {
    css, hover, active
} = require('glamor');

const radii = require('utils/radii');

const borderStyle = (key, val) => {
    if (val === undefined) {
        return null;
    }
    if (val === false) {
        return { [key]: 0 };
    }

    const size = typeof val === 'number' ? val : 1;
    return { [key + 'Width']: size,
        [key + 'Style']: 'solid' };
};

const getStyle = (c, val) => {
    return c[val] !== undefined ? c[val] : val;
};

Base.prototype.render = function () {

    var {
        is,
        baseStyle,
        _css,
        className,
        baseRef,

        backgroundColor,
        backgroundImage,
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,

        boxShadow,
        cursor,
        display,
        float,
        opacity,
        overflow,
        transform,
        transition,
        visibility,
        verticalAlign,
        whiteSpace,
        /* border */
        border,
        borderTop,
        borderRight,
        borderBottom,
        borderLeft,
        borderColor,
        rounded, pill, circle,
        /* dimension */
        height,
        maxHeight, maxWidth,
        minHeight, minWidth,
        width,
        /* text */
        color, hoverColor,
        sansSerif, serif, fontSize, fontStyle, fontWeight,
        letterSpacing,
        lineHeight,
        textAlign, textDecoration, textTransform,
        /* position/layer */
        position, top, right, bottom, left,
        zIndex,
        /* flexbox */
        alignItems, alignSelf,
        flex, flexBasis, flexFlow, flexDirection, flexWrap, flexShrink,
        justifyContent,
        order,
        /* spacial */
        padding,
        paddingX, paddingY,
        paddingTop, paddingRight, paddingBottom, paddingLeft,
        margin,
        marginX, marginY,
        marginTop, marginRight, marginBottom, marginLeft,
        ...props
    } = this.props;

    const Component = is || 'div';

    className = className ? ' ' + className : '';

    const hoverActiveStyles = {
        color: getStyle(colors, hoverColor)
    };

    const styles = [
        baseStyle,
        {
            backgroundColor: getStyle(colors, backgroundColor),
            backgroundImage,
            backgroundPosition,
            backgroundRepeat,
            backgroundSize,

            boxShadow,
            cursor,
            display,
            float,
            opacity,
            overflow,
            transform,
            transition,
            visibility,
            verticalAlign,
            whiteSpace,
            /* dimension */
            height,
            maxHeight,
            maxWidth,
            minHeight,
            minWidth,
            width: width
                ? isNaN(width)
                    ? width
                    : width > 1 ? width : width * 100 + '%'
                : null,
            /* text */
            color: getStyle(colors, color),
            fontSize: getStyle(fontSizes, fontSize),
            fontStyle,
            fontWeight,
            letterSpacing: getStyle(tracking, letterSpacing),
            lineHeight: getStyle(lineHeights, lineHeight),
            textAlign,
            textDecoration,
            textTransform,
            /* position/layer */
            position,
            top,
            right,
            bottom,
            left,
            zIndex,
            /* flexbox */
            alignItems,
            alignSelf,
            flex,
            flexBasis,
            flexFlow,
            flexDirection,
            flexWrap,
            flexShrink,
            justifyContent,
            order: order === 'last' ? 99999 : order,
            /* spacial */
            paddingTop: paddingTop || paddingY || padding,
            paddingRight: paddingRight || paddingX || padding,
            paddingBottom: paddingBottom || paddingY || padding,
            paddingLeft: paddingLeft || paddingX || padding,
            marginTop: marginTop || marginY || margin,
            marginRight: marginRight || marginX || margin,
            marginBottom: marginBottom || marginY || margin,
            marginLeft: marginLeft || marginX || margin
        },
        sansSerif && { fontFamily: fonts.SANS_SERIF },
        serif && { fontFamily: fonts.SERIF },
        /* border */
        borderStyle('border', border),
        borderStyle('borderTop', borderTop),
        borderStyle('borderRight', borderRight),
        borderStyle('borderBottom', borderBottom),
        borderStyle('borderLeft', borderLeft),
        {
            borderColor: getStyle(colors, borderColor)
        },
        radii({
            rounded,
            pill,
            circle
        }, borderRadius),
        /* hover + active */
        active(hoverActiveStyles),
        !Sephora.isTouch && hover(hoverActiveStyles),
        /* overrides */
        _css
    ];

    return (
        <Component
            {...props}
            className={css(styles) + className}
            ref={ref => baseRef(ref)} />
    );
};

Base.prototype.propTypes = {
    /** HTML element string or React component to render */
    is: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func,
        React.PropTypes.element
    ]),
    /** Base component styles; useful for initial styles */
    baseStyle: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    /** Styles from component instance (context); last styles applied */
    _css: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),

    /** Width - percentage width as a number from 0 - 1 */
    /** Setting a number value above 1 will use the raw pixel value of that number */
    width: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),

    /** Revise flexbox cell order */
    order: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.oneOf(['last'])
    ]),

    /** Controls border radius */
    rounded: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.oneOf([
            'top',
            'right',
            'bottom',
            'left'
        ])
    ]),
    /** Sets border radius 99999 */
    circle: React.PropTypes.bool,
    /** Sets border radius 99999 */
    pill: React.PropTypes.bool,

    /** Set font family */
    serif: React.PropTypes.bool,
    sansSerif: React.PropTypes.bool,

    /** Function to obtain refs for the underlying Base component */
    baseRef: React.PropTypes.func
};

Base.prototype.getDefaultProps = function () {
    return {
        baseRef: x => x
    };
};


// Added by sephora-jsx-loader.js
Base.prototype.path = 'Base';
// Added by sephora-jsx-loader.js
Base.prototype.class = 'Base';
// Added by sephora-jsx-loader.js
Base.prototype.getInitialState = function() {
    Base.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Base.prototype.render = wrapComponentRender(Base.prototype.render);
// Added by sephora-jsx-loader.js
var BaseClass = React.createClass(Base.prototype);
// Added by sephora-jsx-loader.js
BaseClass.prototype.classRef = BaseClass;
// Added by sephora-jsx-loader.js
Object.assign(BaseClass, Base);
// Added by sephora-jsx-loader.js
module.exports = BaseClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Base/Base.jsx