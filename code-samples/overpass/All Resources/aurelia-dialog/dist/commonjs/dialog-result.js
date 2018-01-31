"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});



var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
  

  this.wasCancelled = false;

  this.wasCancelled = cancelled;
  this.output = output;
};


//////////////////
// WEBPACK FOOTER
// ./~/aurelia-dialog/dist/commonjs/dialog-result.js
// module id = 147
// module chunks = 1