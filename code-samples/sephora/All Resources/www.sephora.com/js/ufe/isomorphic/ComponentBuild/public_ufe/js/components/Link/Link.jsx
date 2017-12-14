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
    Sephora.Util.InflatorComps.Comps['Link'] = function Link(){
        return LinkClass;
    }
}
const { colors } = require('style');
const { hover, active } = require('glamor');
const Base = require('components/Base/Base');
const Chevron = require('components/Chevron/Chevron');

const Link = function () {};

Link.prototype.render = function () {
    const {
        is = 'button',
        display,
        primary,
        muted,
        arrowDirection,
        arrowPosition = 'after',
        disabled,
        isActive,
        children,
        ...props
    } = this.props;

    const isArrowBefore = arrowPosition === 'before';
    const isArrowAfter = arrowPosition === 'after';

    const isActiveOrDisabled = isActive || disabled;

    const hoverActiveStyles = !isActiveOrDisabled ? {
        opacity: muted ? 1 : 0.5
    } : {};

    const arrow = arrowDirection ? (
        <Chevron
            direction={arrowDirection}
            position='relative'
            top='-.0625em'
            marginRight={isArrowBefore ? '.5em' : null}
            marginLeft={isArrowAfter ? '.5em' : null} />
    ) : null;

    return (
        <Base
            {...props}
            is={this.props.href ? 'a' : is}
            disabled={disabled}
            display={display || 'inline-block'}
            baseStyle={[
                {
                    cursor: 'pointer',
                    transition: 'opacity .2s'
                },
                (muted && !isActive) && {
                    opacity: 0.5
                },
                primary && {
                    color: colors.linkPrimary
                },
                active(hoverActiveStyles),
                !Sephora.isTouch && hover(hoverActiveStyles),
                isActiveOrDisabled && {
                    cursor: 'default'
                },
                disabled && {
                    color: colors.black,
                    opacity: 0.3
                }
            ]}>
            {isArrowBefore && arrow}
            {children}
            {isArrowAfter && arrow}
        </Base>
    );
};


// Added by sephora-jsx-loader.js
Link.prototype.path = 'Link';
// Added by sephora-jsx-loader.js
Link.prototype.class = 'Link';
// Added by sephora-jsx-loader.js
Link.prototype.getInitialState = function() {
    Link.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Link.prototype.render = wrapComponentRender(Link.prototype.render);
// Added by sephora-jsx-loader.js
var LinkClass = React.createClass(Link.prototype);
// Added by sephora-jsx-loader.js
LinkClass.prototype.classRef = LinkClass;
// Added by sephora-jsx-loader.js
Object.assign(LinkClass, Link);
// Added by sephora-jsx-loader.js
module.exports = LinkClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Link/Link.jsx