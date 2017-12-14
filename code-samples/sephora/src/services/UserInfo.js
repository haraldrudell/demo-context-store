module.exports = (function () {
    'use strict';

    const performance = require('performance-polyfill');
    const InflatorComps = require('utils/framework/InflateComponents');
    const Events = require('utils/framework/Events');
    const store = require('../store/Store');
    const processUserFull = require('actions/UserActions').processUserFull;
    const urlUtils = require('utils/Url');
    const forceRegisterModal = require('Actions').forceRegisterModal;
    const Perf = require('utils/framework/Perf');

    /** Function for Forced Registration Modal if url contains action=register
     * @param {object} userInfoData
     */
    let handleQueryParamsAction = function (userInfoData) {
        let actionParams = urlUtils.getParamsByName('action');

        if (actionParams && actionParams.indexOf('register') > -1) {
            if (userInfoData.profile.profileStatus !== 0 &&
                !userInfoData.profile.beautyInsiderAccount) {
                store.dispatch(forceRegisterModal(true));
            } else if (userInfoData.profile.profileStatus === 0) {
                store.dispatch(forceRegisterModal(false));
            }
        }
    };

    /* User Info Service */
    Events.onLastLoadEvent(window, [Events.UserInfoLoaded], function () {
        let userInfo = InflatorComps.services.UserInfo;
        let userInfoData = userInfo.data;
        let dataIsFromCache = userInfo.dataIsFromCache;
        store.dispatch(processUserFull(userInfoData, true, dataIsFromCache));

        handleQueryParamsAction(userInfoData);

        InflatorComps.services.loadEvents.UserInfoReady = true;
        window.dispatchEvent(new CustomEvent(Events.UserInfoReady, { detail: {} }));
        Perf.report('UserInfo Ready');

        InflatorComps.renderQueue('UserInfo');

    });

    return null;
})();



// WEBPACK FOOTER //
// ./public_ufe/js/services/UserInfo.js