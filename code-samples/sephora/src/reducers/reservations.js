var RESERVATION_ACTION_TYPES = require('../actions/ReservationActions').TYPES;

const initialState = {
    upcoming: [],
    previous: [],
    addUrl: '',
    editUrl: '',
    error: ''
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case RESERVATION_ACTION_TYPES.GET_RESERVATIONS:
            return Object.assign({}, state, {
                upcoming: action.upcomingReservations,
                previous: action.previousReservations,
                addUrl: action.addUrl,
                editUrl: action.editUrl,
                error: action.error
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/reservations.js