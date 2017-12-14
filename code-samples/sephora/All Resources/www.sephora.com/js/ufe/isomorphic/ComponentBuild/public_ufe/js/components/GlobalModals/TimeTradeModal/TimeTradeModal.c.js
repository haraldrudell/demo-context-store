// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TimeTradeModal = function () {};

// Added by sephora-jsx-loader.js
TimeTradeModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const ReservationActions = require('actions/ReservationActions');
const ReservationUtils = require('utils/Reservations');

TimeTradeModal.prototype.ctrlr = function () {
    let userParams =
        ReservationUtils.getUserParams(
            store.getState('user').user,
            this.props.appointmentId,
            this.props.clientLastName
        );
    this.postToIframe(this.props.timeTradeUrl, userParams, 'olrVendorContent');
};

TimeTradeModal.prototype.close = function () {
    const userId = store.getState('user').user.profileId;
    store.dispatch(ReservationActions.getReservations(userId));
    store.dispatch(ReservationActions.showTimeTradeModal(false));
};

TimeTradeModal.prototype.postToIframe = function (path, params, target) {
    let form = document.getElementById('formForIframe');

    if (form !== null) {
        if (form.length > 0) {
            form.parentNode.removeChild(form);
        }
    }

    form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('target', target);
    form.setAttribute('action', path);
    form.setAttribute('id', 'formForIframe');

    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            let hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);
            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
};


// Added by sephora-jsx-loader.js
module.exports = TimeTradeModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/TimeTradeModal/TimeTradeModal.c.js