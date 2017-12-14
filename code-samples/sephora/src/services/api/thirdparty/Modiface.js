/* eslint-disable camelcase */ // The Modiface events and actions do have underscored params.

'use strict';

/**
 * Modiface API integration file
 *
 * Implementation based on the documentation file:
 * https://ecommerce.modiface.com/dev/sephora_ppa/documentation.html
 */

const store = require('Store');
const skuUtils = require('utils/Sku');
const Storage = require('utils/localStorage/Storage');
const LOCAL_STORAGE = require('utils/localStorage/Constants');
const VirtualArtistActions = require('actions/VirtualArtistActions');
const MODIFACE_LIBRARY_URL = Sephora.configurationSettings.modifaceApi.url;
const MODIFACE_PUBLISHER_ID = Sephora.configurationSettings.modifaceApi.customerId;
const MODIFACE_IFRAME = 'mf_ppage_frame';
const MODIFACE_LIBRARY_LOAD_TIMEOUT = 15000;
const CATEGORY_DISPLAY_NAME_MAP = {
    LIP: 'lips',
    CHEEK: 'cheek',
    EYESHADOW: 'eyeshadow',
    EYELINER: 'eyeliner',
    'EYE PALETTES': 'eyeshadow',
    'FALSE EYELASHES': 'lash'
};

const modifaceActions = {
    CHANGE_SKU: 'sku_change',
    TRY_IT_ON: 'tryon_start'
};

const modifaceEvents = {
    SKU_CHANGED: 'sku_change',
    PHOTO_CHANGED: 'photo_change',
    VA_LOADED: 'all_library_load',
    VA_SWIPED: 'swipeSva',
    IMAGE_UPDATED: 'photo_updated'
};

let _currentCategory = null;
let _currenSkuId = null;
let _tryOnSessionStarted = false;
let _tryOnClicked = false;

let resolveVirtualArtist = function () {};
let virtualArtistPromise = new Promise((resolve, reject) => {
    resolveVirtualArtist = resolve;
});
let virtualArtistReady = function () {
    return virtualArtistPromise;
};

let isSvaEnabled = function () {
    return Sephora.configurationSettings.isVirtualTryOnEnabled &&
        Sephora.configurationSettings.isPpageSVAEnabled;
};

let getModifaceCategoryByProduct = function (product) {
    let root = product;

    if (!root.parentCategory) {
        return null;
    }

    while (root.parentCategory) {
        let displayName = root.parentCategory.displayName.toUpperCase();
        if (CATEGORY_DISPLAY_NAME_MAP[displayName]) {
            return CATEGORY_DISPLAY_NAME_MAP[displayName];
        }
        root = root.parentCategory;
    }
    return null;
};

let _modifacePromise = null;
let modifaceScriptReady = function () {
    if (!_modifacePromise) {
        _modifacePromise = new Promise((resolve, reject) => {
            if (!isSvaEnabled()) {
                reject({
                    errCode: 'lib_disabled',
                    message: 'SVA library is not enabled. Please check API config'
                });
                return;
            }

            let loadTimeout = setTimeout(function () {
                reject({
                    errCode: 'timeout',
                    message: 'Failed to load Modiface library in ' +
                    MODIFACE_LIBRARY_LOAD_TIMEOUT + ' ms!'
                });
            }, MODIFACE_LIBRARY_LOAD_TIMEOUT);

            let scriptEl = window.document.createElement('script');
            scriptEl.type = 'text/javascript';
            scriptEl.src = MODIFACE_LIBRARY_URL;

            window.mf_script_load = function () {

                //TODO 17.7 Get rid of the cache when Modiface will profide a request by profileId
                window.MF_CHANNEL_PARENT.getModelList(function(data) {
                    clearTimeout(loadTimeout);

                    let cachedData = Storage.local.getItem(LOCAL_STORAGE.SVA_DATA);
                    let currentModel = cachedData && cachedData.model ||
                        data.model_list[data.default_model];
                    store.dispatch(VirtualArtistActions.updateModel(currentModel));
                    resolve();
                });

                window.MF_CHANNEL_PARENT.listen(modifaceEvents.PHOTO_CHANGED, function(model) {
                    if (_tryOnSessionStarted) {
                        Storage.local.setItem(LOCAL_STORAGE.SVA_DATA, {
                            model: model
                        });
                        store.dispatch(VirtualArtistActions.updateModel(model));
                    }
                });

                window.MF_CHANNEL_PARENT.listen(modifaceEvents.SKU_CHANGED, function(skuId) {
                    store.dispatch(VirtualArtistActions.updateSkuId(skuId));
                });

                window.MF_CHANNEL_PARENT.listen(modifaceEvents.IMAGE_UPDATED,
                    function(appliedMakeupImage) {
                        store.dispatch(VirtualArtistActions.updateImage(appliedMakeupImage));
                    }
                );

                if (Sephora.isTouch) {
                    window.MF_CHANNEL_PARENT.listen(modifaceEvents.VA_SWIPED, function(data) {
                        store.dispatch(VirtualArtistActions.swipeVirtualArtist(data.direction));
                    });
                }
            };

            window.document.head.appendChild(scriptEl);
        });
    }
    return _modifacePromise;
};

