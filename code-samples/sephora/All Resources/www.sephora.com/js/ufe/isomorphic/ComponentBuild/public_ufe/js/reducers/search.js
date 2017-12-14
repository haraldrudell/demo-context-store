var SEARCH_ACTION_TYPES = require('actions/SearchActions').TYPES;
const Location = require('utils/Location');

const initialState = {
    focus: false,
    isFixed: false,
    isTooltipVisible: false,
    inline: Location.isHomePage()
};

module.exports = function (state = initialState, action) {
    let newVal;
    switch (action.type) {
        case SEARCH_ACTION_TYPES.CLEAR_SEARCH:
            return Object.assign({}, state, {
                focus: action.focus
            });
        case SEARCH_ACTION_TYPES.TOGGLE_FIXED_SEARCH:
            newVal = typeof(action.focus) === 'boolean' ? action.focus : !state.focus;
            return Object.assign({}, state, {
                focus: newVal,
                isFixed: newVal
            });
        case SEARCH_ACTION_TYPES.TOGGLE_SEARCH:
            newVal = !state.inline;
            return Object.assign({}, state, {
                inline: newVal,
                focus: false
            });
        case SEARCH_ACTION_TYPES.HIDE_SEARCH:
            return Object.assign({}, state, {
                isFixed: false,
                inline: false,
                focus: false
            });
        case SEARCH_ACTION_TYPES.SHOW_PREVIOUS_SEARCH:
            return Object.assign({}, state, {
                results: action.results,
                focus: true
            });
        case SEARCH_ACTION_TYPES.HIDE_SEARCH_RESULTS:
            return Object.assign({}, state, {
                focus: false
            });
        case SEARCH_ACTION_TYPES.SHOW_SEARCH_RESULTS:
            return Object.assign({}, state, {
                results: action.results,
                focus: true
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/search.js