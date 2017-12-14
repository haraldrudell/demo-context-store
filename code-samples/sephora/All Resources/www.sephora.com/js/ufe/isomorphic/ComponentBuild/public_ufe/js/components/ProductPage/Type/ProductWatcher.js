const ProductActions = require('actions/ProductActions');
const FrameworkActions = require('actions/FrameworkActions');
const store = require('store/Store');
const watch = require('redux-watch');
const skuUtils = require('utils/Sku');
const urlUtils = require('utils/Url');
const userUtils = require('utils/User');
const anaConsts = require('analytics/constants');
const processEvent = require('analytics/processEvent');
const reduxActionWatch = require('redux-action-watch');
const productPageLinkTracking = require('analytics/bindings/pages/product/productPageLinkTracking');

const SKU_ID_PARAM = 'skuId';

let setupLinkAnalytics = function (component) {
    let currentProduct = component.state.currentProduct;
    reduxActionWatch.actionCreators.onAction(store.dispatch)(
        ProductActions.TYPES.UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT, data => {
            if (data.source === ProductActions.SKU_UPDATE_SOURCE.SWATCHES) {
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        currentProduct: component.state.currentProduct,
                        bindingMethods: [productPageLinkTracking.pageClickBindings],
                        specificEventName: productPageLinkTracking.SPEC_EVENT_NAME.CLICK
                    }
                });
            }
        });
    let skuType = currentProduct.variationType;
    if (skuType === skuUtils.skuVariationType.COLOR) {
        store.setAndWatch('product.hoveredSku', null, (data) => {
            let hoveredSku = data.hoveredSku;
            if (hoveredSku) {
                processEvent.processOnce(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        bindingMethods: [productPageLinkTracking.pageHoverColorSwatchBindings],
                        specificEventName: productPageLinkTracking.SPEC_EVENT_NAME.HOVER
                    }
                }, {
                    actionInfo: productPageLinkTracking.LINK_INFO.HOVER
                });
            }
        });
        reduxActionWatch.actionCreators.onAction(store.dispatch)(
            ProductActions.TYPES.TOGGLE_SWATCHES, data => {
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        isExpand: data.isExpand,
                        bindingMethods: [productPageLinkTracking.pageToggleColorSwatchBindings]
                    }
                });
            });
    }

};

/**
 * Shared watchers for all the various types of product page.  This is broken out to here primarily
 * to support the regular product page being split in to top (above the fold) and bottom (below the
 * fold) components - with only the first being sku dependant.
 *
 * RegularProductTop and RewardProduct are both set to async "Immediate", so they should process
 * and render as quickly as possible (based on skuId url param).  Flash and Play are not sku
 * dependent, but do depend on user data to render (as do all product pages)
 *
 * Watches for changes to the sku or user state
 *
 * TODO: could potentially split the sku and user watches, since only regular and reward products
 * care about sku but all product page types care about user state
 *
 * @param component
 */
let watchProductAndUser = function (component, isLazyLoadPart) {
    let currentProduct = component.state.currentProduct;

    store.setAndWatch('product.currentProduct', null, data => {
        component.setState(Object.assign({}, component.state, {
            currentProduct: data.currentProduct
        }));
    });

    store.setAndWatch('product.currentProduct.currentSku', null, (data) => {
        let currentSku = data.currentSku;

        // TODO: Remove sample specific code if we kill sample ppages.  Otherwise, find more elegant
        // solution (separate component for samples?
        // Shortcut to not update if a sample and not the selected sku
        // This is due to all samples having the same product id
        if (skuUtils.isSample(currentSku) && currentSku.skuId !== component.selectedSampleSku) {
            return;
        }

        let biStatusTextForUser = {
            biStatusText: null
        };

        if (component.state.user && currentSku.biExclusiveLevel) {
            let biExclusiveLevel = currentSku.biExclusiveLevel;
            biStatusTextForUser.biStatusText =
                userUtils.getBiStatusText(biExclusiveLevel.toUpperCase());
        }

        component.setState((prevState, props) => ({
            currentProduct: Object.assign({}, prevState.currentProduct, {
                currentSku: currentSku
            }),
            user: Object.assign({}, prevState.user, biStatusTextForUser),
            isSkuReady: true
        }));
    });

    store.setAndWatch('product.hoveredSku', null, (data) => {
        let hoveredSku = data.hoveredSku;

        component.setState((prevState, props) => ({
            currentProduct: Object.assign({}, prevState.currentProduct, {
                hoveredSku: hoveredSku
            })
        }));
    });

    store.setAndWatch('user', null, (data) => {
        let biExclusiveLevel = currentProduct.currentSku.biExclusiveLevel;
        component.setState({
            user: {
                biStatus: userUtils.getBiStatus(),
                isBI: userUtils.isBI(),
                isAnonymous: userUtils.isAnonymous(),
                biStatusText: userUtils.getBiStatusText(biExclusiveLevel.toUpperCase())
            }
        });
    });

    store.setAndWatch('product.isOpenCustomSets', component, (data) => {
        let isOpenCustomSets = data.isOpenCustomSets;

        component.setState((prevState, props) => ({
            currentProduct: Object.assign({}, prevState.currentProduct, {
                isOpenCustomSets: isOpenCustomSets
            })
        }));
    });

    store.setAndWatch('product.currentSkuQuantity', null, (data) => {
        let currentSkuQuantity = data.currentSkuQuantity;

        component.setState((prevState, props) => ({
            currentProduct: Object.assign({}, prevState.currentProduct, {
                currentSkuQuantity: currentSkuQuantity
            })
        }));
    });
    store.setAndWatch('product.addFlashOnPdp', component, (data) => {
        component.setState((prevState, props) => ({
            addFlashOnPdp: data.addFlashOnPdp
        }));
    });
    if (!isLazyLoadPart) {
        setupLinkAnalytics(component);
    }
};

