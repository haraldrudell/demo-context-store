const LOCAL_STORAGE = require('utils/localStorage/Constants');
const Storage = require('utils/localStorage/Storage');
const legacyMwebApi = require('services/api/legacy-mweb');

const TYPES = { UPDATE_CATEGORIES: 'UPDATE_CATEGORIES' };

function updateCategories(categories) {
    return {
        type: TYPES.UPDATE_CATEGORIES,
        categories: categories
    };
}

function fetchCategories() {
    return (dispatch) => {
        legacyMwebApi.getCategoryHierarchy().
            then(data => {
                // Expires at 2 PM UTC (6 AM PST) of next day
                let expiry = new Date();
                const expiryTime = 14;

                expiry.setDate(expiry.getDate() + 1);
                expiry.setUTCHours(expiryTime);
                expiry.setUTCMinutes(0);
                expiry.setUTCSeconds(0);

                Storage.local.setItem(LOCAL_STORAGE.CATNAV, data, expiry);
                dispatch(updateCategories(data));
            });
    };
}

module.exports = {
    TYPES,
    fetchCategories,
    updateCategories
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/CategoryActions.js