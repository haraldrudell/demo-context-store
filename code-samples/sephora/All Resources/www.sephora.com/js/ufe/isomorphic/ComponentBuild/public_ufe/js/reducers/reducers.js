var Constants = require('utils/framework/Constants');
var combineReducers = require('redux').combineReducers;
var basket = require('./basket');
var category = require('./category');
var framework = require('./framework');
var hamburger = require('./hamburger');
var interstice = require('./interstice');
var modals = require('./modals');
var productGrid = require('./productGrid');
var productSort = require('./productSort');
var user = require('./user');
var productFilters = require('./productFilters');
var loves = require('./loves');
var product = require('./product');
var search = require('./search');
var stickyBanner = require('./stickyBanner');
var productRecs = require('./productRecs');
var inlineBasket = require('./inline-basket');
var testTarget = require('./testTarget');
var targeters = require('./targeters');
var welcomeMat = require('./welcomeMat');
var termsConditions = require('./termsConditions');
var samples = require('./samples');
var rewards = require('./rewards');
var promo = require('./promo');
var applePaySession = require('./applePaySession');
var reduxActionWatch = require('redux-action-watch');
var reservations = require('./reservations');
const profile = require('./profile');
const socialInfo = require('./socialInfo');
const virtualArtist = require('./virtualArtist');

const ufe = combineReducers({
    basket,
    inlineBasket,
    category,
    framework,
    hamburger,
    interstice,
    loves,
    modals,
    productGrid,
    productSort,
    productFilters,
    user,
    product,
    search,
    stickyBanner,
    productRecs,
    targeters,
    testTarget,
    welcomeMat,
    termsConditions,
    samples,
    rewards,
    applePaySession,
    promo,
    [Constants.ACTION_WATCHER_STATE_NAME]: reduxActionWatch.reducer,
    reservations,
    profile,
    socialInfo,
    virtualArtist
});

module.exports = ufe;



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/reducers.js