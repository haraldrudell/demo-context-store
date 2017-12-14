// This module provides API call methods for Sephora Commerce Authentication APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Authentication+APIs


// TO WHOM IT MAY CONCERN,
//
// Please do your best honest work of factoring out any of the related API
// calls from other places into this module as soon as there's an assignment
// related to this scope.


let login = require('./login');
let logout = require('./logout');
let resetPasswordByLogin = require('./resetPasswordByLogin');

module.exports = {
    login,
    logout,
    resetPasswordByLogin
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/authentication/index.js