'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.defer');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var watcherMiddleware = function watcherMiddleware(reducerName) {
  return function (store) {
    return function (next) {
      return function (action) {
        var appState = store.getState();
        // check for immutable store
        var watcher = (0, _util.isImmutable)(appState) ? appState.get(reducerName) : appState[reducerName];
        // check whether reducer has been setup or not.
        if (!watcher) {
          throw Error('Reducer has not configured');
        }
        var listeners = watcher[action.type] || [];
        // only call listner if it is function
        listeners.forEach(function (listener) {
          return typeof listener === 'function' ? (0, _lodash2.default)(listener, action) : null;
        });
        return next(action);
      };
    };
  };
};

// takes state/reducer name in redux store

exports.default = function () {
  var reducerName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'watcher';
  return watcherMiddleware(reducerName);
};

module.exports = exports['default'];


//////////////////
// WEBPACK FOOTER
// ./~/redux-action-watch/lib/middleware.js
// module id = 353
// module chunks = 0