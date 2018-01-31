"use strict";
/**
* Validation triggers.
*/
exports.validateTrigger = {
    /**
    * Manual validation.  Use the controller's `validate()` and  `reset()` methods
    * to validate all bindings.
    */
    manual: 0,
    /**
    * Validate the binding when the binding's target element fires a DOM "blur" event.
    */
    blur: 1,
    /**
    * Validate the binding when it updates the model due to a change in the view.
    */
    change: 2,
    /**
     * Validate the binding when the binding's target element fires a DOM "blur" event and
     * when it updates the model due to a change in the view.
     */
    changeOrBlur: 3
};



//////////////////
// WEBPACK FOOTER
// ./~/aurelia-validation/dist/commonjs/validate-trigger.js
// module id = 96
// module chunks = 1