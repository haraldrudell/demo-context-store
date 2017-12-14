function isPending(orderData) {
    return !orderData.shippingGroups[0].shipmentDate;
}

function getShipmentDate(orderData) {
    return orderData.shippingGroups[0].shipmentDate;
}

function getOrderTrackingUrl(orderData) {
    return orderData.shippingGroups[0].trackingUrl;
}

function getOrderDetailsUrl(orderId) {
    return `/account/orderdetail/${orderId}`;
}

function getAllPurchasesUrl() {
    return '/account/orders/';
}

function getPaymentDisplayInfo(paymentData) {
    if (paymentData.paymentGroupsEntries &&
        paymentData.paymentGroupsEntries.length) {

        if (paymentData.paymentGroupsEntries[0].paymentGroupType === 'PayPalPaymentGroup') {
            return 'PayPal Account ' + paymentData.paymentGroupsEntries[0].paymentGroup.email;
        } else {
            return paymentData.paymentGroupsEntries[0].paymentGroup.paymentDisplayInfo;
        }
    }
    return false;
}

function getBillingAddressInfo(paymentData) {
    if (paymentData.paymentGroupsEntries &&
        paymentData.paymentGroupsEntries.length) {

        return paymentData.paymentGroupsEntries[0].paymentGroup.address;
    }
    return false;
}

function getShippingAddressInfo(shippingData) {
    if (shippingData.shippingGroupsEntries &&
        shippingData.shippingGroupsEntries.length) {

        return shippingData.shippingGroupsEntries[0].shippingGroup.address;
    }
    return false;
}

module.exports = {
    isPending,
    getShipmentDate,
    getOrderTrackingUrl,
    getOrderDetailsUrl,
    getAllPurchasesUrl,
    getPaymentDisplayInfo,
    getBillingAddressInfo,
    getShippingAddressInfo
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Order.js