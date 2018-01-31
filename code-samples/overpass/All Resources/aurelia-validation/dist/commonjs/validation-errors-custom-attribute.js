"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var aurelia_binding_1 = require('aurelia-binding');
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
var aurelia_templating_1 = require('aurelia-templating');
var validation_controller_1 = require('./validation-controller');
var ValidationErrorsCustomAttribute = (function () {
    function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
        this.boundaryElement = boundaryElement;
        this.controllerAccessor = controllerAccessor;
        this.errors = [];
    }
    ValidationErrorsCustomAttribute.prototype.sort = function () {
        this.errors.sort(function (a, b) {
            if (a.targets[0] === b.targets[0]) {
                return 0;
            }
            return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
        });
    };
    ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
        var _this = this;
        return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
    };
    ValidationErrorsCustomAttribute.prototype.render = function (instruction) {
        var _loop_1 = function(error) {
            var index = this_1.errors.findIndex(function (x) { return x.error === error; });
            if (index !== -1) {
                this_1.errors.splice(index, 1);
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
            var error = _a[_i].error;
            _loop_1(error);
        }
        for (var _b = 0, _c = instruction.render; _b < _c.length; _b++) {
            var _d = _c[_b], error = _d.error, elements = _d.elements;
            var targets = this.interestingElements(elements);
            if (targets.length) {
                this.errors.push({ error: error, targets: targets });
            }
        }
        this.sort();
        this.value = this.errors;
    };
    ValidationErrorsCustomAttribute.prototype.bind = function () {
        this.controllerAccessor().addRenderer(this);
        this.value = this.errors;
    };
    ValidationErrorsCustomAttribute.prototype.unbind = function () {
        this.controllerAccessor().removeRenderer(this);
    };
    ValidationErrorsCustomAttribute.inject = [Element, aurelia_dependency_injection_1.Lazy.of(validation_controller_1.ValidationController)];
    ValidationErrorsCustomAttribute = __decorate([
        aurelia_templating_1.customAttribute('validation-errors', aurelia_binding_1.bindingMode.twoWay)
    ], ValidationErrorsCustomAttribute);
    return ValidationErrorsCustomAttribute;
}());
exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;



//////////////////
// WEBPACK FOOTER
// ./~/aurelia-validation/dist/commonjs/validation-errors-custom-attribute.js
// module id = aurelia-validation/validation-errors-custom-attribute.js
// module chunks = 1