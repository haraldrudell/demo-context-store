'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _actionCreators = require('./actionCreators');

var _actionCreators2 = _interopRequireDefault(_actionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  middleware: _middleware2.default,
  reducer: _reducer2.default,
  actionCreators: _actionCreators2.default
};
module.exports = exports['default'];


//////////////////
// WEBPACK FOOTER
// ./~/redux-action-watch/lib/index.js
// module id = 352
// module chunks = 0