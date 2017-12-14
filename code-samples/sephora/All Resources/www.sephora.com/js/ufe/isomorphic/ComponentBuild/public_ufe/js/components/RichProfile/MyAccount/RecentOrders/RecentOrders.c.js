// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RecentOrders = function () {};

// Added by sephora-jsx-loader.js
RecentOrders.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const OrdersActions = require('actions/OrdersActions');
const OrderUtils = require('utils/Order');
const redirectTo = require('utils/Url').redirectTo;
const { ensureUserIsSignedIn } = require('utils/decorators');

const NUM_ORDERS_PER_PAGE = 50;

RecentOrders.prototype.ctrlr = function (user) {
    this._userProfileId = user.profileId;
    this.loadNextPage();
};

RecentOrders.prototype.handleViewDetailsClick = function (e, orderId) {
    redirectTo(OrderUtils.getOrderDetailsUrl(orderId));
};

RecentOrders.prototype.handleTrackOrderClick = function (e, order) {
    redirectTo(OrderUtils.getOrderTrackingUrl(order));
};

RecentOrders.prototype.handleViewAllPurchasesClick = function (e) {
    redirectTo(OrderUtils.getAllPurchasesUrl());
};

RecentOrders.prototype.handleShowMoreClick = function (e) {
    this.loadNextPage();
};

RecentOrders.prototype.nextPageLoadedCallback = function (numOrders, orders, numPagesRetrieved) {
    let numPagesTotal = Math.ceil(
            numOrders / NUM_ORDERS_PER_PAGE);
    let retrievedOrders = this.state.recentOrders || [];
    this.setState({
        numPagesRetrieved: numPagesRetrieved,
        numOrders: numOrders,
        numPagesTotal: numPagesTotal,
        recentOrders: retrievedOrders.concat(orders)
    });
};

RecentOrders.prototype.loadNextPage = function () {
    let pageToRetrieve = this.state.numPagesRetrieved + 1;
    store.dispatch(OrdersActions.getRecentOrders(
        this._userProfileId, pageToRetrieve, NUM_ORDERS_PER_PAGE,
        this.nextPageLoadedCallback.bind(this)));
};

RecentOrders = ensureUserIsSignedIn(RecentOrders);


// Added by sephora-jsx-loader.js
module.exports = RecentOrders.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/RecentOrders/RecentOrders.c.js