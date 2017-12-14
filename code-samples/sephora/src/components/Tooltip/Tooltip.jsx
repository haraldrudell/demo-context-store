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
    Sephora.Util.InflatorComps.Comps['Tooltip'] = function Tooltip(){
        return TooltipClass;
    }
}
const { css } = require('glamor');
const { fontSizes, colors } = require('style');
const Base = require('components/Base/Base');

/**
 * Styled tooltip that shows on hover
 */

const Tooltip = function () {};

Tooltip.prototype.render = function () {
    const {
        display = 'inline-block',
        title,
        bottom,
        multiline,
        children,
        ...props
    } = this.props;

    const styles = {
        root: css({
            position: 'relative',
            display,
            cursor: 'pointer',
            '&:hover [data-tooltip]': {
                display: multiline ? 'table-cell' : 'block'
            }
        }),
        box: [
            {
                position: 'absolute',
                zIndex: 1,
                top: bottom ? '100%' : null,
                bottom: bottom ? null : '100%',
                left: '50%',
                fontWeight: '700',
                fontSize: fontSizes.h6,
                color: colors.white,
                backgroundColor: colors.black,
                transform: bottom
                    ? 'translate(-50%, 8px)'
                    : 'translate(-50%, -8px)',
                display: 'none',
                paddingTop: '.375em',
                paddingBottom: '.375em',
                paddingLeft: '.75em',
                paddingRight: '.75em'
            },
            multiline ? {
                width: 'max-content',
                maxWidth: 250,
                textAlign: 'center'
            } : {
                whiteSpace: 'nowrap'
            }
        ],
        arrow: css({
            position: 'absolute',
            top: bottom ? null : '100%',
            bottom: bottom ? '100%' : null,
            left: '50%',
            border: '6px solid transparent',
            borderTopColor: bottom ? 'transparent' : colors.black,
            borderBottomColor: bottom ? colors.black : 'transparent',
            transform: 'translate(-50%, 0)'
        })
    };
    return (
        <span
            aria-label={title}
            className={styles.root}>
            <Base
                {...props}
                data-tooltip
                baseStyle={styles.box}>
                {title}
                <span className={styles.arrow} />
            </Base>
            {children}
        </span>
    );
};

Tooltip.prototype.propTypes = {
    /** Text to display in tooltip */
    title: React.PropTypes.string.isRequired,
    /** Place tooltip on bottom */
    bottom: React.PropTypes.bool
};

Tooltip.prototype.getDefaultProps = function () {
    return {
        rounded: true
    };
};


// Added by sephora-jsx-loader.js
Tooltip.prototype.path = 'Tooltip';
// Added by sephora-jsx-loader.js
Tooltip.prototype.class = 'Tooltip';
// Added by sephora-jsx-loader.js
Tooltip.prototype.getInitialState = function() {
    Tooltip.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Tooltip.prototype.render = wrapComponentRender(Tooltip.prototype.render);
// Added by sephora-jsx-loader.js
var TooltipClass = React.createClass(Tooltip.prototype);
// Added by sephora-jsx-loader.js
TooltipClass.prototype.classRef = TooltipClass;
// Added by sephora-jsx-loader.js
Object.assign(TooltipClass, Tooltip);
// Added by sephora-jsx-loader.js
module.exports = TooltipClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Tooltip/Tooltip.jsx