var ACTION_TYPES = require('../actions/Actions').TYPES;

const initialState = {
    isVisible: false
};

module.exports = function(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_INTERSTICE:
            return Object.assign({}, state, {
                isVisible: action.isVisible
            });

        default:
            return state;
    }
};


// WEBPACK FOOTER //
// ./public_ufe/js/reducers/interstice.js