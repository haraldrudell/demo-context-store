'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Replaceable = undefined;

var _dec, _dec2, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');



var Replaceable = exports.Replaceable = (_dec = (0, _aureliaTemplating.customAttribute)('replaceable'), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot), _dec(_class = (0, _aureliaTemplating.templateController)(_class = _dec2(_class = function () {
  function Replaceable(viewFactory, viewSlot) {
    

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.view = null;
  }

  Replaceable.prototype.bind = function bind(bindingContext, overrideContext) {
    if (this.view === null) {
      this.view = this.viewFactory.create();
      this.viewSlot.add(this.view);
    }

    this.view.bind(bindingContext, overrideContext);
  };

  Replaceable.prototype.unbind = function unbind() {
    this.view.unbind();
  };

  return Replaceable;
}()) || _class) || _class) || _class);


//////////////////
// WEBPACK FOOTER
// ./~/aurelia-templating-resources/dist/commonjs/replaceable.js
// module id = aurelia-templating-resources/replaceable.js
// module chunks = 4