module.exports = (function () {
    'use strict';

    const InflatorComps = require('utils/framework/InflateComponents');
    const services = InflatorComps.services;
    const Events = require('utils/framework/Events');
    const TestTargetUtils = require('utils/TestTarget');
    const shouldServiceRun = require('utils/Services').shouldServiceRun;

    const setOffers = require('actions/TestTargetActions').setOffers;
    const registerTest = require('actions/TestTargetActions').registerTest;
    const cancelOffers = require('actions/TestTargetActions').cancelOffers;
    const store = require('store/Store');
    const watch = require('redux-watch');

    const LOCAL_STORAGE = require('utils/localStorage/Constants');
    const Storage = require('utils/localStorage/Storage');
    const Perf = require('utils/framework/Perf');

    /* Stop service from loading if not necessary */
    if (!shouldServiceRun.testTarget()) {
        return false;
    }

    /* Adobe Test & Target Service
     ** The at.js script is loaded asynchronously and contains the following custom code
     ** which is executed at the end of the script:
     ** 1. window.dispatchEvent(new CustomEvent('TestTargetLoaded', {'detail': {}}));
     ** 2. Sephora.Util.InflatorComps.services.loadEvents.TestTargetLoaded = true;
     */

    const userLocalData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, true);
    const targetParamsData = Storage.local.getItem(LOCAL_STORAGE.TARGET_PARAMS);

    const userCacheValid = userLocalData &&
        userLocalData.profileStatus !== 0;
    const targetCacheValid = targetParamsData !== null;

    /* We check for a localStorage version of sent user target params or user data to avoid relying
     ** on userInfo if unnecessary. If no cache exists then we load user data from the userInfo
     ** service data.
     */

    const serviceDependencies = userCacheValid ? [Events.TestTargetLoaded, Events.VisitorAPILoaded]
        : [Events.UserInfoReady, Events.TestTargetLoaded, Events.VisitorAPILoaded];

    /** Requests T&T tests and applies them
     * @param {Object} targetParams - user/page data sent to T&T, refer to utils/TestTarget.js.
     * @param {Function} callback - optional callback
     */
    function getOffer(targetParams, callback) {
        adobe.target.getOffer({
            mbox: TestTargetUtils.MBOX_NAME,
            params: targetParams,
            success: response => {
                try {
                    adobe.target.applyOffer({
                        mbox: TestTargetUtils.MBOX_NAME,
                        offer: response
                    });
                } catch (e) {
                    console.error(e);
                    store.dispatch(cancelOffers(true));
                }

                if (callback) {
                    callback();
                }
            },

            error: (status, error) => {
                store.dispatch(cancelOffers(true));

                if (callback) {
                    callback();
                }

            },

            timeout: TestTargetUtils.MBOX_TIMEOUT
        });
    }

    /**
     * Sets service as ready
     */
    function serviceReady() {
        Sephora.Util.InflatorComps.services.loadEvents.TestTargetReady = true;
        Perf.report('TestTarget Ready');
        window.dispatchEvent(new CustomEvent(Events.TestTargetReady, { detail: {} }));
    }

    /* Actual service logic */
    Events.onLastLoadEvent(window, serviceDependencies, () => {
        let targetParams;
        if (targetCacheValid) {
            targetParams = targetParamsData;
        } else {
            const userData = userCacheValid ? userLocalData : services.UserInfo.data.profile;
            targetParams = TestTargetUtils.setUserParams(userData);
        }

        /**
         * Listener that catches test script results and stores them in the Store
         */
        window.addEventListener(Events.TestTargetResult, data => {
            let result = data.detail.result;
            for (let prop in result) {
                if (Object.prototype.hasOwnProperty.call(result, prop)) {
                    let currentTest = result[prop];
                    if (currentTest.testType !== undefined &&
                        currentTest.testType === TestTargetUtils.TEST_TYPES.REORDERING) {
                        /* Transform the component arrangement format prescribed by T&T to ease the
                        swapping process. */
                        TestTargetUtils.setComponentArrangement.apply(currentTest);

                        /* Components being swapped in the same test need a common reference object
                        in the store to exchange data. */
                        store.dispatch(registerTest(prop));
                    }
                }
            }

            store.dispatch(setOffers(result));
        });

        getOffer(targetParams, serviceReady);

        /* Apply Test&Target offer each time user is updated, but not if said update means
        ** the store is being populated for the first time during page load.
        */

        let userWatch = watch(store.getState, 'user');
        store.subscribe(userWatch((newVal, oldVal) => {
            const userChanged = newVal.profileId !== oldVal.profileId;
            const userIsPopulating = Object.keys(oldVal).length === 1;

            if (userChanged && !userIsPopulating) {
                targetParams = TestTargetUtils.setUserParams(newVal);
                getOffer(targetParams);
            }
        }));
    });

    window.addEventListener(Events.TestTargetReady, () => {
        InflatorComps.renderQueue(Events.TestTarget);
    });

    return null;
})();



// WEBPACK FOOTER //
// ./public_ufe/js/services/TestTarget.js