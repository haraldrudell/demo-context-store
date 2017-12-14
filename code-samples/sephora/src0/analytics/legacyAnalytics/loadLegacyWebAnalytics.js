/** 
 * Load legacy analytics files. These files were previously 
 * script libraries within our tag management system (Signal).
 * They contain so much logic and interdependency they are not
 * safe to re-write now. 
 * We will slowly convert things to fit into our modern approach
 * as we go.
 */

module.exports = (function(){ "use strict";

    require('analytics/legacyAnalytics/wa');

}());


// WEBPACK FOOTER //
// ./public_ufe/js/analytics/legacyAnalytics/loadLegacyWebAnalytics.js