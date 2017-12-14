var ACTION_TYPES = require('../actions/Actions').TYPES;
var USER_ACTION_TYPES = require('../actions/UserActions').TYPES;

const initialState = {
    isOpen: false,
    openItem: null
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_HAMBURGER_MENU:
            let toggle = action.isOpen ? action.isOpen : !state.isOpen;

            return Object.assign({}, state, {
                isOpen: toggle,
                openItem: null
            });
        case USER_ACTION_TYPES.UPDATE:
            return Object.assign({}, state, {
                isOpen: false,
                openItem: null
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/hamburger.js