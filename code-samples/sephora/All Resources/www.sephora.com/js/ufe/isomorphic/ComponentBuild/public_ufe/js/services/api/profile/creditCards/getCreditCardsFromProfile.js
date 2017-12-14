const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Credit+Cards+from+Profile+API


function getCreditCardsFromProfile(userProfileId) {
    // Add cachebuster for browsers that cache this call
    let cacheBuster = Math.round(new Date().getTime() / 1000);
    let url = `/api/users/profiles/${userProfileId}/creditCards?cb=${cacheBuster}`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => {
            let promise;

            if (data.errorCode) {
                promise = Promise.reject(data);

            } else {
                let payments = data;

                //if creditCards array comes back not empty, double check the order
                if (payments.creditCards.length && !payments.creditCards[0].isDefault) {
                    for (let i = 0; i < payments.creditCards.length; i++) {
                        if (payments.creditCards[i].isDefault) {
                            payments.creditCards.unshift(payments.creditCards.splice(i, 1)[0]);
                            break;
                        }
                    }
                }

                promise = Promise.resolve(payments);
            }

            return promise;
        });
}


module.exports = getCreditCardsFromProfile;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/creditCards/getCreditCardsFromProfile.js