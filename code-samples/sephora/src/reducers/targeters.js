var TARGETER_ACTION_TYPES = require('actions/TargeterActions').TYPES;

const initialState = {
    results: []
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case TARGETER_ACTION_TYPES.SET_RESULTS:
            return Object.assign({}, state, {
                results: action.results
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/targeters.js