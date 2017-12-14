const refetch = require('Refetch');
const restApi = require('RestApi');
const urlUtils = require('utils/Url');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Email+Notification+Request+API

function _requestEmailNotification(email, skuId, type, subscribe) {
    let qsParams;

    if (!subscribe) {
        qsParams = { action: 'cancel' };
    } else {
        qsParams = { type };
    }

    let url = '/api/util/skus/notify?' + urlUtils.makeQueryString(qsParams);

    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'POST',
        body: JSON.stringify({ email, skuId })
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}


function requestEmailNotificationForOutOfStockSku(email, skuId) {
    return _requestEmailNotification(email, skuId, 'outOfStock', true);
}

function requestEmailNotificationForComingSoonSku(email, skuId) {
    return _requestEmailNotification(email, skuId, 'comingSoon', true);
}

function cancelEmailNotificationRequest(email, skuId) {
    return _requestEmailNotification(email, skuId, null, false);
}


module.exports = {
    requestEmailNotificationForOutOfStockSku,
    requestEmailNotificationForComingSoonSku,
    cancelEmailNotificationRequest
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/utility/requestEmailNotification.js