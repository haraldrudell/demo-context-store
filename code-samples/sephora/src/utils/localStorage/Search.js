const Storage = require('utils/localStorage/Storage');

const KEYS = {
    STORAGE_PREVIOUS_RESULTS: 'search_previous_results',
    MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS: 3,
    MAX_PREVIOUS_RESULTS_COUNT: 5
};

let setSearchTermStorageItem = function (term) {
    let data = Storage.local.getItem(KEYS.STORAGE_PREVIOUS_RESULTS);
    term = term.toLowerCase();
    if (data) {
        if (!data.filter(result => result.term === term).length) {
            data.unshift({ term: term });
        }
    } else {
        data = [{ term: term }];
    }
    Storage.local.setItem(KEYS.STORAGE_PREVIOUS_RESULTS,
        data.slice(0, KEYS.MAX_PREVIOUS_RESULTS_COUNT));
};

let isPreviousSearchItem = function (term) {
    let data = Storage.local.getItem(KEYS.STORAGE_PREVIOUS_RESULTS);
    term = term.toLowerCase();

    if (data && data.filter(result => result.term === term).length) {
        return true;
    }

    return false;
};

module.exports = {
    KEYS: KEYS,
    setSearchTermStorageItem: setSearchTermStorageItem,
    isPreviousSearchItem: isPreviousSearchItem
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/localStorage/Search.js