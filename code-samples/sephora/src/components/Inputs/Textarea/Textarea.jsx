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
    Sephora.Util.InflatorComps.Comps['Textarea'] = function Textarea(){
        return TextareaClass;
    }
}
const { borderRadius, colors, forms } = require('style');
const { Box, Text } = require('components/display');
const Label = require('components/Inputs/Label/Label');

const Textarea = function () {
    this.state = {
        characterCount: this.props.value ? this.props.value.length : 0,
        value: this.props.value ? this.props.value : ''
    };
};

Textarea.prototype.render = function () {
    const {
        name,
        label,
        hideLabel,
        message,
        minLength,
        maxLength,
        noMargin,
        invalid,
        ...props
    } = this.props;

    const textareaStyle = {
        fontFamily: 'inherit',
        fontSize: forms.FONT_SIZE,
        display: 'block',
        width: '100%',
        paddingTop: forms.PADDING_Y,
        paddingBottom: forms.PADDING_Y,
        paddingLeft: forms.PADDING_X,
        paddingRight: forms.PADDING_X,
        color: forms.COLOR,
        backgroundColor: forms.BG,
        borderWidth: 1,
        borderColor: invalid
            ? colors.error
            : forms.BORDER_COLOR,
        borderRadius,
        overflow: 'auto',
        ':disabled': {
            cursor: 'not-allowed',
            backgroundColor: forms.DISABLED_BG,
            opacity: forms.DISABLED_OPACITY
        },
        '&::placeholder': {
            color: forms.PLACEHOLDER_COLOR,
            opacity: 1
        },
        ':focus': {
            borderColor: forms.BORDER_FOCUS_COLOR,
            outline: 0,
            '&::placeholder': {
                color: forms.PLACEHOLDER_FOCUS_COLOR
            }
        }
    };
    return (
        <Box
            marginBottom={!noMargin ? forms.MARGIN_BOTTOM : null}>
            {label &&
                <Label
                    htmlFor={name}
                    hide={hideLabel}
                    children={label} />
            }
            <Box
                {...props}
                name={name}
                is='textarea'
                ref={inputElement => this.inputElement = inputElement}
                baseStyle={textareaStyle}
                maxLength={maxLength}
                value={this.state.value}
                onchange={maxLength ? this.handleChange.bind(this) : null}/>
            {(message || maxLength || minLength) &&
                <Text
                    is='p'
                    _css={[
                        forms.MSG_STYLE,
                        (minLength || maxLength) && {
                            textAlign: 'right'
                        },
                        invalid && {
                            color: colors.error
                        }
                    ]}>
                    {message ? message :
                        minLength && this.state.characterCount < minLength
                            ? `Min. ${minLength} characters`
                            : `${this.state.characterCount} / ${maxLength} characters`}
                </Text>
            }
            {this.state.error &&
            <Text
                is='p'
                _css={[
                    forms.MSG_STYLE,
                    { color: colors.error }
                ]}
                children={this.state.error} />
            }
        </Box>
    );
};

Textarea.prototype.propTypes = {
    /** Label for form element */
    label: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.element
    ]),
    /** Adds a helper or error message below the input */
    message: React.PropTypes.string,
    /** Hides the form element label */
    hideLabel: React.PropTypes.bool,
    /** No bottom margin */
    noMargin: React.PropTypes.bool
};


// Added by sephora-jsx-loader.js
Textarea.prototype.path = 'Inputs/Textarea';
// Added by sephora-jsx-loader.js
Object.assign(Textarea.prototype, require('./Textarea.c.js'));
var originalDidMount = Textarea.prototype.componentDidMount;
Textarea.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Textarea');
if (originalDidMount) originalDidMount.apply(this);
if (Textarea.prototype.ctrlr) Textarea.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Textarea');
// Added by sephora-jsx-loader.js
Textarea.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Textarea.prototype.class = 'Textarea';
// Added by sephora-jsx-loader.js
Textarea.prototype.getInitialState = function() {
    Textarea.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Textarea.prototype.render = wrapComponentRender(Textarea.prototype.render);
// Added by sephora-jsx-loader.js
var TextareaClass = React.createClass(Textarea.prototype);
// Added by sephora-jsx-loader.js
TextareaClass.prototype.classRef = TextareaClass;
// Added by sephora-jsx-loader.js
Object.assign(TextareaClass, Textarea);
// Added by sephora-jsx-loader.js
module.exports = TextareaClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/Textarea/Textarea.jsx