const TYPES = {
    SET_RESULTS: 'SET_RESULTS'
};

function setResults(results) {
    return {
        type: TYPES.SET_RESULTS,
        results: results
    };
}

module.exports = {
    TYPES,
    setResults
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/TargeterActions.js