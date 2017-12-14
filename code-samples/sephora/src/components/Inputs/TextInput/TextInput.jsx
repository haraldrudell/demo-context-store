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
    Sephora.Util.InflatorComps.Comps['TextInput'] = function TextInput(){
        return TextInputClass;
    }
}
const { css } = require('glamor');
const { borderRadius, colors, forms, lineHeights } = require('style');
const { Box, Text } = require('components/display');
const Label = require('components/Inputs/Label/Label');

/* TODO: make stateless */
const TextInput = function () {
    this.state = {
        value: this.props.value ? this.props.value : '',
        error: null,
        message: this.props.message
    };

    this.inputElement = null;
};

TextInput.prototype.render = function () {
    const {
        name,
        label,
        hideLabel,
        type = 'text',
        autoOff,
        knockout,
        isInline,
        validate,
        message,
        placeholder,
        onChange,
        noMargin,
        invalid,
        ...props
    } = this.props;

    const hasError = invalid || this.state.error;

    const inputStyle = [
        {
            fontFamily: 'inherit',
            fontSize: forms.FONT_SIZE,
            verticalAlign: 'middle',
            width: isInline ?
                'auto' : '100%',
            height: forms.HEIGHT,
            paddingLeft: forms.PADDING_X,
            paddingRight: forms.PADDING_X,
            color: forms.COLOR,
            backgroundColor: forms.BG,
            borderWidth: 1,
            borderRadius,
            borderColor: hasError ? colors.error :
                knockout ? colors.white : forms.BORDER_COLOR,
            WebkitAppearance: 'none',
            ':disabled': {
                cursor: 'not-allowed',
                backgroundColor: forms.DISABLED_BG,
                opacity: forms.DISABLED_OPACITY
            },
            '&::placeholder': { color: forms.PLACEHOLDER_COLOR,
                opacity: 1 },
            ':focus': {
                borderColor: knockout ? null : forms.BORDER_FOCUS_COLOR,
                outline: 0,
                '&::placeholder': { color: forms.PLACEHOLDER_FOCUS_COLOR }
            },
            /* IE: hide browser specific iconography */
            '&::-ms-clear, &::-ms-reveal': { display: 'none' }
        },
        /* iOS
           1. date inputs require a pixel line-height that matches
           the given height of the input
           2. placeholder does not work on date inputs; hack
        */
        type === 'date' && {
            lineHeight: forms.HEIGHT - 2 + 'px',
            '&::before': {
                content: !this.state.value ?
                    '"' + placeholder + '"' : null,
                color: forms.PLACEHOLDER_COLOR
            }
        }
    ];

    const autoProps = autoOff ? {
        autoComplete: 'off',
        autoCorrect: 'off',
        autoCapitalize: 'off',
        spellCheck: 'off'
    } : {};

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
                {...autoProps}
                {...props}
                placeholder={placeholder}
                name={name}
                type={type}
                value={this.state.value}
                is='input'
                display={isInline ? 'inline-block' : 'block'}
                baseStyle={inputStyle}

                onChange={
                    (e) => {
                        let value = e.target.value;

                        this.setState({
                            value: value,
                            error: null
                        });

                        onChange && onChange(e);
                    }
                }

                baseRef={
                    (c) => {
                        if (c !== null) {
                            this.inputElement = c;
                        }
                    }
                } />
            {(this.state.error || this.state.message) &&
                <Text
                    is='p'
                    _css={[
                        forms.MSG_STYLE,
                        { color: hasError ? colors.error :
                                knockout ? colors.silver : null }
                    ]}
                    children={this.state.error || this.state.message} />
            }
        </Box>
    );
};

TextInput.prototype.propTypes = {
    /** Label for form element */
    label: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.element
    ]),
    /** Form element type */
    type: React.PropTypes.string,
    /** Adds a helper or error message below the input */
    message: React.PropTypes.string,
    /** Hides the form element label */
    hideLabel: React.PropTypes.bool,
    /** Disables autocomplete, autocorrect, autocapitalize, and spellcheck props */
    autoOff: React.PropTypes.bool,
    /** Inline - set width to auto and make inline block */
    isInline: React.PropTypes.bool,
    /** Adjust styles when on dark background */
    knockout: React.PropTypes.bool,
    /** No bottom margin */
    noMargin: React.PropTypes.bool
};


// Added by sephora-jsx-loader.js
TextInput.prototype.path = 'Inputs/TextInput';
// Added by sephora-jsx-loader.js
Object.assign(TextInput.prototype, require('./TextInput.c.js'));
var originalDidMount = TextInput.prototype.componentDidMount;
TextInput.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TextInput');
if (originalDidMount) originalDidMount.apply(this);
if (TextInput.prototype.ctrlr) TextInput.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TextInput');
// Added by sephora-jsx-loader.js
TextInput.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TextInput.prototype.class = 'TextInput';
// Added by sephora-jsx-loader.js
TextInput.prototype.getInitialState = function() {
    TextInput.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TextInput.prototype.render = wrapComponentRender(TextInput.prototype.render);
// Added by sephora-jsx-loader.js
var TextInputClass = React.createClass(TextInput.prototype);
// Added by sephora-jsx-loader.js
TextInputClass.prototype.classRef = TextInputClass;
// Added by sephora-jsx-loader.js
Object.assign(TextInputClass, TextInput);
// Added by sephora-jsx-loader.js
module.exports = TextInputClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/TextInput/TextInput.jsx