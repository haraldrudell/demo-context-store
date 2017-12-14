/* eslint-disable camelcase */
const store = require('Store');
const ReservationActions = require('actions/ReservationActions');

function launchForMobile(url, userParams) {
    let form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', url);

    for (let key in userParams) {
        if (userParams.hasOwnProperty(key)) {
            let hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', userParams[key]);
            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function getUserParams(user, appId, lastname) {
    const isEdit = appId && lastname;
    let userParams = {};

    if (isEdit) {
        userParams = {
            appointmentId: appId,
            attendee_person_lastName: lastname
        };
    } else {
        userParams = {
            attendee_person_firstName: user.firstName || '',
            attendee_person_lastName: user.lastName || '',
            attendee_email: user.login || '',
            attendee_mobile_phoneNumber: user.phoneNumber || '',
            attendee_customField0: user.timeTradeBiStatus || '',
            attendee_customField1: user.profileId || '',
            schedule_client_ref: user.attendeeId || ''
        };
    }

    return userParams;
}

function launchTimeTrade(url, appId, lastname) {
    const user = store.getState('user').user;
    if (Sephora.isDesktop()) {

        //make reservation api call to launch signin modal if user is recognized
        store.dispatch(ReservationActions.getReservations(user.profileId));

        //TEMPORARY FIX: api needs to be updated to return
        //correct parameters for add/edit url based on channel
        //TODO: api fix needs to happen in 17.4
        url = url.replace('?ch=MOBILEWEB', '?view=embed&ch=DOTCOM');
        store.dispatch(
            ReservationActions.showTimeTradeModal(true, url, appId, lastname)
        );
    } else {
        //launch time trade for mobile
        let userParams = getUserParams(user, appId, lastname);
        launchForMobile(url, userParams);
    }
}

module.exports = {
    launchTimeTrade,
    getUserParams
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Reservations.js