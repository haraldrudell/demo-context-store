// This module provides API call methods for Sephora Commerce
// Search & Browse APIs:
// https://jira.sephora.com/wiki/pages/viewpage.action?pageId=120041949

let getProductDetails = require('./getProductDetails');
let getSkuDetails = require('./getSkuDetails');
let findInStore = require('./findInStore');
let searchProductsByKeyword = require('./searchProductsByKeyword');
let searchTypeAhead = require('./searchTypeAhead');
let getNthLevelCategory = require('./getNthLevelCategory');

module.exports = {
    getProductDetails,
    getSkuDetails,
    findInStore,
    searchProductsByKeyword,
    searchTypeAhead,
    getNthLevelCategory
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/search-n-browse/index.js