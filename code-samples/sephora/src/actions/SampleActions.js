var basketApi = require('services/api/basket');

const TYPES = {
    SET_SAMPLES: 'SET_SAMPLES'
};

function setSamples(samples) {
    return {
        type: TYPES.SET_SAMPLES,
        samples: samples
    };
}

// TODO: Update the fetch to be handled in the Store
function fetchSamples(callback) {
    return dispatch => {
        basketApi.getSamples().then(data => dispatch(setSamples(data)));
    };
}

module.exports = {
    TYPES,
    fetchSamples
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/SampleActions.js