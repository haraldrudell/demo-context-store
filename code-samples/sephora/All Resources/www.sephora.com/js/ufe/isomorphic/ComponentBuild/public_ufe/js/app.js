/* eslint-disable */

const UrlUtils = require('utils/Url');
const LanguageLocale = require('utils/LanguageLocale');

if (Sephora.isThirdPartySite) {
    __webpack_public_path__ = UrlUtils.getLink('/js/ufe/isomorphic/');
} else if (LanguageLocale.getCurrentLanguage() === 'fr') {
    __webpack_public_path__ = '/fr-ca/js/ufe/isomorphic/';
}

//Polyfills
require('whatwg-fetch');
require('core-js/fn/object/assign');
require('core-js/fn/promise');
require('core-js/fn/symbol');
require('utils/shims/ObjectValues');

// First file to run when priority.bundle.js has loaded.
// Any pre-initialization code should be placed in here.
require('utils/framework/PriorityLoaded');

// Place all async rendered components in Sephora.Comps.
// Initialize component inflation logic, e.g. ApplyCtrlr & renderQueue
// Require.ensure inPageList.js which will add <script src="compnents.chunk.js"> to the page
require('utils/framework/InflateComponents');

// = Initialize the third party services = //
// These are listed in order of priority.
// Generally speaking each of these hooks up to any third party JS files needed
// and or requests expected data from the third party service.
// Once that data is returned it should first poppulate the store with that data
// and then run renderQueue for any async render components proiritized with that service.
require('services/UserInfo');
require('services/TestTarget');
require('services/Certona');
require('services/PostLoad');



// WEBPACK FOOTER //
// ./public_ufe/js/app.js