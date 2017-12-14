'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatListenerObj = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _actionCreators = require('./actionCreators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// helper function to convert listners object to acceptable object
var formatListenerObj = exports.formatListenerObj = function formatListenerObj(listenersObj) {
  var formated = {};
  (0, _lodash2.default)(listenersObj, function (listener, action) {
    return formated[action] = listener instanceof Array ? listener : [listener];
  });

  return formated;
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref = arguments[1];
  var type = _ref.type,
      listenersObj = _ref.listenersObj;

  // ignore if action object is not relievent.
  if (!new RegExp(_actionCreators.actionNamespace).test(type) || (typeof listenersObj === 'undefined' ? 'undefined' : _typeof(listenersObj)) !== 'object') {
    return state;
  }

  // clone the state
  var newState = Object.assign({}, state);
  // parse the listenersObj
  var formattedListenerObj = formatListenerObj(listenersObj);
  // Check for subcribe or un-subscribe action
  switch (type) {
    case _actionCreators.SUBSCRIBE_ACTIONS:
      {
        // Add listners
        (0, _lodash2.default)(formattedListenerObj, function (listeners, actionType) {
          newState[actionType] = newState[actionType] ? newState[actionType].concat(listeners) : listeners;
        });
        return newState;
      }
    case _actionCreators.UNSUBSCRIBE_ACTIONS:
      {
        // remove listeners
        (0, _lodash2.default)(formattedListenerObj, function (listeners, actionType) {
          if (!newState[actionType]) {
            return;
          }
          (0, _lodash2.default)(listeners, function (listener) {
            var index = newState[actionType].indexOf(listener);
            newState[actionType].splice(index, 1);
          });
        });
        return newState;
      }
    default:
      {
        return state;
      }
  }
};


//////////////////
// WEBPACK FOOTER
// ./~/redux-action-watch/lib/reducer.js
// module id = 356
// module chunks = 0