// Do not use this for large objects.
function getObjectValuesSlowNDirty(obj) {
    let values = [];
    if (!obj) {
        return values;
    }

    let keys = Object.keys(obj);

    for (let i = 0, l = keys.length; i < l; i++) {
        let k = keys[i];
        let val = obj[k];
        if (values.indexOf(val) === -1) {
            values.push(val);
        }
    }

    return values;
}

/**
 * @param {Object} obj
 * @param {Function} isInListFunc Function that test a given key against a list of valid keys.
 */
function filterObjectValuesByKey(obj, existsInList) {
    let result = [];
    let keys = Object.keys(obj);

    for (let i = 0, end = keys.length; i < end; i++) {
        if (typeof existsInList === 'function' && existsInList(keys[i])) {
            result.push(obj[keys[i]]);
        }
    }

    return result;
}

module.exports = {
    getObjectValuesSlowNDirty,
    filterObjectValuesByKey
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/javascript.js