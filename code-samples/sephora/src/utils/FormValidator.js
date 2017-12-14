'use strict';

const FormValidator = {

    //these are maximum field lengths
    FIELD_LENGTHS: {
        name: 33,
        password: 12,
        zipCode: 10,
        captcha: 10,
        email: 60,
        address: 35,
        city: 32,
        phone: 10,
        internationalPhone: 15,
        creditCard: 20,
        giftCardNumber: 16,
        giftCardPin: 8
    },

    isEmpty: function (value) {
        return !value || value.trim() === '';
    },

    isValidLength: function (value, minLength, maxLength) {
        return (
            typeof value !== 'undefined' &&
            value !== null &&
            (!minLength || value.length >= minLength) &&
            (!maxLength || value.length <= maxLength)
        );
    },

    /**
     * Note that our test for validity is much stricter than RFC-5322's definition
     * @param el
     * @returns {boolean}
     */
    isValidEmailAddress: function (login) {
        var pattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;
        return pattern.test(login);
    },

    hasEmptySpaces: function (value) {
        return value.indexOf(' ') > -1;
    },

    isAlphaNumeric: function (value) {
        let pattern = /^[a-z0-9]+$/gi;
        return pattern.test(value);
    },

    getErrors: function (fieldComps) {
        let errors = {
            fields: [],
            messages: []
        };
        let firstErrorIndex = null;
        let index = 1;

        fieldComps.forEach(function (comp) {
            if (comp && comp.validateError) {
                let message = comp.validateError();
                if (message) {
                    if (!firstErrorIndex) {
                        firstErrorIndex = index;
                    }

                    errors.fields.push(comp.props.name);
                    errors.messages.push(message);
                }
            }

            index++;
        });

        if (firstErrorIndex) {
            errors.errorIndex = firstErrorIndex;
        }

        return errors;
    },

    inputAcceptOnlyNumbers: function (e) {
        // Del, Backspace, Tab, Escape, Enter
        let validKeys = [46, 8, 9, 27, 13];
        // Arrow keys => e.keyCode >= 35 <= 40
        if (!e.metaKey && (validKeys.indexOf(e.keyCode) === -1) && !parseInt(e.key) &&
        !(e.keyCode >= 35 && e.keyCode <= 40) && e.keyCode !== 48) {
            e.preventDefault();
            return false;
        }
        return true;
    },

    isValidZipCode : function (value, locale) {
        let US_RE = /^\d{5}(-\d{4})?$/;
        let CA_RE = /^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$/i;
        if (locale === 'CA') {
            return CA_RE.test(value);
        } else {
            return US_RE.test(value);
        }
    }
};

module.exports = FormValidator;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/FormValidator.js