// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var EmptyService = function () {};

// Added by sephora-jsx-loader.js
EmptyService.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const profileApi = require('services/api/profile/index');
const store = require('Store');
const reservationUtils = require('utils/Reservations');

EmptyService.prototype.handleBookReservation = function () {
    let user = store.getState().user;
    profileApi.getReservations(user.profileId).then(reservationData => {
        reservationUtils.launchTimeTrade(reservationData.addUrl);
    }).catch(e => {
        this.setState({
            isTimeTradeDown: true
        });
    });
};


// Added by sephora-jsx-loader.js
module.exports = EmptyService.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/StoreServices/EmptyService/EmptyService.c.js