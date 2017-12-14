let LEGACY_MW_JSTORAGE = require('utils/localStorage/Constants').LEGACY_MW_JSTORAGE;

function getLegacyJStorage() {
    let jStorage = window.localStorage.getItem(LEGACY_MW_JSTORAGE) || '{}';
    return JSON.parse(jStorage);
}

module.exports = (function () {
    return {
        getLegacyJStorageItem: function (key) {
            let jStorage = getLegacyJStorage();
            return jStorage[key];
        },

        setLegacyJStorageItem: function (key, value) {
            let jStorage = getLegacyJStorage();
            jStorage[key] = value;
            window.localStorage.setItem(LEGACY_MW_JSTORAGE, JSON.stringify(jStorage));
        },

        deleteLegacyJStorageItem: function (key) {
            let jStorage = getLegacyJStorage();
            if (jStorage[key]) {
                delete jStorage[key];
            }

            window.localStorage.setItem(LEGACY_MW_JSTORAGE, JSON.stringify(jStorage));
        }
    };
})();



// WEBPACK FOOTER //
// ./public_ufe/js/utils/localStorage/LegacyMW.js