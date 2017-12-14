import {
    createStore,
    applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import ufe from 'reducers/reducers';
import watch from 'redux-watch';
import { get as getValue } from 'object-path';
import { isObject } from 'utils/Helpers';
import reduxActionWatch from 'redux-action-watch';
import Constants from 'utils/framework/Constants';
const actionWatchMiddleware = reduxActionWatch.middleware(Constants.ACTION_WATCHER_STATE_NAME);

const store = createStore(
    ufe,
    applyMiddleware(actionWatchMiddleware, thunk)
);

const originalDispatch = store.dispatch;
store.dispatch = function (action) {
    if (action instanceof Promise) { // TODO: wait for code to load in Sephora.isLegacyMode
        action.then(actionResult => originalDispatch.call(store, actionResult));
    } else {
        originalDispatch.call(store, action);
    }
};

/**
 *
 * @param  {string || object} properties - You can pass a string describing the store property
 * name that you're interacting with. This will get pattern-matched to a property of the same name
 * in your local state. Eg. store.setAndWatch('user', this);
 *
 * If you need to a different name for your local state property, pass an object instead of a string
 * where the key name is the store property name, and the key value is the local state property
 * name. Eg. store.setAndWatch({'user': 'myUser'}, this);
 *
 * If you need to access a nested property you can look for it using dot notation.
 * Eg. store.setAndWatch('user.firstName', this). If you pass as string it will use the deepest
 * property to name the local state property. You can pass as object to specify the propert name
 * too: store.setAndWatch({'user.firstName': 'userName'}, this);
 *
 * You can pass multiple properties to setAndWatch together by passing inside an array. These
 * properties will be grouped together in the initial setState object, but will have independent
 * watchers set for each properties. Likewise, you can specify the properties in any of the formats
 * described above.
 * Eg. store.setAndWatch(['basket', 'user.firstName', {'loves.currentLoves': 'loves'}], this);
 *
 * @param  {object} component - Component reference if state is to be controlled automatically
 * Eg. store.setAndWatch('user', this); You can pass null if you don't need the state operations
 * but still get and watch a given value with the callback (useful for just doing side effects
 * or usage in util functions).
 *
 * @param  {function} callback - Callback function gets executed initially after setState and in
 * each watcher's tick. If no component was passed the callback is still executed initially and in
 * each watcher's tick. The callback gets passed the given store property value, and its old value
 * in the case of the watcher.
 * Eg. store.setAndWatch('user.firstName', null, (name) => console.log('Hi, ' + name));
 *
 * If you need more leverage in your state operation, you can use the callback for setting state.
 * Just make sure you don't pass the component reference.
 * Eg. store.setAndWatch('user', null, (userData) => {
 *      this.setState({
 *          user: userData,
 *          isBI: this.isBeautyInsider(userData);
 *      });
 * });
 * @return {array} - returns an array with all the store watchers that were set.
 * store.subscribe returns a function which you call in order to remove the subscription,
 * so in this case you can unsubscribe from a given property like this:
 *
 * let subscriptions = store.setAndWatch(['user'], this);
 * subscriptions[0]();
 */
store.setAndWatch = function (properties, component, callback = null) {
    let propertyMap = {};
    let watchers = [];

    if (typeof properties === 'string' || isObject(properties)) {
        properties = [properties];
    }

    if (component && !component.state) {

        // jscs:disable maximumLineLength
        console.error('[Store.setAndWatch]: Components passed must have a state object in order ' +
            'to set state. Skipping state operation.');
    }

    function handleState(value, oldValue = null) {
        if (component && component.state) {

            /*jshint ignore:start*/
            component.setState({ ...value }, () => {
                if (callback) {
                    callback.call(component, value, oldValue);
                }
            });

            /*jshint ignore:end*/
        } else if (callback) {
            callback(value, oldValue);
        }
    }

    function getPropertyName(property) {

        // Names property after the deepest nested property
        if (property.indexOf('.') > -1) {
            return property.split('.').pop();
        } else {
            return property;
        }
    }

    function getObjectData(object) {
        const objectProperties = Object.keys(object);

        if (objectProperties.length > 1) {

            // jscs:disable maximumLineLength
            console.error('[Store.setAndWatch]: Objects passed can only have one assigned proper' +
                'ty each. Use separate objects for each property that you need to set and watch.');
        }

        const keyName = objectProperties[0];
        const keyValue = object[keyName];

        return {
            keyName,
            keyValue
        };
    }

    properties.forEach(property => {
        let storeValue;
        let propertyName;

        if (isObject(property)) {
            const { keyName, keyValue } = getObjectData(property);

            storeValue = getValue(store.getState(), keyName);
            propertyName = keyValue;
        } else {
            storeValue = getValue(store.getState(), property);
            propertyName = getPropertyName(property);
        }

        propertyMap[propertyName] = storeValue;
    });

    handleState(propertyMap);

    properties.forEach(property => {
        let watcher;
        let propertyName;

        if (isObject(property)) {
            const { keyName, keyValue } = getObjectData(property);

            watcher = watch(store.getState, keyName);
            propertyName = keyValue;
        } else {
            watcher = watch(store.getState, property);
            propertyName = getPropertyName(property);
        }

        let instance = store.subscribe(watcher((newVal, oldVal) => {
            handleState(
                { [propertyName]: newVal },
                { [propertyName]: oldVal }
            );
        }));

        watchers.push(instance);
    });

    return watchers;
};

module.exports = store;



// WEBPACK FOOTER //
// ./public_ufe/js/store/Store.js