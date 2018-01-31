"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});



var NullRepeatStrategy = exports.NullRepeatStrategy = function () {
  function NullRepeatStrategy() {
    
  }

  NullRepeatStrategy.prototype.instanceChanged = function instanceChanged(repeat, items) {
    repeat.removeAllViews(true);
  };

  NullRepeatStrategy.prototype.getCollectionObserver = function getCollectionObserver(observerLocator, items) {};

  return NullRepeatStrategy;
}();


//////////////////
// WEBPACK FOOTER
// ./~/aurelia-templating-resources/dist/commonjs/null-repeat-strategy.js
// module id = 244
// module chunks = 4