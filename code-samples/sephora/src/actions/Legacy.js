const TYPES = {
    LEGACY_HANDLED: 'LEGACY_HANDLED'
};

let handleLegacy = function (legacyFunction, ...args) {
    let legacyResult = null;

    try {
        if (legacyFunction) {
            legacyResult = legacyFunction(...args);
        } else {
            throw('ERROR: Required Legacy Shim Missing');
        }
    } catch (e) {
        console.error(e);
    }

    return legacyResult || {
        type: TYPES.LEGACY_HANDLED
    };
};

let wrapForLegacyAction = function (legacyFunction, ufeFunction) {
    if (Sephora.isLegacyMode) {
        return handleLegacy.bind(null, legacyFunction);
    } else {
        return ufeFunction;
    }
};

module.exports = {
    TYPES: TYPES,
    wrapForLegacyAction: wrapForLegacyAction
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/Legacy.js