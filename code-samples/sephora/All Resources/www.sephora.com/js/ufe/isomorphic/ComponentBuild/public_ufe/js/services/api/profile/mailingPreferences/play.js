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


function getPlayEmailPreferences(userProfileId) {
    const url = `/api/users/profiles/${userProfileId}?` +
                'propertiesToInclude=emailSubscriptionInfo';
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => {
            let promise;

            if (data.errorCode) {
                promise = Promise.reject(data);

            } else {
                let subscriptions = data.emailSubscriptionInfo || [];

                let playSubscription = subscriptions.filter(
                        data => data.subscriptionType ===
                                    EmailSubscriptionTypes.PLAY);

                // on occasion after updates to play mail subscription,
                // there are two play mail subscriptions. Use the last one.
                if (playSubscription.length) {
                    playSubscription =
                        playSubscription[playSubscription.length - 1];
                }

                let playEmailPrefs = {
                    subscriptionType: EmailSubscriptionTypes.PLAY,
                    subScribeToEmails: playSubscription &&
                        playSubscription.subscriptionStatus ===
                            SubscriptionStatus.SUBSCRIBED || false,
                    subscriptionFrequency: playSubscription &&
                        playSubscription.subscriptionFrequency ||
                        PromotionalEmailsPrefsFrequency.DAILY,
                    countryLocation: playSubscription &&
                        playSubscription.countryLocation ||
                        PROMOTIONAL_EMAILS_PREFS_COUNTRIES[0][0],
                    zipCode: playSubscription &&
                        playSubscription.subscriptionZip || null
                };

                promise = Promise.resolve(playEmailPrefs);
            }

            return promise;
        });
}


module.exports = {
    getPlayEmailPreferences
};




// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/mailingPreferences/play.js