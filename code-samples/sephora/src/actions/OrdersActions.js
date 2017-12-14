const profileApi = require('services/api/profile');

function getRecentOrders(userProfileId, page, limit, successCallback) {
    return function (dispatch) {
        return profileApi.getOrderHistory(userProfileId, page, limit).then(function (data) {
            successCallback(data.numOrders, data.orders, page);
        });
    };
}

module.exports = {
    getRecentOrders
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/OrdersActions.js