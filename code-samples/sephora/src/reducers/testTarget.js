const TARGET_ACTION_TYPES = require('actions/TestTargetActions').TYPES;

const initialState = {
    offers: {},
    timeout: false,
    swaps: {}
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case TARGET_ACTION_TYPES.SET_OFFERS:
            const offers = Object.assign({}, state.offers, action.offers);
            return Object.assign({}, state, {
                offers: offers
            });
        case TARGET_ACTION_TYPES.CANCEL_OFFERS:
            return Object.assign({}, state, {
                timeout: action.timeout
            });
        case TARGET_ACTION_TYPES.SET_SWAP_COMPONENT:
            let newState = state.swaps[action.testName].slice();
            newState.push(action.component);

            return Object.assign({}, state, {
                swaps: {
                    [action.testName]: newState
                }
            });
        case TARGET_ACTION_TYPES.REGISTER_TEST:
            return Object.assign({}, state, {
                swaps: {
                    [action.testName]: []
                }
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/testTarget.js