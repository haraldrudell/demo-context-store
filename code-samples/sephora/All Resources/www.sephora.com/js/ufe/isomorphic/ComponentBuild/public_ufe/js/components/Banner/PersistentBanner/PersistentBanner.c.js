// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var PersistentBanner = function () {};

// Added by sephora-jsx-loader.js
PersistentBanner.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const Location = require('utils/Location');
const store = require('Store');
const watch = require('redux-watch');

PersistentBanner.prototype.ctrlr = function () {
    // Suppress persistent banners on:
    //  basket, gallery,my profie photos, and gallery albums
    this.setState({
        isRendered: !Location.isBasketPage() && !Location.isGalleryPage() &&
            !Location.isGalleryAlbumPage() && !Location.isGalleryProfilePage()
    });

    if (Sephora.isMobile()) {
        const searchWatch = watch(store.getState, 'search');
        store.subscribe(searchWatch((newState) => {
            this.setState({ isOpen: !newState.focus });
        }));
    }
};


// Added by sephora-jsx-loader.js
module.exports = PersistentBanner.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Banner/PersistentBanner/PersistentBanner.c.js