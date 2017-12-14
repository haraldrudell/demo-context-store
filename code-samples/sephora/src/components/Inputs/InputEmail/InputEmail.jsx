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
    Sephora.Util.InflatorComps.Comps['InputEmail'] = function InputEmail(){
        return InputEmailClass;
    }
}
const TextInput = require('components/Inputs/TextInput/TextInput');
const FormValidator = require('utils/FormValidator');
const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;

var InputEmail = function () {};

InputEmail.prototype.render = function () {
    const {
        placeholder,
        emptyEmailError,
        invalidEmailError,
        ...props
    } = this.props;

    const messages = {
        empty: 'Please enter your email address.',
        invalid: 'Please enter an e-mail address in the format username@domain.com.'
    };

    const emptyEmailMsg = emptyEmailError
        ? emptyEmailError
        : messages.empty;

    const invalidEmailMsg = invalidEmailError
        ? invalidEmailError
        : messages.invalid;

    return (
        <TextInput
            {...props}
            autoOff
            required
            type="email"
            name="username"
            placeholder={placeholder ? placeholder : 'Email'}
            value={this.props.login ? this.props.login : ''}
            maxLength={FIELD_LENGTHS.email}
            ref={(input) => this.input = input}
            validate={this.props.validate || function (login) {
                    if (FormValidator.isEmpty(login)) {
                        return emptyEmailMsg;
                    } else if (!FormValidator.isValidEmailAddress(login)) {
                        return invalidEmailMsg;
                    }

                    return null;
                }
            } />
    );
};


// Added by sephora-jsx-loader.js
InputEmail.prototype.path = 'Inputs/InputEmail';
// Added by sephora-jsx-loader.js
Object.assign(InputEmail.prototype, require('./InputEmail.c.js'));
var originalDidMount = InputEmail.prototype.componentDidMount;
InputEmail.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: InputEmail');
if (originalDidMount) originalDidMount.apply(this);
if (InputEmail.prototype.ctrlr) InputEmail.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: InputEmail');
// Added by sephora-jsx-loader.js
InputEmail.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
InputEmail.prototype.class = 'InputEmail';
// Added by sephora-jsx-loader.js
InputEmail.prototype.getInitialState = function() {
    InputEmail.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InputEmail.prototype.render = wrapComponentRender(InputEmail.prototype.render);
// Added by sephora-jsx-loader.js
var InputEmailClass = React.createClass(InputEmail.prototype);
// Added by sephora-jsx-loader.js
InputEmailClass.prototype.classRef = InputEmailClass;
// Added by sephora-jsx-loader.js
Object.assign(InputEmailClass, InputEmail);
// Added by sephora-jsx-loader.js
module.exports = InputEmailClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputEmail/InputEmail.jsx