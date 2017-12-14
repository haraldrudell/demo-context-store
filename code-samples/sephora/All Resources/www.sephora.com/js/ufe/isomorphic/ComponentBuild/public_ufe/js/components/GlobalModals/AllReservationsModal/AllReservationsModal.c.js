// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var AllReservationsModal = function () {};

// Added by sephora-jsx-loader.js
AllReservationsModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const ReservationActions = require('actions/ReservationActions');

AllReservationsModal.prototype.close = function () {
    store.dispatch(ReservationActions.showMoreReservationsModal(false));
};


// Added by sephora-jsx-loader.js
module.exports = AllReservationsModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/AllReservationsModal/AllReservationsModal.c.js