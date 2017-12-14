/**
 * Create globally accessible promises that can be resolved from anywhere, including Signal.
 *
 * These promises represent the major dependencies that all other analytics
 * event rely on.
 */
module.exports = (function () {

    Sephora.analytics.promises = {};
    Sephora.analytics.resolvePromises = {};

    /**
     * Wait for Signal (our tag management system) to be ready before firing events to it
     * Resolve: Called from Signal tag "Tag Management System Ready", firing rules
     */
    Sephora.analytics.promises.tagManagementSystemReady = new Promise(
        function (resolve, reject) {
            Sephora.analytics.resolvePromises.tagManagementSystemReady = resolve;
        }
    );

    /**
     * Wait for our initial page load tag to have fired before firing any subsequent tags.
     * All subsequent async page load tags depend on the vars set in this tag.
     * Resolve: Called from Signal tag "Global :: Page-load Tracking", Additional Configuration
     */
    Sephora.analytics.promises.initialPageLoadFired = new Promise(
        function (resolve, reject) {
            Sephora.analytics.resolvePromises.initialPageLoadFired = resolve;
        }
    );

    /**
     * Wait for Bluecore library to be available before any bluecore event is fired
     */
    Sephora.analytics.promises.bluecoreReady = new Promise(
        function (resolve, reject) {
            Sephora.analytics.resolvePromises.bluecoreReady = resolve;
        }
    );

    /**
     * Wait for product data to be ready
     */
    Sephora.analytics.promises.productDataReady = new Promise(
        function (resolve, reject) {
            Sephora.analytics.resolvePromises.productDataReady = resolve;
        }
    );

}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/promises.js