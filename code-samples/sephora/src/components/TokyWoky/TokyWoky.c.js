// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TokyWoky = function () {};

// Added by sephora-jsx-loader.js
TokyWoky.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const tokyWokyApi = require('services/api/thirdparty/tokyWoky');

TokyWoky.prototype.ctrlr = function () {
    if (!window.Sephora.TokyWoky) {
        window.Sephora.TokyWoky = tokyWokyApi;
    }

    if (!this.state.isTokyWokyReady) {
        // Need to make sure user data is ready in the store since we can only
        // include the toky woky script once on the page
        let user = store.getState().user;
        let isUserReady = user.profileLocale !== undefined;
        if (!isUserReady) {
            let userWatch = watch(store.getState, 'user');
            store.subscribe(userWatch(readyUser => {
                if (readyUser.isSocialEnabled) {
                    this.requestSSOToken();
                } else {
                    this.setState({ isTokyWokyReady: true });
                }
                userWatch();
            }));
        } else if (user.isSocialEnabled) {
            this.requestSSOToken();
        } else {
            this.setState({ isTokyWokyReady: true });
        }
    }
};

TokyWoky.prototype.requestSSOToken = function () {
    tokyWokyApi.getTokyWokySSOToken().then(data => {
        this.setState({
            tokyWokyAuthPublicKey: data.tokyWokyAuthPublicKey,
            tokyWokyAuthMessage: data.tokyWokyAuthMessage,
            tokyWokyAuthHmac: data.tokyWokyAuthHmac,
            tokyWokyAuthTimestamp: data.tokyWokyAuthTimestamp,
            isTokyWokyReady: true
        });
    });
};



// Added by sephora-jsx-loader.js
module.exports = TokyWoky.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/TokyWoky/TokyWoky.c.js