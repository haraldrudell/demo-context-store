const UserActions = require('actions/UserActions');
const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const anaUtils = require('analytics/utils');
const biApi = require('services/api/beautyInsider');

const TYPES = {
    SHOW_EDIT_MY_PROFILE_MODAL: 'SHOW_EDIT_MY_PROFILE_MODAL',
    SHOW_EDIT_FLOW_MODAL: 'SHOW_EDIT_FLOW_MODAL',
    UPDATE_BI_ACCOUNT: 'UPDATE_BI_ACCOUNT',
    GET_ACCOUNT_HISTORY_SLICE: 'GET_ACCOUNT_HISTORY_SLICE',
    SET_ACCOUNT_HISTORY_SLICE: 'SET_ACCOUNT_HISTORY_SLICE',
    SHOW_SOCIAL_REGISTRATION_MODAL: 'SHOW_SOCIAL_REGISTRATION_MODAL',
    SHOW_SOCIAL_REOPT_MODAL: 'SHOW_SOCIAL_REOPT_MODAL'
};

function setAccountHistorySlice(accountHistorySlice) {
    return {
        type: TYPES.SET_ACCOUNT_HISTORY_SLICE,
        accountHistorySlice: accountHistorySlice
    };
}

module.exports = {
    TYPES: TYPES,

    showEditMyProfileModal: function (isOpen) {
        return {
            type: TYPES.SHOW_EDIT_MY_PROFILE_MODAL,
            isOpen: isOpen
        };
    },

    showEditFlowModal: function (
        isOpen,
        title,
        content,
        biAccount,
        socialProfile,
        saveProfileCallback
    ) {
        return {
            type: TYPES.SHOW_EDIT_FLOW_MODAL,
            isOpen: isOpen,
            title: title,
            content: content,
            biAccount: biAccount,
            socialProfile: socialProfile,
            saveProfileCallback: saveProfileCallback
        };
    },

    showSocialRegistrationModal: function (
        isOpen,
        isBi,
        socialRegistrationCallback,
        socialRegistrationProvider,
        cancellationCallback = null
    ) {
        //Analytics - Track Modal
        let pageDetail = isBi ? 'nickname' : 'nickname birthday';

        if (isOpen) {
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'social registration:' + pageDetail + ':n/a*',
                    pageType: 'social registration',
                    pageDetail
                }
            });
        }

        return {
            type: TYPES.SHOW_SOCIAL_REGISTRATION_MODAL,
            isOpen: isOpen,
            socialRegistrationCallback: socialRegistrationCallback,
            socialRegistrationCancellationCallback: cancellationCallback,
            socialRegistrationProvider: socialRegistrationProvider
        };
    },

    showSocialReOptModal: function (
        isOpen,
        socialReOptCallback,
        cancellationCallback = false
    ) {
        //Analytics - Track Modal
        if (isOpen) {
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'social registration:re-opt in:n/a*',
                    pageType: 'social registration',
                    pageDetail: 're-opt in'
                }
            });
        }

        return {
            type: TYPES.SHOW_SOCIAL_REOPT_MODAL,
            isOpen: isOpen,
            socialReOptCallback: socialReOptCallback,
            cancellationCallback: cancellationCallback
        };
    },

    updateBiAccount: function (change, successCallback, errorCallback) {
        return (dispatch) => {
            biApi.updateBiAccount(change).
                then(data => {
                    dispatch(UserActions.getUserFull(null, successCallback));
                }).
                catch(reason => {
                    if (reason.errorMessages &&
                            typeof errorCallback === 'function') {
                        errorCallback();
                    }
                });
        };
    },

    getAccountHistorySlice: function (profileId, offset = 0, limit = 10) {
        return dispatch => {
            biApi.getBiAccountHistory(profileId, offset, limit).
                then(data => dispatch(setAccountHistorySlice(data)));
        };
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/ProfileActions.js