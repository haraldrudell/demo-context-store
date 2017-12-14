/* eslint-disable no-shadow */

const refetch = require('Refetch');
const restApi = require('RestApi');
const updateProfile = require('services/api/profile/updateProfile');


const {
    PROMOTIONAL_EMAILS_PREFS_COUNTRIES,
    PromotionalEmailsPrefsFrequency,
    EmailSubscriptionTypes,
    SubscriptionStatus
} = require('../constants');


function getPromotionalEmailPreferences(userProfileId) {
    const url = `/api/users/profiles/${userProfileId}?` +
                'propertiesToInclude=emailSubscriptionInfo';
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => {
            let promise;

            if (data.errorCode) {
                promise = Promise.reject(data);

            } else {
                let subscriptions = data.emailSubscriptionInfo || [];

                let consumerSubs = subscriptions.filter(
                    data => data.subscriptionType ===
                                EmailSubscriptionTypes.CONSUMER)[0];

                let emailPrefs = {
                    subscribed: consumerSubs &&
                        consumerSubs.subscriptionStatus ===
                                SubscriptionStatus.SUBSCRIBED || false,
                    frequency: consumerSubs &&
                        consumerSubs.subscriptionFrequency ||
                        PromotionalEmailsPrefsFrequency.DAILY,
                    country: consumerSubs &&
                        consumerSubs.countryLocation ||
                        PROMOTIONAL_EMAILS_PREFS_COUNTRIES[0][0],
                    zipPostalCode: consumerSubs &&
                        consumerSubs.subscriptionZip || null
                };

                promise = Promise.resolve(emailPrefs);
            }

            return promise;
        });
}

function setPromotionalEmailPreferences(userProfileId, prefs) {
    return updateProfile({
        fragmentForUpdate: 'EMAIL_SUBSCRIPTION',
        emailSubscriptionInfo: {
            subScribeToEmails: prefs.subscribed,
            subscriptionType: EmailSubscriptionTypes.CONSUMER,
            countryLocation: prefs.country,
            subscriptionFrequency: prefs.frequency,
            zipCode: prefs.zipPostalCode
        }
    });
}


module.exports = {
    getPromotionalEmailPreferences,
    setPromotionalEmailPreferences
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/mailingPreferences/promotionalEmails.js