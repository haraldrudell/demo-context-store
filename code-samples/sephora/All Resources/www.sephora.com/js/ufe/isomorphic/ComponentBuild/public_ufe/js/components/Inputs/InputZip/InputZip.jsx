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
    Sephora.Util.InflatorComps.Comps['InputZip'] = function InputZip(){
        return InputZipClass;
    }
}
const TextInput = require('components/Inputs/TextInput/TextInput');
const FormValidator = require('utils/FormValidator');
const LocaleUtils = require('utils/LanguageLocale');
const MESSAGES = {
    empty: 'Invalid zip or postal code.',
    invalid: 'Invalid ZIP/Postal code.'
};

const PLACEHOLDER = {
    US: 'Enter ZIP code',
    CA: 'Enter postal code',
    OnlineOnly: 'Only available online'
};

let InputZip = function () {};

InputZip.prototype.render = function () {
    const {
        emptyZipError,
        invalidZipError,
        isOnlineOnly,
        value,
        placeholder,
        ...props
    } = this.props;

    let isCanada = LocaleUtils.isCanada();
    let locale = isCanada ? 'CA' : 'US';
    let zipMaxLength = isCanada ? 7 : 10;
    let placeHolderMessage = isOnlineOnly ?
                                PLACEHOLDER.OnlineOnly :
                                    isCanada ? PLACEHOLDER.CA
                                        : PLACEHOLDER.US;

    let emptyZipMsg = emptyZipError
        ? emptyZipError
        : MESSAGES.empty;

    let invalidZipMsg = invalidZipError
        ? invalidZipError
        : MESSAGES.invalid;

    return (
        <TextInput
            {...props}
            autoOff={true}
            name='zipCode'
            placeholder={placeholder ? placeholder : placeHolderMessage}
            maxLength={zipMaxLength}
            ref={(input) => this.input = input}
            value={isOnlineOnly ? '' : value}
            validate={this.props.validate || function (zipCode) {
                if (FormValidator.isEmpty(zipCode)) {
                    return emptyZipMsg;
                } else if (!FormValidator.isValidZipCode(zipCode, locale)) {
                    return invalidZipMsg;
                }

                return null;
            }} />
    );
};


// Added by sephora-jsx-loader.js
InputZip.prototype.path = 'Inputs/InputZip';
// Added by sephora-jsx-loader.js
Object.assign(InputZip.prototype, require('./InputZip.c.js'));
var originalDidMount = InputZip.prototype.componentDidMount;
InputZip.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: InputZip');
if (originalDidMount) originalDidMount.apply(this);
if (InputZip.prototype.ctrlr) InputZip.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: InputZip');
// Added by sephora-jsx-loader.js
InputZip.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
InputZip.prototype.class = 'InputZip';
// Added by sephora-jsx-loader.js
InputZip.prototype.getInitialState = function() {
    InputZip.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
InputZip.prototype.render = wrapComponentRender(InputZip.prototype.render);
// Added by sephora-jsx-loader.js
var InputZipClass = React.createClass(InputZip.prototype);
// Added by sephora-jsx-loader.js
InputZipClass.prototype.classRef = InputZipClass;
// Added by sephora-jsx-loader.js
Object.assign(InputZipClass, InputZip);
// Added by sephora-jsx-loader.js
module.exports = InputZipClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Inputs/InputZip/InputZip.jsx