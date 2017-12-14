const biApi = require('services/api/beautyInsider');

const TYPES = { SET_REWARDS: 'SET_REWARDS' };

function setRewards(rewards) {
    return {
        type: TYPES.SET_REWARDS,
        rewards: rewards
    };
}

function fetchProfileRewards() {
    return (dispatch) => {
        biApi.getBiRewardsGroupForCheckout().
            then(data => dispatch(setRewards(data)));
    };
}

module.exports = {
    TYPES,
    fetchProfileRewards
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/RewardActions.js