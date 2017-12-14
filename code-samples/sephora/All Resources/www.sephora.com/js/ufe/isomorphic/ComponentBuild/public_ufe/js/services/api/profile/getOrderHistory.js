const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Order+History+API


function getOrderHistory(userProfileId, page, limit) {
    const url = `/api/users/profiles/${userProfileId}/orders?` +
                `currentPage=${page}&` +
                `itemsPerPage=${limit}`;
    return refetch.fetch(restApi.getRestLocation(url), { method: 'GET' }).
        then(data => data.errorCode ? Promise.reject(data) : {
            numOrders: data.orderCount,
            orders: data.orders
        });
}


module.exports = getOrderHistory;



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/getOrderHistory.js