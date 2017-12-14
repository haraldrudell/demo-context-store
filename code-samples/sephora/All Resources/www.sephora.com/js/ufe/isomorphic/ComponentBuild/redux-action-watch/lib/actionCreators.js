'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// package's action namespace
var actionNamespace = exports.actionNamespace = '@ACTION_WATCHER';

// Actions
var SUBSCRIBE_ACTIONS = exports.SUBSCRIBE_ACTIONS = actionNamespace + '/ADD';
var UNSUBSCRIBE_ACTIONS = exports.UNSUBSCRIBE_ACTIONS = actionNamespace + '/REMOVE';

/**
 * Un-subscribes/remove listeners
 *
 * @example
 *        unsubscribeActions(dispatch)({
 *          ACTION_A: listenerFn1,
 *          ACTION_B: [listenerFn2, listenerFn3],
 *        })
 *
 * @param      {Function}  dispatch  Redux dispatch function
 * @return     {Function}    Action creator to dispatch subcribe action object to redux
 */
var unsubscribeActions = exports.unsubscribeActions = function unsubscribeActions(dispatch) {
  return function (listenersObj) {
    return dispatch({ type: UNSUBSCRIBE_ACTIONS, listenersObj: listenersObj });
  };
};
/**
 * Subscribes/add listener for redux action dispatch
 *
 * @example
 *        const unsubscribe = subscribeActions(dispatch)({
 *          ACTION_A: listenerFn1,
 *          ACTION_B: [listenerFn2, listenerFn3],
 *        })
 *
 *        unsubscribe();  // un-subscribe
 *
 * @param      {Function}  dispatch  Redux dispatch function
 * @return     {Function}    Action creator to dispatch un-subcribe action object to redux
 */
var subscribeActions = exports.subscribeActions = function subscribeActions(dispatch) {
  return function (listenersObj) {
    dispatch({ type: SUBSCRIBE_ACTIONS, listenersObj: listenersObj });
    return function () {
      return unsubscribeActions(dispatch)(listenersObj);
    };
  };
};

/**
 * Alise of subscritionActions function, but accept one listner.
 *
 * @example
 *        const unsubscribe = onAction(dispatch)('ACTION_A', actionObj => {console.log(actionObj)})
 *
 *        unsubscribe();  // un-subscribe
 *
 * @param      {Function}  dispatch  Redux dispatch function
 * @return     {Function}  Action creator to dispatch subcribe action object to redux
 */
var onAction = exports.onAction = function onAction(dispatch) {
  return function (action, listener) {
    return subscribeActions(dispatch)(_defineProperty({}, action, listener));
  };
};

/**
 * Alise of subscritionActions function, but accept one listner at a time and automatically unsubcribe
 * after one call.
 *
 * @example
 *        onActionOnce(dispatch)('ACTION_A', actionObj => {console.log(actionObj)})
 *
 * @param      {Function}  dispatch  Redux dispatch function
 * @return     {Function}  Action creator to dispatch subcribe action object to redux
 */
var onActionOnce = exports.onActionOnce = function onActionOnce(dispatch) {
  return function (actionType, listener) {
    var unsubscribe = null;
    var wrapListener = function wrapListener(actionMeta) {
      if (unsubscribe) {
        // un-subscribe behalf of coder.
        unsubscribe();
      }
      listener(actionMeta);
    };
    unsubscribe = subscribeActions(dispatch)(_defineProperty({}, actionType, wrapListener));
    // return unsubscribe fn to support termination without any call.
    return unsubscribe;
  };
};

exports.default = {
  subscribeActions: subscribeActions,
  unsubscribeActions: unsubscribeActions,
  onAction: onAction,
  onActionOnce: onActionOnce
};


//////////////////
// WEBPACK FOOTER
// ./~/redux-action-watch/lib/actionCreators.js
// module id = 358
// module chunks = 0