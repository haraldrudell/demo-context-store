const ACTION_TYPES = require('actions/SampleActions').TYPES;

const initialState = {
    samples: null,
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_SAMPLES:
            return Object.assign({}, state, action.samples);
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/samples.js