let sendTryItOnEvent = function (startType) {
    let virtualArtist = store.getState().virtualArtist;
    let photoData = virtualArtist.model;

    window.MF_CHANNEL_PARENT.send({
        event: modifaceActions.TRY_IT_ON,
        data: {
            start_type: startType,
            photo_data: photoData
        }
    }, MODIFACE_IFRAME);
};

module.exports = {

    renderVirtualArtist: function (elementId, product, zIndex = 1, callback) {
        modifaceScriptReady().then(() => {
            _currentCategory = getModifaceCategoryByProduct(product);

            window.MF_CHANNEL_PARENT.listen(modifaceEvents.VA_LOADED, function() {
                resolveVirtualArtist();

                // if TryOn button wasn't clicked yet, select default model
                if (!_tryOnClicked) {
                    _tryOnSessionStarted = true;
                    sendTryItOnEvent('photo_select');
                }
                callback && callback();
            });

            window.MF_CHANNEL_PARENT.addFrame({
                divId: elementId,
                frameName: MODIFACE_IFRAME,
                zIndex: zIndex,
                publisherId: MODIFACE_PUBLISHER_ID,
                category: _currentCategory,
                skuList: skuUtils.getSkuListFromProduct(product)
            });
        });
    },

    getModelList: function (callback) {
        modifaceScriptReady().then(() => {
            window.MF_CHANNEL_PARENT.getModelList(callback);
        });
    },

    getSkuListEnabledForProduct: function (product) {
        return new Promise((resolve, reject) => {
            modifaceScriptReady().then(() => {
                let skuList = skuUtils.getSkuListFromProduct(product);
                let productCategory = getModifaceCategoryByProduct(product);
                window.MF_CHANNEL_PARENT.isSvaEnabled(skuList, productCategory, function (result) {
                    resolve(result);
                });
            });
        });
    },

    selectSku: function (skuId) {
        if (skuId !== _currenSkuId) {
            _currenSkuId = skuId;
            window.MF_CHANNEL_PARENT.send({
                event: modifaceActions.CHANGE_SKU,
                data: {
                    sku: skuId
                }
            }, MODIFACE_IFRAME);
        }
    },

    isProductEnabledForSVA: function (product) {
        return new Promise((resolve, reject) => {
            if (!isSvaEnabled()) {
                reject();
                return;
            }
            let productCategory = getModifaceCategoryByProduct(product);
            if (productCategory) {
                modifaceScriptReady().then(() => {
                    let skuList = skuUtils.getSkuListFromProduct(product);

                    window.MF_CHANNEL_PARENT.isSvaEnabled(skuList, productCategory, (result) => {
                        let atLeastOneSkuEnabled =
                            Object.keys(result).some(skuId => result[skuId].enabled);
                        if (atLeastOneSkuEnabled) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            } else {
                reject();
            }
        });
    },

    isVirtualArtistEnabledForSku: function (skuId) {
        return new Promise((resolve, reject) => {
            modifaceScriptReady().then(() => {
                let skuList = [skuId];
                window.MF_CHANNEL_PARENT.isSvaEnabled(skuList, _currentCategory, function (result) {
                    resolve(!!result[skuId] && !!result[skuId].enabled);
                });
            });
        });
    },

    tryItOn: function () {
        _tryOnClicked = true;
        /* Only when it's fully loaded */
        virtualArtistReady().then(() => {
            _tryOnSessionStarted = true;
            sendTryItOnEvent('sva_menu');
        });
    },

    convertModelToMedia: function (model) {
        let media = {};
        if (model && model.url) {
            media = {
                image42: model.url.small,
                image62: model.url.small,
                image97: model.url.small,
                image135: model.url.medium,
                image162: model.url.medium,
                image250: model.url.medium,
                image300: model.url.medium,
                image450: model.url.medium,
                image1500: model.url.large
            };
        }
        return media;
    },

    isSvaEnabled: isSvaEnabled

};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/thirdparty/Modiface.js