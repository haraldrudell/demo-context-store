/* eslint-disable no-shadow */

const refetch = require('Refetch');
const restApi = require('RestApi');
const updateProfile = require('services/api/profile/updateProfile');


const {
    EmailSubscriptionTypes,
    SubscriptionStatus
} = require('../constants');


function getNotificationsAndRemindersPreferences(userProfileId) {
    const url = `/api/users/profiles/${userProfileId}?` +
                'propertiesToInclude=emailSubscriptionInfo';
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => {
            let promise;

            if (data.errorCode) {
                promise = Promise.reject(data);

            } else {
                let subscriptions = data.emailSubscriptionInfo || [];

                let triggeredSubs = subscriptions.filter(
                    data => data.subscriptionType ===
                                EmailSubscriptionTypes.TRIGGERED)[0];

                let subscribed = triggeredSubs &&
                        triggeredSubs.subscriptionStatus ===
                                SubscriptionStatus.SUBSCRIBED || false;

                let prefs = { subscribed };

                promise = Promise.resolve(prefs);
            }

            return promise;
        });
}

function setNotificationsAndRemindersPreferences(prefs) {
    return updateProfile({
        fragmentForUpdate: 'EMAIL_SUBSCRIPTION',
        emailSubscriptionInfo: {
            subScribeToEmails: prefs.subscribed,
            subscriptionType: EmailSubscriptionTypes.TRIGGERED
        }
    });
}


module.exports = {
    getNotificationsAndRemindersPreferences,
    setNotificationsAndRemindersPreferences
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/mailingPreferences/notificationsAndReminders.js