let processSkuId = function(component) {
    let currentProduct = component.state.currentProduct;
    let skuIdFromQueryString = null;
    let colorIQMatchSku = skuUtils.getColorIQMatchSku(currentProduct.regularChildSkus);
    let skuId = urlUtils.getParamsByName(SKU_ID_PARAM);

    if (colorIQMatchSku) {
        store.dispatch(ProductActions.updateSkuInCurrentProduct(colorIQMatchSku,
            ProductActions.SKU_UPDATE_SOURCE.SWATCHES));
        store.dispatch(FrameworkActions.updateQueryParam(SKU_ID_PARAM, [colorIQMatchSku.skuId]));
    } else if (Array.isArray(skuId) && skuId.length > 0) {
        skuId = skuId[0];

        // TODO: Remove sample specific code if we kill sample ppages.  Otherwise, find more elegant
        // solution (separate component for samples?
        // If we have a sample, we have to get the full product data
        // Note: we check by sample product id here because we don't have the full sku data to
        // check skuType
        if (currentProduct.productId === skuUtils.SAMPLE_PRODUCT_ID) {
            store.dispatch(ProductActions.fetchCurrentProduct(skuUtils.SAMPLE_PRODUCT_ID, skuId));
            skuIdFromQueryString = skuId;
            component.selectedSampleSku = skuIdFromQueryString;
        } else {
            // Confirm that this sku is present in the product
            skuIdFromQueryString = skuUtils.getSkuFromProduct(currentProduct, skuId);
            if (skuIdFromQueryString) {
                store.dispatch(ProductActions.updateSkuInCurrentProduct(skuIdFromQueryString,
                ProductActions.SKU_UPDATE_SOURCE.QUERY_STRING));
            }
        }
    }

    // If no sku specified, there's a flag to notify all the comps that current sku is ready.
    // Page is probably already rendered server-side, so be prepared to see the delay
    // between rendering the default ppage and notifying the app that sku is ready
    if (!skuIdFromQueryString && !colorIQMatchSku) {
        component.setState({ isSkuReady: true });
    }
};

const PPAGE_TEST_TARGET_TIMEOUT = 10000;

let watchTestTarget = function (component, callback) {
    let watchOffers = watch(store.getState, 'testTarget');
    store.subscribe(watchOffers(testTarget => {
        let isMobile = Sephora.isMobile();
        let {
            offers = {}
        } = testTarget;
        if (offers.PPageTest) {
            component.setState({
                pPageOffersReceived: true
            });
        }
        let {
            PPageTest = {}
        } = offers;
        if (isMobile && PPageTest.hidePPageSVA) {
            Sephora.configurationSettings.isPpageSVAEnabled = false;
        } else if (isMobile && PPageTest.hidePPageExploreProduct) {
            Sephora.configurationSettings.isPpageBeautyBoardEnabled = false;
        } else if (isMobile && PPageTest.hidePPageReviews) {
            Sephora.configurationSettings.isPpageRatingsEnabled = false;
        } else if (isMobile && PPageTest.hidePPageSVAExploreProductAndReviews) {
            Sephora.configurationSettings.isPpageSVAEnabled = false;
            Sephora.configurationSettings.isPpageBeautyBoardEnabled = false;
            Sephora.configurationSettings.isPpageRatingsEnabled = false;
        } else if (!isMobile && PPageTest.hidePPageSVAForDesktop) {
            Sephora.configurationSettings.isPpageSVAEnabled = false;
        }
        if (!isMobile && PPageTest.hidePPageFlashBannerDesktop) {
            Sephora.configurationSettings.isPpageFlashEnabled = false;
        } else if (!isMobile && PPageTest.hidePPageFlashBannerAndChatDesktop) {
            Sephora.configurationSettings.isPpageFlashEnabled = false;
        } else if (isMobile && PPageTest.hidePPageFlashBannerMW) {
            Sephora.configurationSettings.isPpageFlashEnabled = false;
        } else if (isMobile && PPageTest.hidePPageFlashBannerAndChatMW) {
            Sephora.configurationSettings.isPpageFlashEnabled = false;
        }
        component.forceUpdate();
        if (callback) {
            callback(PPageTest);
        }
    }));
    setTimeout(() => {
        if (!component.state.pPageOffersReceived) {
            if (callback) {
                component.setState({
                    pPageOffersReceived: true
                }, callback);
            }
        }
    }, PPAGE_TEST_TARGET_TIMEOUT);
};

module.exports = {
    watchProductAndUser: watchProductAndUser,
    watchTestTarget: watchTestTarget,
    processSkuId: processSkuId,
    SKU_ID_PARAM: SKU_ID_PARAM
};




// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Type/ProductWatcher.js