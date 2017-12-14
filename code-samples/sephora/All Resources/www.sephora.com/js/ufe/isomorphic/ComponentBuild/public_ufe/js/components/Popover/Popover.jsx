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
    Sephora.Util.InflatorComps.Comps['Popover'] = function Popover(){
        return PopoverClass;
    }
}
const {
    colors, shade, space
} = require('style');
const css = require('glamor').css;
const Base = require('components/Base/Base');

const Popover = function () { };

Popover.prototype.render = function () {
    const {
        placement,
        title,
        content,
        _css,
        arrowStyle,
        children
    } = this.props;

    const popoverWidth = 276;
    const popoverBg = colors.white;
    const arrowWidth = 10;
    const arrowOuterWidth = arrowWidth + 1;
    const arrowOuterColor = 'rgba(0,0,0,.2) !important';

    let styles = {
        root: {
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer',
            '&:hover [data-popover]': {
                display: 'block'
            }
        },
        popover: {
            display: 'none',
            position: 'absolute',
            zIndex: 1,
            width: popoverWidth,
            padding: 1,
            textAlign: 'left',
            backgroundColor: colors.white,
            backgroundClip: 'padding-box',
            borderWidth: 1,
            borderColor: shade[2],
            boxShadow: '0 0 10px rgba(0,0,0,.25)'
        },
        arrow: {
            borderWidth: arrowOuterWidth,
            '&, &:after': {
                position: 'absolute',
                display: 'block',
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderColor: 'transparent'
            },
            '&:after': {
                borderWidth: arrowWidth,
                content: '""'
            }
        }
    };

    function popoverPlacementStyle() {
        switch (placement){
            case 'right':
                return {
                    marginLeft: arrowWidth,
                    top: '50%',
                    left: '100%',
                    transform: 'translate(0, -50%)'
                };
            case 'bottom':
                return {
                    marginTop: arrowWidth,
                    top: '100%',
                    left: '50%',
                    marginLeft: -(popoverWidth / 2)
                };
            case 'left':
                return {
                    marginRight: arrowWidth,
                    top: '50%',
                    right: '100%',
                    transform: 'translate(0, -50%)'
                };
            case 'top':
            default:
                return {
                    marginBottom: arrowWidth,
                    bottom: '100%',
                    left: '50%',
                    marginLeft: -(popoverWidth / 2)
                };
        }
    }

    function arrowPlacementStyle() {
        switch (placement){
            case 'right':
                return {
                    top: '50%',
                    left: -arrowOuterWidth,
                    marginTop: -arrowOuterWidth,
                    borderLeftWidth: 0,
                    borderRightColor: arrowOuterColor,
                    '&:after': {
                        left: 1,
                        bottom: -arrowWidth,
                        borderLeftWidth: 0,
                        borderRightColor: popoverBg
                    }
                };
            case 'bottom':
                return {
                    top: -arrowOuterWidth,
                    left: '50%',
                    marginLeft: -arrowOuterWidth,
                    borderTopWidth: 0,
                    borderBottomColor: arrowOuterColor,
                    '&:after': {
                        top: 1,
                        marginLeft: -arrowWidth,
                        borderTopWidth: 0,
                        borderBottomColor: popoverBg
                    }
                };
            case 'left':
                return {
                    top: '50%',
                    right: -arrowOuterWidth,
                    marginTop: -arrowOuterWidth,
                    borderRightWidth: 0,
                    borderLeftColor: arrowOuterColor,
                    '&:after': {
                        right: 1,
                        bottom: -arrowWidth,
                        borderRightWidth: 0,
                        borderLeftColor: popoverBg
                    }
                };
            case 'top':
            default:
                return {
                    bottom: -arrowOuterWidth,
                    left: '50%',
                    marginLeft: -arrowOuterWidth,
                    borderBottomWidth: 0,
                    borderTopColor: arrowOuterColor,
                    '&:after': {
                        bottom: 1,
                        marginLeft: -arrowWidth,
                        borderBottomWidth: 0,
                        borderTopColor: popoverBg
                    }
                };
        }
    }

    return (
        <span
            className={css(styles.root)}>
            <div
                data-popover
                className={css(
                    styles.popover,
                    popoverPlacementStyle(),
                    _css
                )}>
                {title &&
                    <Base
                        fontSize='h3'
                        fontWeight={700}
                        paddingX={space[3]}
                        paddingY={space[2]}
                        borderBottom={1}
                        borderColor='moonGray'>
                        {title}
                    </Base>
                }
                <Base
                    padding={space[3]}
                    whiteSpace='normal'>
                    {content}
                </Base>
                <span className={css(
                    styles.arrow,
                    arrowPlacementStyle(),
                    arrowStyle
                )} />
            </div>
            {children}
        </span>
    );
};


// Added by sephora-jsx-loader.js
Popover.prototype.path = 'Popover';
// Added by sephora-jsx-loader.js
Popover.prototype.class = 'Popover';
// Added by sephora-jsx-loader.js
Popover.prototype.getInitialState = function() {
    Popover.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Popover.prototype.render = wrapComponentRender(Popover.prototype.render);
// Added by sephora-jsx-loader.js
var PopoverClass = React.createClass(Popover.prototype);
// Added by sephora-jsx-loader.js
PopoverClass.prototype.classRef = PopoverClass;
// Added by sephora-jsx-loader.js
Object.assign(PopoverClass, Popover);
// Added by sephora-jsx-loader.js
module.exports = PopoverClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Popover/Popover.jsx