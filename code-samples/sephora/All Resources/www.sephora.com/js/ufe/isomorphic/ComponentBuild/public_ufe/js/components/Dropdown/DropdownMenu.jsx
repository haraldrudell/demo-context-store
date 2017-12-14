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
    Sephora.Util.InflatorComps.Comps['DropdownMenu'] = function DropdownMenu(){
        return DropdownMenuClass;
    }
}
const {
    colors, dropdown, zIndex
} = require('style');
const Box = require('components/Box/Box');

/**
 * Absolutely positioned Menu component for use within Dropdown component
 */

const DropdownMenu = function () {};

DropdownMenu.prototype.render = function () {
    const arrowSize = dropdown.ARROW_SIZE;
    const dropdownBg = dropdown.BG;

    const {
        open,
        right,
        isCentered,
        isHover,
        width,
        minWidth,
        withArrow,
        triggerDropdown,
        arrowPosition = arrowSize * 2,
        ...props
    } = this.props;

    const numericWidth = typeof width === 'number';

    const styles = {
        root: {
            position: 'absolute',
            left: right ? null : 0,
            right: right ? 0 : null,
            top: '100%',
            width,
            minWidth
        },
        rootCentered: {
            left: '50%',
            right: 'auto',
            transform: !numericWidth ? 'translateX(-50%)' : null,
            marginLeft: numericWidth ? -(width / 2) : null
        },
        content: {
            position: 'relative',
            boxShadow: dropdown.SHADOW,
            color: colors.black,
            backgroundColor: dropdownBg,
            display: 'flex',
            flexDirection: 'column'
        },
        contentWithArrow: {
            paddingTop: arrowSize,
            '&:before, &:after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: isCentered ? '50%' : !right ? arrowPosition : null,
                right: right ? arrowPosition : null,
                backgroundColor: dropdownBg
            },
            '&:before': {
                boxShadow: dropdown.SHADOW,
                width: arrowSize,
                height: arrowSize,
                transform: `translate(-${arrowSize / 2}px,-${arrowSize / 2}px) rotate(45deg)`
            },
            '&:after': {
                width: arrowSize * 2,
                height: arrowSize,
                marginLeft: -arrowSize
            }
        }
    };

    return (
        <Box
            data-lload={this.props.lazyLoad}
            style={{
                display: open ? 'block' : 'none',
                zIndex: open ? zIndex.DROPDOWN : null
            }}
            _css={[
                styles.root,
                isCentered && styles.rootCentered
            ]}>
            <Box
                {...props}
                baseStyle={[
                    styles.content,
                    withArrow && styles.contentWithArrow
                ]} />
        </Box>
    );
};

DropdownMenu.prototype.propTypes = {
    /** Anchors menu to the right */
    right: React.PropTypes.bool,
    /** Centers menu */
    isCentered: React.PropTypes.bool,
    /** Change menu width */
    width: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    /** Adds an arrow  */
    withArrow: React.PropTypes.bool,
    /** Optional arrow position override  */
    arrowPosition: React.PropTypes.number
};

DropdownMenu.prototype.getDefaultProps = function () {
    return {
        width: '100%'
    };
};


// Added by sephora-jsx-loader.js
DropdownMenu.prototype.path = 'Dropdown';
// Added by sephora-jsx-loader.js
DropdownMenu.prototype.class = 'DropdownMenu';
// Added by sephora-jsx-loader.js
DropdownMenu.prototype.getInitialState = function() {
    DropdownMenu.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
DropdownMenu.prototype.render = wrapComponentRender(DropdownMenu.prototype.render);
// Added by sephora-jsx-loader.js
var DropdownMenuClass = React.createClass(DropdownMenu.prototype);
// Added by sephora-jsx-loader.js
DropdownMenuClass.prototype.classRef = DropdownMenuClass;
// Added by sephora-jsx-loader.js
Object.assign(DropdownMenuClass, DropdownMenu);
// Added by sephora-jsx-loader.js
module.exports = DropdownMenuClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Dropdown/DropdownMenu.jsx