// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Reservations = function () {};

// Added by sephora-jsx-loader.js
Reservations.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const dateUtils = require('utils/Date.js');
const ReservationActions = require('actions/ReservationActions');
const ReservationUtils = require('utils/Reservations');
const showSignInModal = require('actions/Actions').showSignInModal;
const Authentication = require('utils/Authentication');
const getUser = require('utils/User').getUser;
const { ensureUserIsSignedIn } = require('utils/decorators');

Reservations.prototype.ctrlr = function (user) {
    store.dispatch(ReservationActions.getReservations(user.profileId));

    const reservationsWatch = watch(store.getState, 'reservations');
    store.subscribe(reservationsWatch(newVal => {
        this.setState({
            upcoming: newVal.upcoming,
            previous: newVal.previous,
            addUrl: newVal.addUrl,
            editUrl: newVal.editUrl,
            error: newVal.error
        });
    }));
};

Reservations.prototype.showMoreReservationsModal = function (upcoming, previous, addUrl, editUrl) {
    store.dispatch(
        ReservationActions.showMoreReservationsModal(true, upcoming, previous, addUrl, editUrl)
    );
};

Reservations.prototype.handleLaunchTimeTrade = function (
        url, closeAllReservationsModal, appId, lastname) {
    if (closeAllReservationsModal) {
        store.dispatch(ReservationActions.showMoreReservationsModal(false));
    }
    ReservationUtils.launchTimeTrade(url, appId, lastname);
};

Reservations = ensureUserIsSignedIn(Reservations);


// Added by sephora-jsx-loader.js
module.exports = Reservations.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Reservations/Reservations.c.js