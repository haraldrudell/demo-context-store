const ACTION_TYPES = require('actions/RewardActions').TYPES;
const initialState = {
    rewards: null
};
module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_REWARDS:
            return Object.assign({}, state, {
                rewards: action.rewards
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/rewards.js