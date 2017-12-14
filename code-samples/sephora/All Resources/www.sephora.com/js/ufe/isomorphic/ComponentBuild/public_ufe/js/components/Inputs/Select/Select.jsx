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
    Sephora.Util.InflatorComps.Comps['Select'] = function Select(){
        return SelectClass;
    }
}
const {
    borderRadius, colors, fontSizes, forms
} = require('style');
const { Box, Text } = require('components/display');
const Label = require('components/Inputs/Label/Label');
const Arrow = require('components/Arrow/Arrow');

const Select = function () {};

Select.prototype.render = function () {
    const {
        name,
        label,
        hideLabel,
        message,
        isInline,
        noMargin,
        invalid,
        ...props
    } = this.props;

    const styles = {
        select: {
            fontFamily: 'inherit',
            fontSize: forms.FONT_SIZE,
            width: isInline
                ? 'auto'
                : '100%',
            verticalAlign: 'middle',
            height: forms.HEIGHT,
            paddingLeft: forms.PADDING_X,
            paddingRight: forms.PADDING_X * 2,
            color: forms.COLOR,
            backgroundColor: forms.BG,
            textTransform: 'none',
            borderWidth: 1,
            borderColor: invalid
                ? colors.error
                : forms.BORDER_COLOR,
            borderRadius,
            ':disabled': {
                cursor: 'not-allowed',
                backgroundColor: forms.DISABLED_BG,
                opacity: forms.DISABLED_OPACITY
            },
            ':focus': {
                borderColor: forms.BORDER_FOCUS_COLOR,
                outline: 0
            },
            /* custom appearance (arrow) */
            MozAppearance: 'none',
            WebkitAppearance: 'none',
            '&::-ms-expand': { display: 'none' }
        },
        arrow: {
            fontSize: fontSizes.h5,
            pointerEvents: 'none',
            position: 'absolute',
            right: forms.PADDING_X,
            top: '50%',
            transform: 'translate(0, -50%)'
        }
    };
    return (
        <Box
            marginBottom={!noMargin ? forms.MARGIN_BOTTOM : null}>
            {label &&
                <Label
                    isInline={isInline}
                    htmlFor={name}
                    hide={hideLabel}
                    children={label} />
            }
            <Box
                position='relative'
                display={isInline ? 'inline-block' : null}>
                <Box
                    {...props}
                    name={name}
                    is='select'
                    display={isInline ? 'inline-block' : 'block'}
                    baseStyle={styles.select} />
                <Arrow style={styles.arrow}/>
            </Box>
            {message &&
                <Text
                    is='p'
                    _css={[
                        forms.MSG_STYLE,
                        invalid && { color: colors.error }
                    ]}
                    children={message} />
            }
        </Box>
    );
};

Select.prototype.propTypes = {
    /** Label for form element */
    label: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.element
    ]),
    /** Adds a helper or error message below the select */
    message: React.PropTypes.string,
    /** Hides the form element label */
    hideLabel: React.PropTypes.bool,
    /** Inline - set width to auto and make inline block */
    isInline: React.PropTypes.bool,
    /** No bottom margin */
    noMargin: React.PropTypes.bool
};


// Added by sephora-jsx-loader.js
Select.prototype.path = 'Inputs/Select';
// Added by sephora-jsx-loader.js
Select.prototype.class = 'Select';
// Added by sephora-jsx-loader.js
Select.prototype.getInitialState = function() {
    Select.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Select.prototype.render = wrapComponentRender(Select.prototype.render);
// Added by sephora-jsx-loader.js
var SelectClass = React.createClass(Select.prototype);
// Added by sephora-jsx-loader.js
SelectClass.prototype.classRef = SelectClass;
// Added by sephora-jsx-loader.js
Object.assign(SelectClass, Select);
// Added by sephora-jsx-loader.js
module.exports = SelectClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/Select/Select.jsx