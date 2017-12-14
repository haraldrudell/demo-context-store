/* eslint-disable camelcase */
const profileApi = require('services/api/profile');

const TYPES = {
    SHOW_MORE_RESERVATIONS_MODAL: 'SHOW_MORE_RESERVATIONS_MODAL',
    SHOW_TIME_TRADE_MODAL: 'SHOW_TIME_TRADE_MODAL',
    GET_RESERVATIONS: 'GET_RESERVATIONS'
};

function setReservations(response) {
    return {
        type: TYPES.GET_RESERVATIONS,
        upcomingReservations: response.upcomingReservations || [],
        previousReservations: response.previousReservations || [],
        addUrl: response.addUrl,
        editUrl: response.editUrl,
        error: response.errors
    };
}

// Whether call fails or is successful, still dispatch setReservations
function getReservations(profileId) {
    return (dispatch) => {
        profileApi.getReservations(profileId).
            then(data => dispatch(setReservations(data))).
            catch(data => dispatch(setReservations(data)));
    };
}

module.exports = {
    TYPES: TYPES,

    showMoreReservationsModal: function (isOpen, upcoming, previous, addUrl, editUrl) {
        return {
            type: TYPES.SHOW_MORE_RESERVATIONS_MODAL,
            reservationInfo: {
                isOpen: isOpen,
                upcomingReservations: upcoming,
                previousReservations: previous,
                addReservationUrl: addUrl,
                editReservationUrl: editUrl
            }
        };
    },

    showTimeTradeModal: function (isOpen, timeTradeUrl, appointmentId, clientLastName) {
        return {
            type: TYPES.SHOW_TIME_TRADE_MODAL,
            reservationInfo: {
                isOpen: isOpen,
                timeTradeUrl: timeTradeUrl,
                appointmentId: appointmentId,
                clientLastName: clientLastName
            }
        };
    },

    getReservations: getReservations

};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/ReservationActions.js