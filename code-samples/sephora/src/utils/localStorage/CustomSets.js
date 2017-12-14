const Storage = require('utils/localStorage/Storage');

const KEYS = {
    CUSTOM_SET_CHOICES: 'custom_sets_last_choices'
};

let setCustomSetsChoices = function (choices, productId, sessionId) {
    Storage.local.setItem(KEYS.CUSTOM_SET_CHOICES, {
        productId,
        sessionId,
        choices
    });
};

let getCustomSetsChoices = function () {
    return Storage.local.getItem(KEYS.CUSTOM_SET_CHOICES);
};

let deleteCustomSetsChoices = function () {
    return Storage.local.removeItem(KEYS.CUSTOM_SET_CHOICES);
};

module.exports = {
    KEYS,
    setCustomSetsChoices,
    getCustomSetsChoices,
    deleteCustomSetsChoices
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/localStorage/CustomSets.js