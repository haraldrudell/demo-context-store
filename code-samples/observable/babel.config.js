"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _presetEnv = _interopRequireDefault(require("@babel/preset-env"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

build a Create React App library from $PWD/src/libindex.js to $PWD/lib
*/
var _default = {
  presets: [[_presetEnv.default, {
    targets: {
      node: true
    }
  }]]
};
exports.default = _default;