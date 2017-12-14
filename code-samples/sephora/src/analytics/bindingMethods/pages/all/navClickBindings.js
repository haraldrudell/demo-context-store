var utils = require('analytics/utils');

module.exports = (function () {

    return {

        trackNavClick: function (path) {
            path = utils.removeUndefinedItems(path);

            utils.arrayItemsToLowerCase(path);

            utils.setNextPageData({ navigationInfo: utils.buildNavPath(path) });
        }

    };
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindingMethods/pages/all/navClickBindings.js