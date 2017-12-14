const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Subscribe+to+PLAY+API


function subscribeToPlay(skuId, authData = {}) {
    const userId = require('utils/User').getProfileId();
    let url = '/api/shopping-cart/playSubscription';
    let data = {
        skuList: [{ skuId: skuId, qty: 1 }]
    };
    if (authData.isNewUserFlow) {
        // API requires email instead of profileId for Play New User Flow
        data.email = authData.userName;
    } else {
        data.profileId = userId;
    }
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify(data)
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


module.exports = subscribeToPlay;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/basket/subscribeToPlay.js