// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ListsStoreServices = function () {};

// Added by sephora-jsx-loader.js
ListsStoreServices.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const profileApi = require('services/api/profile/index');
const localeUtils = require('utils/LanguageLocale');
const CAROUSEL_SAMPLES_LIMIT = 16;
const actions = require('Actions');
const dmgUtils = require('utils/dmg');

ListsStoreServices.prototype.ctrlr = function () {
    let user = store.getState().user;
    profileApi.getProfileSamplesByDMG(
        user.profileId,
        { 
            limit: CAROUSEL_SAMPLES_LIMIT,
            includeInactiveSkus: true,
            itemsPerPage: CAROUSEL_SAMPLES_LIMIT
        }
    ).then(skus => {
        if (skus.length) {
            let services = dmgUtils.combineSkusIntoServices(skus);

            // Only display samples from most recent service
            /* eslint-disable array-callback-return */
            this.setState({
                digitalMakeoverSamples: services[0].skus,
                showStoreServices: true
            });
        } else if (localeUtils.isUS()) {
            // Show module with book a reservation button for US clients or CA clients
            // with previous store makeovers (only in US). Hide completely for CA clients
            // with no previous in store makeovers
            this.setState({
                showStoreServices: true,
                showBookReservation: true
            });
        }
    });
};

ListsStoreServices.prototype.showFindInStore = function (e, product) {
    e.preventDefault();
    store.dispatch(actions.showFindInStoreModal(true, product));
};


// Added by sephora-jsx-loader.js
module.exports = ListsStoreServices.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/Lists/ListsStoreServices/ListsStoreServices.c.js