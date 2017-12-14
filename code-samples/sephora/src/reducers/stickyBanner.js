var ACTION_TYPES = require('../actions/Actions').TYPES;

const initialState = {
    isOpen: false,
    height: 0
};

module.exports = function (state = initialState, action = {}) {
    switch (action.type) {
        case ACTION_TYPES.SHOW_STICKY_BANNER:
            return Object.assign({}, state, {
                isOpen: action.isOpen,
                height: action.height
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/stickyBanner.js