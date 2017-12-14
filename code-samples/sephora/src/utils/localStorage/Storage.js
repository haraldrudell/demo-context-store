const helpers = require('utils/Helpers');

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;

function isDataExpired (expiry) {
    return Date.parse(expiry) < new Date().getTime();
}

function Storage (type) {
    this.storage = type;
}

Storage.prototype.getItem = function (key, ignoreExpiry = false) {
    let value = this.storage.getItem(key);
    let parsedValue;

    try {
        parsedValue = JSON.parse(value);
    } catch (e) {
        return null;
    }

    if (helpers.isObject(parsedValue)) {
        const {
            data = null,
            expiry = null
        } = parsedValue;

        if (expiry && !ignoreExpiry && isDataExpired(expiry)) {
            return null;
        }

        return data;
    }

    return parsedValue;
};

Storage.prototype.setItem = function (key, value, expiry = null) {
    let data = { data: value };

    if (expiry) {
        const date = typeof expiry === 'number' ? new Date(Date.now() + expiry) : expiry;
        data.expiry = date;
    }

    try {
        this.storage.setItem(key, JSON.stringify(data));
    } catch (e) {
        return;
    }
};

Storage.prototype.removeItem = function (key) {
    return this.storage.removeItem(key);
};

let local = {};
let session = {};

if (!Sephora.isRootRender) {
    local = new Storage(window.localStorage);
    session = new Storage(window.sessionStorage);
}

module.exports = {
    local,
    session,
    SECONDS,
    MINUTES,
    HOURS
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/localStorage/Storage.js