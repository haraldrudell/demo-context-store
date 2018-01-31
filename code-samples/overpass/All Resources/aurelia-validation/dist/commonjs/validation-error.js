"use strict";
/**
 * A validation error.
 */
var ValidationError = (function () {
    /**
     * @param rule The rule associated with the error. Validator implementation specific.
     * @param message The error message.
     * @param object The invalid object
     * @param propertyName The name of the invalid property. Optional.
     */
    function ValidationError(rule, message, object, propertyName) {
        if (propertyName === void 0) { propertyName = null; }
        this.rule = rule;
        this.message = message;
        this.object = object;
        this.propertyName = propertyName;
        this.id = ValidationError.nextId++;
    }
    ValidationError.prototype.toString = function () {
        return this.message;
    };
    ValidationError.nextId = 0;
    return ValidationError;
}());
exports.ValidationError = ValidationError;



//////////////////
// WEBPACK FOOTER
// ./~/aurelia-validation/dist/commonjs/validation-error.js
// module id = 155
// module chunks = 1