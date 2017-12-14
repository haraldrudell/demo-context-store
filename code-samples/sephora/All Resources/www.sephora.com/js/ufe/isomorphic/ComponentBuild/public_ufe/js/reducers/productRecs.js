const ACTION_TYPES = require('actions/CertonaActions').TYPES;

const initialState = {
    skuGroups: [],
    quizResults: [],
    isQuizSubmitted: false
};

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_CAROUSEL:
            return Object.assign({}, state, {
                skuGroups: action.recs
            });
        case ACTION_TYPES.PRODUCT_FINDER_DATA:
            return Object.assign({}, state, {
                quizResults: action.productFinderData
            });
        case ACTION_TYPES.IS_QUIZ_SUBMITTED:
            return Object.assign({}, state, {
                isQuizSubmitted: action.isQuizSubmitted
            });

        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/productRecs.js