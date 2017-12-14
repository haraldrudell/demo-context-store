const processEvent = require('analytics/processEvent');
const anaConsts = require('analytics/constants');
const preprocessCertonaImpression = require('analytics/preprocess/preprocessCertonaImpression');
const certonaImpression = require('analytics/bindings/pages/all/certonaImpression');
const deepExtend = require('deep-extend');
const InflatorComps = require('utils/framework/InflateComponents');
const Events = require('utils/framework/Events');
const shouldServiceRun = require('utils/Services').shouldServiceRun;
const store = require('Store');
const watch = require('redux-watch');
const Locale = require('utils/LanguageLocale.js');
const certonaUtils = require('utils/certona.js');
const Location = require('utils/Location.js');
const skuUtils = require('utils/Sku.js');
const updateCarousel = require('actions/CertonaActions').updateCarousel;
const Perf = require('utils/framework/Perf');

const PAGE_TYPES = {
    CART: 'CART',
    HOME: 'HOME',
    PRODUCT: 'PRODUCT'
};

module.exports = (function () {

    /* Stop service from loading if not necessary */
    if (!shouldServiceRun.certona()) {
        return;
    }

    window.addEventListener(Events.CertonaReady, function () {
        InflatorComps.renderQueue('Certona');
    });

    /**
     * return pagetype string
     */

    const getPageType = () => {
        let pagetype;
        if (Location.isBasketPage()) {
            pagetype = PAGE_TYPES.CART;
        } else if (Location.isHomePage()){
            pagetype = PAGE_TYPES.HOME;
        } else if (Location.isProductPage()) {
            pagetype = PAGE_TYPES.PRODUCT;
        }

        return pagetype;
    };

    /**
     * Homepage setup for Certona
     * TODO: update environment check once BE sets up the flag
     */
    window.certona = {
        pagetype: getPageType(),
        recommendations: 'TRUE',
        country: Locale.getCurrentCountry().toUpperCase(),
        environment: window.process && window.process.env &&
            Sephora.UFE_ENV ? Sephora.UFE_ENV : 'QA'
    };

    /**
     * expand Certona object for Desktop, if needed
     */
    if (Sephora.isDesktop()) {
        window.certona = Object.assign({}, window.certona, {
            language: 'ENGLISH',
            device: 'DESKTOP',
            channel: 'WEB'
        });
    }

    function setCertonaObject(prop, value) {
        window.certona[prop] = value;
    }

    function initiateCertona () {

        let envPrefex;

        if (Sephora.UFE_ENV !== 'PROD' ) {
            envPrefex = (Sephora.isMobile() ? 'm-' : '') + 'qa.';
        }
        certonaUtils.injectCertona(envPrefex);
    }

    const updateCertonaCustomerId = function (user) {
        if (user && user.profileStatus >= 0) {
            setCertonaObject('customerid', user.profileId);
        }
    };

    const updateProductId = function (productId) {
        setCertonaObject('itemid', productId);
    };

    const updateBasketItems = (basket = {}) => {
        setCertonaObject('itemid', '');

        if (basket.itemCount) {
            setCertonaObject('itemid', basket.products.filter(function (li) {
                return skuUtils.isHardGood(li.sku);
            }).map(function (li) {
                return li.sku.productId;
            }).join(';'));
        }
    };

    let pageType = getPageType();

    let getBasket = () => new Promise((resolve, reject) => {
        if (pageType === PAGE_TYPES.CART) {
            let basket = store.getState().basket;
            if (basket.isInitialized) {
                updateBasketItems(basket);
                resolve();
            } else {
                let unsubscribe = store.subscribe(watch(store.getState, 'basket')((newVal) => {
                    if (newVal.isInitialized) {
                        updateBasketItems(newVal);
                        unsubscribe();
                        resolve();
                    }
                }));
            }
        } else {
            resolve();
        }
    });

    let getProduct = () => new Promise((resolve, reject) => {
        if (pageType === PAGE_TYPES.PRODUCT) {
            let {
                currentProduct = {}
            } = store.getState().product;
            let productId = currentProduct.productId;
            if (productId) {
                updateProductId(productId);
                resolve();
            } else {
                let unsubscribe = store.subscribe(watch(store.getState,
                    'product.currentProduct')((newVal) => {
                        if (newVal.productId) {
                            updateProductId(newVal.productId);
                            unsubscribe();
                            resolve();
                        }
                    }
                ));
            }
        } else {
            resolve();
        }
    });

    let getUser = () => new Promise((resolve, reject) => {
        let user = store.getState().user;
        if (user && (user.profileId || user.profileStatus === 0)) {
            updateCertonaCustomerId(user);
            resolve();
        } else {
            let unsubscribe = store.subscribe(watch(store.getState, 'user')((newVal) => {
                if (newVal && (newVal.profileId || newVal.profileStatus === 0)) {
                    updateCertonaCustomerId(newVal);
                    unsubscribe();
                    resolve();
                }
            }));
        }
    });

    Promise.all([getBasket(), getProduct(), getUser()]).then(initiateCertona);


    /**
     * This function is called from Certona only.
     *
     * If you want to re-initiate this call with fresh recommendations from Sephora side,
     * use function: certonaResx.run() //TODO: change to callCertona() if lib is updated
     */
    Sephora.certona = function (recs) {
        // Someone is clearing recs with object.assign, I need to save a copy for later
        let savedRecsForAnalytics = deepExtend({}, recs);

        //Avoid race conditions. Analytics files are not loaded until PostLoad.js
        Events.onLastLoadEvent(window, [Events.PostLoad], function () {
            try {
                let getShownStatus = preprocessCertonaImpression.getShownStatus;

                processEvent.processOnce(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        recs: savedRecsForAnalytics,
                        bindingMethods: [getShownStatus, certonaImpression],
                        eventStrings: ['event71'],
                        specificEventName: anaConsts.EVENT_NAMES.CERTONA_IMPRESSION
                    }
                },
                { specificEventName: anaConsts.EVENT_NAMES.CERTONA_IMPRESSION });
            } catch (e) {
                console.error(`Exception processing link tracking event
                in Certona service: ${e}`);
            }
        });

        store.dispatch(updateCarousel(recs));
        Sephora.Util.InflatorComps.services.loadEvents.CertonaReady = true;
        Perf.report('Certona Ready');
        window.dispatchEvent(new CustomEvent(Events.CertonaReady, { detail: {} }));
    };

    return;
}());




// WEBPACK FOOTER //
// ./public_ufe/js/services/Certona.js