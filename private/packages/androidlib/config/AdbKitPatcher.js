'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _resolve = require('resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           © 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           All rights reserved
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */


class AdbKitPatcher {
  constructor(o) {
    const { name, debug } = o || false;
    Object.assign(this, { m: name, debug });
    this.resolve = _util2.default.promisify(_resolve2.default);
  }
  patch(patches) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const cwd = process.cwd();
      for (let [packageName, file] of Object.entries(Object(patches))) {
        console.log(`${_this.m} package: ${packageName}…`);
        const importValue = _path2.default.join(packageName, 'package.json');
        const fsPath = yield _this.resolve(importValue);
        const packagePath = _path2.default.join(fsPath, '..');
        console.log(`${_this.m} file system location: ${_path2.default.relative(cwd, packagePath)}`);

        const fileThatMustExit = _path2.default.join(packagePath, file);
        if (!(yield _fsExtra2.default.pathExists(fileThatMustExit))) {
          console.log(`${_this.m} creating: ${fileThatMustExit}…`);
          yield _fsExtra2.default.ensureFile(fileThatMustExit);
        }
      }
      console.log(`${_this.m} Completed successfully.`);
    })();
  }
}
exports.default = AdbKitPatcher;