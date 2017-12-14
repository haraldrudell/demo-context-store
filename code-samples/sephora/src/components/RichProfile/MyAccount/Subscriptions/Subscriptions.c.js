// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Subscriptions = function () {};

// Added by sephora-jsx-loader.js
Subscriptions.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const { ensureUserIsSignedIn } = require('utils/decorators');
const userUtils = require('utils/User');
const store = require('Store');
const watch = require('redux-watch');

Subscriptions.prototype.ctrlr = function (user) {
    let isRouge = userUtils.getBiStatus() === userUtils.types.ROUGE;

    this.setState({
        flash: user.subscriptionPrograms.flash,
        play: user.subscriptionPrograms.play,
        isRouge: isRouge
    });

    if (isRouge && !this.state.flash.isActive) {
        let flashInfoWatch = watch(store.getState, 'user.subscriptionPrograms.flash');
        store.subscribe(flashInfoWatch(newFlashInfo => {
            this.setState({
                flash: newFlashInfo
            });
        }));
    }
};

Subscriptions = ensureUserIsSignedIn(Subscriptions);


// Added by sephora-jsx-loader.js
module.exports = Subscriptions.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/Subscriptions/Subscriptions.c.js