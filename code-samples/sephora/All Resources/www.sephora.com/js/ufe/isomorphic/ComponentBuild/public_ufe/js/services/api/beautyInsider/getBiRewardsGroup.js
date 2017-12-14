const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+BI+Rewards+Group+API

function _getBiRewardsGroup(source) {
    let url = '/api/bi/rewards/?source=' + source;
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


function getBiRewardsGroupForCheckout() {
    return _getBiRewardsGroup('checkout');
}

function getBiRewardsGroupForProfile() {
    return _getBiRewardsGroup('profile');
}


module.exports = {
    getBiRewardsGroupForCheckout,
    getBiRewardsGroupForProfile
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/beautyInsider/getBiRewardsGroup.js