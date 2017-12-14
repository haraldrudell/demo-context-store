const utils = require('analytics/utils');
const skuUtils = require('utils/Sku');
const deepExtend = require('deep-extend');
const anaConsts = require('analytics/constants');

const LINK_INFO = {
    CLICK_SIZE: 'product:alt-image:swatch:size',
    CLICK_COLOR: 'product:alt-image:swatch:click',
    HOVER: 'product:alt-image:swatch:hover',
    VIEW_MORE: 'product:alt-image:view more',
    VIEW_LESS: 'product:alt-image:view less'
};

const SPEC_EVENT_NAME = {
    CLICK: 'swatch_click',
    HOVER: 'swatch_hover'
};

module.exports = (function () {
    const pageClickBindings = function (data) {
        let currentProduct = data.currentProduct;
        let skuType = currentProduct.variationType;
        let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
        switch (skuType) {
            case skuUtils.skuVariationType.SIZE:
            case skuUtils.skuVariationType.SIZE_CONCENTRATION_FORMULATION:
            case skuUtils.skuVariationType.SIZE_CONCENTRATION:
                deepExtend(currentEvent, {
                    eventInfo: {
                        attributes: {
                            linkName: 'D=c55',
                            actionInfo: LINK_INFO.CLICK_SIZE,
                            eventStrings: [anaConsts.Event.EVENT_71]
                        }
                    }
                });
                break;
            case skuUtils.skuVariationType.COLOR: {
                deepExtend(currentEvent, {
                    eventInfo: {
                        attributes: {
                            linkName: 'D=c55',
                            actionInfo: LINK_INFO.CLICK_COLOR,
                            eventStrings: [anaConsts.Event.EVENT_71]
                        }
                    }
                });
                break;
            }
            default:
        }
    };

    const pageHoverColorSwatchBindings = function () {
        let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
        deepExtend(currentEvent, {
            eventInfo: {
                attributes: {
                    linkName: 'D=c55',
                    actionInfo: LINK_INFO.HOVER,
                    eventStrings: [anaConsts.Event.EVENT_71]
                }
            }
        });
    };

    const pageToggleColorSwatchBindings = function (data) {
        let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
        deepExtend(currentEvent, {
            eventInfo: {
                attributes: {
                    linkName: 'D=c55',
                    actionInfo: data.isExpand ? LINK_INFO.VIEW_MORE : LINK_INFO.VIEW_LESS,
                    eventStrings: [anaConsts.Event.EVENT_71]
                }
            }
        });
    };

    const heroVideoClickBindings = function (data) {
        let currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
        deepExtend(currentEvent, {
            eventInfo: {
                attributes: {
                    specificEventName: anaConsts.EVENT_NAMES.HERO_VIDEO_CLICK,
                    linkName: 'video popup',
                    actionInfo: 'video popup',
                    eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_102],
                    videoName: [
                        digitalData.page.attributes.sephoraPageInfo.pageName,
                        data.videoItem.name,
                        data.videoItem.filePath
                    ].join('_'),
                    eVar63: 'D=g',
                    internalCampaign:
                    'product_' + digitalData.product[0].attributes.world + '_video'
                }
            }
        });
    };

    return {
        pageClickBindings: pageClickBindings,
        pageHoverColorSwatchBindings: pageHoverColorSwatchBindings,
        pageToggleColorSwatchBindings: pageToggleColorSwatchBindings,
        heroVideoClickBindings: heroVideoClickBindings,
        LINK_INFO: LINK_INFO,
        SPEC_EVENT_NAME: SPEC_EVENT_NAME
    };
}());



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/bindings/pages/product/productPageLinkTracking.js