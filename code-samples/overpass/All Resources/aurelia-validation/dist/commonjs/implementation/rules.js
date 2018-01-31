"use strict";
/**
 * Sets, unsets and retrieves rules on an object or constructor function.
 */
var Rules = (function () {
    function Rules() {
    }
    /**
     * Applies the rules to a target.
     */
    Rules.set = function (target, rules) {
        if (target instanceof Function) {
            target = target.prototype;
        }
        Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
    };
    /**
     * Removes rules from a target.
     */
    Rules.unset = function (target) {
        if (target instanceof Function) {
            target = target.prototype;
        }
        target[Rules.key] = null;
    };
    /**
     * Retrieves the target's rules.
     */
    Rules.get = function (target) {
        return target[Rules.key] || null;
    };
    /**
     * The name of the property that stores the rules.
     */
    Rules.key = '__rules__';
    return Rules;
}());
exports.Rules = Rules;



//////////////////
// WEBPACK FOOTER
// ./~/aurelia-validation/dist/commonjs/implementation/rules.js
// module id = 152
// module chunks = 1