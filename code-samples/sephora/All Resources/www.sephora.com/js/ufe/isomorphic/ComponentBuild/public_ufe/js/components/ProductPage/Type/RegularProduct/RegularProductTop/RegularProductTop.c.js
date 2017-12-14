// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var RegularProductTop = function () {};

// Added by sephora-jsx-loader.js
RegularProductTop.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const LocationUtils = require('utils/Location.js');
const store = require('Store');
const Modiface = require('services/api/thirdparty/Modiface');
const ProductWatcher = require('../../ProductWatcher');
const ProductActions = require('actions/ProductActions');
const SearchActions = require('actions/SearchActions');
const olapicUtils = require('utils/Olapic');
const TestTargetUtils = require('utils/TestTarget.js');

RegularProductTop.prototype.ctrlr = function () {
    // Initial population of the product data in the store
    store.dispatch(ProductActions.updateCurrentProduct(this.props.currentProduct));

    ProductWatcher.processSkuId(this);
    ProductWatcher.watchProductAndUser(this);
    ProductWatcher.watchTestTarget(this, (PPageTestAndTargetData) => {
        let targetResults = TestTargetUtils.checkTestAndTargetFlags(PPageTestAndTargetData);
        this.setState({ targetResults, targetResolved: true });
        Modiface.isProductEnabledForSVA(this.state.currentProduct).then(() => {
            store.setAndWatch('virtualArtist', null, (value) => {
                let newState = {
                    virtualArtist: {}
                };
                if (value.virtualArtist.model) {
                    newState.virtualArtist.media = Modiface.
                    convertModelToMedia(value.virtualArtist.model);
                }
                newState.virtualArtist.appliedMakeupImage = value.virtualArtist.appliedMakeupImage;
                this.setState(newState);
            });
        }).catch(() => {});
    });

    if (Sephora.isMobile()) {
        this.activateCustomSetsNavigation();
    }

    //include global functions needed by Olapic
    olapicUtils.includeOlapicScripts();

    //Analytics
    require.ensure([], function (require) {
        const productPageBindings =
            require('analytics/bindingMethods/pages/productPage/productPageBindings');
        productPageBindings.initializeAnalyticsObjectWithProductData();
    }, 'components');
};

RegularProductTop.prototype.activateCustomSetsNavigation = function () {
    let _this = this;
    if (LocationUtils.isCustomSets()) { // show custom sets if hash is found
        // allow watch for the store by applying setTimeout
        setTimeout(() => {
            _this.toggleCustomSets(true);
        }, 0);
    }

    // TODO: manage location hash interactions through framework store
    window.addEventListener('hashchange', function (e) {
        if (LocationUtils.isCustomSets(e.oldURL.replace(e.newURL, ''))) { // was Custom Sets
            _this.toggleCustomSets(false);
        } else if (LocationUtils.isCustomSets(e.newURL.replace(e.oldURL, ''))) {
            // is Custom Sets
            _this.toggleCustomSets(true);
        }
    });
};

RegularProductTop.prototype.toggleCustomSets = function (isOpen) {
    if (isOpen) {
        store.dispatch(SearchActions.hideSearch());
        store.dispatch(ProductActions.toggleCustomSets(true));
    } else {
        store.dispatch(SearchActions.toggleSearch(false));
        store.dispatch(ProductActions.toggleCustomSets(false));
    }
};

RegularProductTop.prototype.handleSkuQuantity = function (quantity) {
    store.dispatch(ProductActions.updateQuantityOfCurrentSku(parseInt(quantity)));
};



// Added by sephora-jsx-loader.js
module.exports = RegularProductTop.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/RegularProduct/RegularProductTop/RegularProductTop.c.js