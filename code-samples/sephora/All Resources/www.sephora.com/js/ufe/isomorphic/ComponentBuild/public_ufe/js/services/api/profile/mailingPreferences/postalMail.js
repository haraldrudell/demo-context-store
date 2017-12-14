/* eslint-disable no-shadow */

const refetch = require('Refetch');
const restApi = require('RestApi');
const updateProfile = require('services/api/profile/updateProfile');


const {
    EmailSubscriptionTypes,
    SubscriptionStatus
} = require('../constants');


function getPostalMailPreferences(userProfileId) {
    const url = `/api/users/profiles/${userProfileId}?` +
        'propertiesToSkip=' +
            'personalizedInformation,' +
            'subcriptions,' +
            'subsriptionPrograms,' +
            'personalizedInformation&' +
        'propertiesToInclude=' +
            'catalogAddress,emailSubscriptionInfo';

    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => {
            let promise;

            if (data.errorCode) {
                promise = Promise.reject(data);

            } else {
                let catalogAddress = data.catalogAddress;
                let emailSubscriptionInfo = data.emailSubscriptionInfo;
                let mailSubscription;
                let subscribed = false;
                let prefs;

                // Data from POSTAL mail subscription is included in
                // emailSubscriptionInfo object
                if (emailSubscriptionInfo) {
                    mailSubscription = emailSubscriptionInfo.filter(obj =>
                        obj.subscriptionType === EmailSubscriptionTypes.MAIL);

                    // Check if user is subscribed to postal mail
                    if (mailSubscription && mailSubscription.length > 0) {
                        subscribed = mailSubscription[0].subscriptionStatus ===
                            SubscriptionStatus.SUBSCRIBED;
                    }
                }

                if (!catalogAddress) {
                    prefs = {
                        subscribed,
                        address: {}
                    };
                } else if (catalogAddress.firstName &&
                    catalogAddress.lastName &&
                    catalogAddress.isDefault === false &&
                    Object.keys(catalogAddress).length === 3) {
                    prefs = {
                        subscribed,
                        address: {
                            firstName: catalogAddress.firstName,
                            lastName: catalogAddress.lastName
                        }
                    };
                } else {
                    prefs = {
                        subscribed,
                        address: {
                            firstName: catalogAddress.firstName,
                            lastName: catalogAddress.lastName,
                            city: catalogAddress.city,
                            state: catalogAddress.state,
                            address1: catalogAddress.address1,
                            address2: catalogAddress.address2,
                            postalCode: catalogAddress.postalCode
                        }
                    };
                }

                promise = Promise.resolve(prefs);
            }

            return promise;
        });
}

function setPostalMailPreferences(prefs) {
    let data = {
        fragmentForUpdate: 'CATALOG_ADDRESS',
        catalogAddress: { subscribe: prefs.subscribed }
    };

    if (prefs.subscribed) {
        data.catalogAddress.address = prefs.address;
    }

    return updateProfile(data);
}


module.exports = {
    getPostalMailPreferences,
    setPostalMailPreferences
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/mailingPreferences/postalMail.js