if (!Object.values) {
    Object.values = function (object) {
        return object && typeof object === 'object' ?
            Object.keys(object).map(key => object[key]) : [];
    };
}



// WEBPACK FOOTER //
// ./public_ufe/js/utils/shims/ObjectValues.js