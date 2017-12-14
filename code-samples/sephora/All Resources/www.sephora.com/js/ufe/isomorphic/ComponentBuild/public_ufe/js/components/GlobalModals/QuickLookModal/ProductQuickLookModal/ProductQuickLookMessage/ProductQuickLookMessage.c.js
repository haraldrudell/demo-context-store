// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var ProductQuickLookMessage = function () {};

// Added by sephora-jsx-loader.js
ProductQuickLookMessage.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const auth = require('utils/Authentication');
const showBiRegisterModal = require('Actions').showBiRegisterModal;
const userUtils = require('utils/User');
const watch = require('redux-watch');

ProductQuickLookMessage.prototype.ctrlr = function () {
    this.setStateForUser(store.getState().user);

    let w = watch(store.getState, 'user');

    store.subscribe(w((newVal, oldVal, objectPath) => {
        this.setStateForUser(newVal);
    }));
};

ProductQuickLookMessage.prototype.setStateForUser = function (newVal) {
    this.setState({
        isUserAnonymous: userUtils.isAnonymous(),
        isUserSignedIn: userUtils.isSignedIn(),
        isUserBI: userUtils.isBI(),
        isUserRecognized: userUtils.isRecognized(),
        isBiLevelQualifiedFor: userUtils.isBiLevelQualifiedFor(this.props.currentSku),
        profileStatus: newVal.profileStatus
    });
};

ProductQuickLookMessage.prototype.signInHandler = function () {
    auth.requireAuthentication();
};

ProductQuickLookMessage.prototype.biRegisterHandler = function () {
    // sign up for beauty insider modal needs to be implemented
    store.dispatch(showBiRegisterModal(true));
};

ProductQuickLookMessage.prototype.emailMeWhenInStockHandler = function (e) {
    let showEmailMeWhenInStockModal = require('Actions').showEmailMeWhenInStockModal;
    store.dispatch(
        showEmailMeWhenInStockModal(true, this.props.product, this.props.currentSku, true)
    );
};


// Added by sephora-jsx-loader.js
module.exports = ProductQuickLookMessage.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookMessage/ProductQuickLookMessage.c.js