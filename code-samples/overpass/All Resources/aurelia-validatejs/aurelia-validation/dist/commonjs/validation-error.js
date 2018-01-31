"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});



var ValidationError = exports.ValidationError = function ValidationError(rule, message, object) {
  var propertyName = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  

  this.rule = rule;
  this.message = message;
  this.object = object;
  this.propertyName = propertyName || null;
};


//////////////////
// WEBPACK FOOTER
// ./~/aurelia-validatejs/~/aurelia-validation/dist/commonjs/validation-error.js
// module id = 151
// module chunks = 1