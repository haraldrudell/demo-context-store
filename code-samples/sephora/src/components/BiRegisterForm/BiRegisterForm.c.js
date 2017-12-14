// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BiRegisterForm = function () {};

// Added by sephora-jsx-loader.js
BiRegisterForm.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const showTermsConditions = require('actions/TermsAndConditionsActions').showModal;
const store = require('Store');
const Locale = require('utils/LanguageLocale');

const VALIDATION_ERROR = {
    PLAY_JOIN_BI: 'PLAY_JOIN_BI',
    JOIN_BI: 'You need to agree to Terms & Conditions for BI',
    BI_BDAY_NOT_FILLED: 'Please select your birth date'
};

BiRegisterForm.prototype.ctrlr = function () {

    this.setState({ isCALocale: Locale.getCurrentCountry().toLowerCase() === 'ca' });
};

BiRegisterForm.prototype.validateForm = function () {
    let joinBICheckbox = this.props.isSocialRegistration ? true : this.state.joinBICheckbox;
    let biMonthValue = this.state.biMonth;
    let biDayValue = this.state.biDay;
    let biYearValue = this.state.biYear;
    let biDatePartiallyFilled = biDayValue || biMonthValue || biYearValue;
    let biDateFullyFilled = biDayValue && biMonthValue && biYearValue;

    if (biDatePartiallyFilled && !joinBICheckbox) {
        this.setState({ biFormError: VALIDATION_ERROR.JOIN_BI });
        return {
            hasError: true,
            errorMsg: VALIDATION_ERROR.JOIN_BI,
            errorField: 'joinBiCheckbox'
        };
    } else if (!biDateFullyFilled && joinBICheckbox) {
        this.setState({
            biFormError: VALIDATION_ERROR.BI_BDAY_NOT_FILLED,
            errorField: 'birthDate',
            monthInvalid: !biMonthValue,
            dayInvalid: !biDayValue,
            yearInvalid: !biYearValue
        });
        return {
            hasError: true,
            errorMsg: VALIDATION_ERROR.BI_BDAY_NOT_FILLED,
            errorField: 'birthDate'
        };
    } else if (this.props.isBiModal && !biDateFullyFilled && !joinBICheckbox) {
        this.setState({ biFormError: VALIDATION_ERROR.JOIN_BI });
        return {
            hasError: true,
            errorMsg: VALIDATION_ERROR.JOIN_BI,
            errorField: 'joinBiCheckbox'
        };
    } else {
        this.setState({
            biFormError: null,
            monthInvalid: false,
            dayInvalid: false,
            yearInvalid: false
        });
        return { hasError: false };
    }
};

BiRegisterForm.prototype.handleKeyDown = function (e) {
    if (this.props.handleKeyDown) {
        this.props.handleKeyDown(e);
    }
};

BiRegisterForm.prototype.handleJoinBIClick = function (e) {
    let isJoinBIChecked = e.target.checked;

    this.setState({ joinBICheckbox: isJoinBIChecked });

    if (this.props.callback) {
        this.props.callback(isJoinBIChecked);
    }
};

BiRegisterForm.prototype.handleTermsClick = function (e) {
    e.preventDefault();
    const tcMediaId = '36800022';
    const tcTitle = 'Beauty Insider Terms & Conditions';
    store.dispatch(showTermsConditions(true, tcMediaId, tcTitle));
};

BiRegisterForm.prototype.handleMonthSelect = function (e) {
    this.setState({ biMonth: e.target.value });
};

BiRegisterForm.prototype.handleDaySelect = function (e) {
    this.setState({ biDay: e.target.value });
};

BiRegisterForm.prototype.handleYearSelect = function (e) {
    this.setState({ biYear: e.target.value });
};

BiRegisterForm.prototype.getBIFormError = function () {
    return this.state.biFormError;
};

BiRegisterForm.prototype.getBIDate = function () {
    if (this.state.joinBICheckbox || this.props.isSocialRegistration) {
        return {
            birthMonth: this.state.biMonth,
            birthDay: this.state.biDay,
            birthYear: this.state.biYear
        };
    } else {
        return null;
    }
};

BiRegisterForm.prototype.setBiDate = function (date) {
    this.setState({
        biMonth: date.birthMonth,
        biDay: date.birthDay,
        biYear: date.birthYear
    });
};

/* setErrorState gets called when there is an api birthday error of 'invalid'
 * birthday.
 */
BiRegisterForm.prototype.setErrorState = function (error) {
    this.setState({
        biFormError: error,
        monthInvalid: true,
        dayInvalid: true
    });
};


// Added by sephora-jsx-loader.js
module.exports = BiRegisterForm.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiRegisterForm/BiRegisterForm.c.js