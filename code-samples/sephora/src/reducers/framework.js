var ACTION_TYPES = require('../actions/FrameworkActions').TYPES;

const initialState = {
    queryParams: {}
};

module.exports = function(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_QUERY_PARAMS:
            return Object.assign({}, state, {
                queryParams: action.queryParams
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/framework.js