/**
 * This module becomes a property of Sephora.analytics.
 *
 * Its purpose is to hold methods which preprocess event data
 * so that the tag management system can simply read from the
 * digitalData object and not need to employ its own logic.
 */

const commonInteractions = require('analytics/preprocess/preprocessCommonInteractions');
const getBindingMethods = require('analytics/getBindingMethods');
const anaConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');
const postProcess = require('analytics/postProcessEvent');

var eventInProgress = {};

var EVENTS_POOL = [];
var eventRunning = false;

function getEventHash(eventName, eventData) {
    return eventName + JSON.stringify(eventData !== undefined ? eventData : {});
}

/*
 Makes the call of event debounced, so during the first call no other call of the same event is
 possible. Debounce uses pair eventName + eventParams.data as a hash key to detect whether
 it is the same event or not. It does not count other params of event, such as pageType,
 only eventParams.data is used for it
 */
function debounceProcessEvents(processToDebounce) {
    /* eslint-disable no-invalid-this */
    let self = this;
    return function (eventName, opts = {}) {
        let eventHash = getEventHash(eventName, opts.data);
        if (!eventInProgress[eventHash]) {
            eventInProgress[eventHash] = true;
            function removeEventInProgress(event) {
                let eventHashToRemove = getEventHash(event.type, event.detail.data);
                if (eventInProgress[eventHashToRemove]) {
                    delete eventInProgress[eventHashToRemove];
                    window.removeEventListener(eventName, removeEventInProgress);
                }
            }
            window.addEventListener(eventName, removeEventInProgress);
            processToDebounce.apply(self, arguments);
        }
    };
}

/**
 * Take a page type and and event name and start a multi-step process which:
 * - Decides which data needs to be bound and how.
 * - Decides what dependencies to wait for
 * - Finally sends an event that is handled by our tag management system
 * @param  {string} eventName The name of this event
 * @param  {object} opts An optional object containing any amount of other arguments
 */
function processEvents(eventName, opts = {}) {

    try {
        // Being extra safe, don't do anything unless promises object has been loaded.

        if (anaUtils.safelyReadProperty('Sephora.analytics.promises') === '') {
            return;
        }

        /* TODO: Aaron - clean up require
         ** Note: Moving the Events require here, breaks all mobile analytics, adding it
         ** at the top of the file causes other issues.
         const Events = require('utils/framework/Events');
         const fire = this.fire;

         When fixes are ready, wrap the code below in:
         Events.onLastLoadEvent(window, [Events.PostLoad], function () {
         */

        var methodsToCallOnEvent = [];

        opts.data = opts.data || {};

        opts.pageType = opts.pageType ||
            anaUtils.safelyReadProperty('digitalData.page.category.pageType') ||
            anaUtils.safelyReadProperty('Sephora.analytics.backendData.pageType');

        //Add the promises that we always need to wait for
        methodsToCallOnEvent.push(
            Sephora.analytics.promises.tagManagementSystemReady
        );

        //Wait for initial page load on all events besides initial page load
        if (eventName !== anaConsts.PAGE_LOAD) {
            methodsToCallOnEvent.push(Sephora.analytics.promises.initialPageLoadFired);
        }

        //Add all the binding methods relevant to this page
        methodsToCallOnEvent = methodsToCallOnEvent.concat(
            getBindingMethods(opts.pageType, eventName, opts.data)
        );

        this.fire(eventName, methodsToCallOnEvent, opts.data);
    } catch (e) {
        console.log(e);
    }
}

var methods = {

    /**
     * Ensure that all promises are fulfilled, call all binding methods and
     * finally fire an event for the tag management system.
     * @param  {string} eventName     The name of the event to trigger
     * @param  {array}  methodsToCall The methods to call before firing the event
     * @return {[type]}               [description]
     */
    fire: function (currentEventName, currentMethodsToCall, currentData = {}) {
        //Declare fire so we can recursively call it from within
        var fireEvent = function (eventName, methodsToCall, data) {
            if (methodsToCall.length) {
                var method = methodsToCall.shift();
                if (method instanceof Promise) {
                    method.then(function () {
                        fireEvent(eventName, methodsToCall, data);
                    });
                } else if (typeof method === 'function') {
                    if (method.isConditional) {

                        //Only call fire again if the method returns true
                        if (method(data)) {
                            fireEvent(eventName, methodsToCall, data);
                        }
                    } else {
                        method(data);
                        fireEvent(eventName, methodsToCall, data);
                    }
                }
            } else {
                setTimeout(() => {
                    eventRunning = false;
                    /* eslint-disable no-use-before-define */
                    scheduleEvent();
                }, 1000); // delay to prevent one concurrent event compromise another
                //Actually trigger the event for Signal
                eventRunning = true;
                Sephora.analytics.utils.fireEventForTagManager(eventName, {
                    detail: {
                        data: data,
                        specificEventName: data.specificEventName
                    }
                });

                //Do any special post event actions
                postProcess(eventName);
            }
        };
        function scheduleEvent() {
            if (!eventRunning) {
                var event = EVENTS_POOL.shift();
                if (event) {
                    fireEvent(event.eventName, event.methodsToCall, event.data);
                }
            }
        }
        EVENTS_POOL.push({
            eventName: currentEventName,
            data: currentData,
            methodsToCall: currentMethodsToCall
        });
        scheduleEvent();
    },

    preprocess: {
        commonInteractions: commonInteractions
    }

};//End methods
methods.process = debounceProcessEvents.call(methods, processEvents);

/*
 The event will fire only once per page cycle. To check that it has already been fired we
 try to get this event from event history throughout all page and find it there
 To find it we use checkAttr, which should be uniquely identifying this event among others
 Usually checkAttr is a data part of opts
 */
methods.processOnce = function (eventName, opts = {}, checkAttr) {
    let lastEvent = anaUtils.getMostRecentEvent(eventName, checkAttr);
    let isEventFiredAlready = Object.keys(lastEvent).length;
    if (!isEventFiredAlready) {
        methods.process.apply(this, arguments);
    }
};

module.exports = methods;



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/processEvent.js