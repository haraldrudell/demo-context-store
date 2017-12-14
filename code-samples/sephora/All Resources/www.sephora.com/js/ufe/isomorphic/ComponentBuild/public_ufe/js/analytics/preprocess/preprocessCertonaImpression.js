/**
 * Used later to determine if carousels were actually on the page and whether we should report that.
 */

module.exports = (function () {
    let isCertonaShown = false;

    let setShownStatus = (isOn) => isCertonaShown = isOn;

    let getShownStatus = () => isCertonaShown;

    /* This function property is used to determine if we should check for this method to return
    ** true before proceeding with this event. */
    getShownStatus.isConditional = true;

    return {
        getShownStatus,
        setShownStatus
    };

}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/preprocess/preprocessCertonaImpression.js