
const priceRegExp = /\d*\.\d{0,2}/;
// move this to entities
// do not use "sku.", since this object should be mixed into sku: Object.assign({}, sku, Sku);
// use "this."" instead.
let skuUtil = {

    PARENT_CATEGORY: {
        FOUNDATION: 'Foundation',
        CONCEALER: 'Concealer'
    },

    CUSTOM_SETS_TYPE: {
        SINGLE_SKU: {
            YOUR_CHOICES: 'SINGLE_SKU_YOUR_CHOICES',
            SKU_LIST: 'SINGLE_SKU_SKU_LIST'
        },
        GROUPED_SKU: {
            YOUR_CHOICES: 'GROUPED_SKU_YOUR_CHOICES',
            SKU_LIST: 'GROUPED_SKU_SKU_LIST'
        },
        UNKNOWN_SKU: {
            YOUR_CHOICES: 'UNKNOWN_SKU_YOUR_CHOICES',
            SKU_LIST: 'UNKNOWN_SKU_SKU_LIST'
        }
    },

    skuSwatchType: {
        TEXT: 'Text',
        IMAGE: 'Image',
        SIZE: 'Size',
        NONE: 'None'
    },

    skuVariationType: {
        COLOR: 'Color',
        SIZE: 'Size',
        CONCENTRATION: 'Concentration',
        FORMULATION: 'Formulation',
        SIZE_CONCENTRATION_FORMULATION: 'Size + Concentration + Formulation',
        SIZE_CONCENTRATION: 'Size + Concentration',
        SCENT: 'Scent',
        TYPE: 'Type',
        NONE: 'None'
    },

    //Reward is not a standard sku.type supported by API,
    //but we need it within this list of Constants
    skuTypes: {
        STANDARD: 'standard',
        SAMPLE: 'sample',
        GWP: 'gwp',
        EGC: 'e-certificate',
        GC: 'gift card',
        BIRTHDAY_GIFT: 'birthday gift',
        ROUGE_BIRTHDAY_GIFT: 'Rouge Welcome Kit',
        WELCOME_KIT: 'welcome kit',
        FLASH: 'flash sku',
        PLAYBOX: 'playbox',
        SUBSCRIPTION: 'subscription',
        REWARD: 'reward' // doesn't exist in API
    },

    biExclusiveLevels: {
        NONE: 'none',
        BI: 'BI',
        VIB: 'VIB',
        ROUGE: 'Rouge'
    },

    IDs: {
        FLASH: '1530070',
        GC: '00050'
    },

    skuDefaults: { quantity: 10 },

    flashProdId: 'P379518',
    SAMPLE_PRODUCT_ID: 'P370205',

    // CHANEL_BRAND_ID = 1065
    BRANDS_WIHOUT_UGC_CONTENT: [
        1065
    ],

    MINIMUM_PRICE_FOR_FREE_SHIPPING: 50,

    productUrl: function (product, sku = product) {
        let url = null;

        if (sku.targetUrl.indexOf('skuId') === -1) {
            url = product.targetUrl + '?skuId=' + sku.skuId;
        } else if (product && sku) {
            url = sku.targetUrl;
        }

        return url;
    },

    isFlash: function (sku) {
        return !!sku.type && sku.type.toLowerCase() === this.skuTypes.FLASH;
    },

    isSubscription: function (sku) {
        return this.skuTypes.SUBSCRIPTION === sku.type.toLowerCase();
    },

    isShowEmailMeWhenBackInStore: function (sku) {
        return sku.isWithBackInStockTreatment &&
            (sku.actionFlags.backInStockReminderStatus === 'inactive' ||
                sku.actionFlags.backInStockReminderStatus === 'active');
    },

    getEmailMeText: function (sku) {
        let CTAText;
        if (sku.actionFlags && sku.actionFlags.backInStockReminderStatus === 'inactive') {
            let skuType = this.getProductType(sku);
            let isPlay = skuType === this.skuTypes.SUBSCRIPTION;
            CTAText = `Email When ${isPlay ? 'Available' : 'In Stock'}`;

        } else if (sku.actionFlags && sku.actionFlags.backInStockReminderStatus === 'active') {
            CTAText = 'Remove Reminder';
        }

        return CTAText;
    },

    isGiftCard: function (sku) {
        return sku.type.toLowerCase() === this.skuTypes.GC;
    },

    isSale: function (sku) {
        return sku.salePrice && !!sku.salePrice && sku.salePrice !== sku.listPrice;
    },

    isGwp: function (sku) {
        return this.skuTypes.GWP === sku.type.toLowerCase();
    },

    isBirthdayGift: function (sku) {
        return sku.biType && (sku.biType.toLowerCase() === this.skuTypes.BIRTHDAY_GIFT ||
            sku.biType.toLowerCase() === this.skuTypes.ROUGE_BIRTHDAY_GIFT);
    },

    isSample: function (sku) {
        return this.skuTypes.SAMPLE === sku.type.toLowerCase();
    },

    isBiReward: function (sku) {
        // TODO: double check existance of 'none' case biType new fetchProduct API response
        return !!sku.biType && sku.biType.toLowerCase() !== 'none';
    },

    isBiRewardGwpSample: function (sku) {
        return this.isBiReward(sku) || this.isGwp(sku) || this.isSample(sku);
    },

    isRewardDisabled: function (sku) {
        const userUtils = require('./User');
        const basketUtils = require('./Basket');

        //if sku.isEligible value is anything different than false it'll be true. i.e. undefined
        let isEligible = !!sku.isEligible;
        return userUtils.isAnonymous() || !userUtils.isRewardEligible(sku) || !isEligible ||
            (this.isWelcomeKit(sku) && basketUtils.hasWelcomeKit()) ||
            (this.isBirthdayGift(sku) && basketUtils.hasBirthdayGift());
    },

    isHardGood: function (sku) {
        // TODO: dadd Play subscription/Flash here if they are not hard good
        return !this.isWelcomeKit(sku) && !this.isBiReward(sku) && !this.isBirthdayGift(sku) &&
            !this.isGwp(sku) && !this.isSample(sku) && !this.isGiftCard(sku);
    },

    isProductDisabled: function (sku) {
        const userUtils = require('./User');

        if (sku.isOutOfStock) {
            return true;
        }

        return this.isBiExclusive(sku) && !this.isBiQualify(sku);
    },

    isBiQualify: function (sku) {
        const userUtils = require('./User');

        if (this.isBiExclusive(sku)) {
            if (!userUtils.isAnonymous() && userUtils.isBI()) {
                return userUtils.isBiLevelQualifiedFor(sku);
            } else {
                return false;
            }
        }

        return false;
    },

    isWelcomeKit: function (sku) {
        return sku.biType && (new RegExp(this.skuTypes.WELCOME_KIT)).test(sku.biType.toLowerCase());
    },

    isBiExclusive: function (sku) {
        return !!sku.biExclusiveLevel && sku.biExclusiveLevel !== 'none';
    },

    isPlayBox: function (sku) {
        return this.skuTypes.PLAYBOX === sku.type.toLowerCase();
    },

    isEGiftCard: function (sku) {
        return sku.type.toLowerCase() === this.skuTypes.EGC;
    },

    isStandardProduct: function (sku) {
        return sku.type.toLowerCase() === this.skuTypes.STANDARD;
    },

    isFree: function (sku) {
        const userUtils = require('utils/User');
        return sku.isFree ||
            this.isSample(sku) ||
            this.isWelcomeKit(sku) ||
            this.isFlash(sku) && userUtils.isRouge();
    },

    isLoveEligible: function (sku) {
        if (this.isGwp(sku) ||
            this.isSample(sku) ||
            this.isBiReward(sku) ||
            this.isFlash(sku) ||
            this.isPlayBox(sku) ||
            this.isGiftCard(sku) ||
            this.isEGiftCard(sku)) {
            return false;
        }

        return true;
    },

    isCountryRestricted: function (sku) {
        return sku.actionFlags && sku.actionFlags.isRestrictedCountry;
    },

    isInBasket: function (skuId) {
        const store = require('Store');
        const basket = store.getState().basket;
        if (basket && basket.items) {
            return basket.items.filter(item => item.sku.skuId === skuId ? true : false).length > 0;
        } else {
            return false;
        }
    },

    isInMsgPromoSkuList: function (skuId) {
        const store = require('Store');
        const msgPromoSkuList = store.getState().promo.msgPromosSkuList;
        return msgPromoSkuList && msgPromoSkuList.filter(elem => elem === skuId).length > 0;
    },

    isChangeableQuantity: function (sku) {
        let skuItem = Object.assign({}, sku);

        if (!skuItem.maxPurchaseQuantity) {
            skuItem.maxPurchaseQuantity = this.skuDefaults.quantity;
        }

        return !this.isWelcomeKit(skuItem) &&
            !this.isBirthdayGift(skuItem) &&
            !this.isGwp(skuItem) &&
            !this.isSample(skuItem) &&
            !this.isGiftCard(skuItem) &&
            !(skuItem.maxPurchaseQuantity === 1 && this.isBiReward(skuItem));
    },

    getBiPoints: function (sku) {
        if (this.isBiReward(sku)) {
            if (this.isWelcomeKit(sku) || this.isBirthdayGift(sku)) {
                return 0;
            } else {
                return parseInt(/^\d*/.exec(sku.biType)[0]);
            }
        } else {
            return null;
        }
    },

    purchasableQuantities: function (sku) {
        const lineItem = require('./LineItem');
        let skuItem = Object.assign({}, sku);

        if (!skuItem.maxPurchaseQuantity) {
            skuItem.maxPurchaseQuantity = this.skuDefaults.quantity;
        }

        if (skuItem.isOutOfStock) {
            return [lineItem.OOS_QTY];
        }

        if (!this.isChangeableQuantity(skuItem)) {
            return [1];
        }

        if (skuItem.maxPurchaseQuantity) {
            let quantity = [];
            let counter = 1;

            while (counter <= skuItem.maxPurchaseQuantity) {
                quantity.push(counter++);
            }

            return quantity;
        }

        return null;
    },

    /**
     * Please note: always returns string,
     * it's wrong to expect the number since it can returns value like '10K'
     * So result shouldn't be comparable with other numbers
     * @param loveCount
     * @returns {string}
     */
    formatLoveCount: function (loveCount) {
        return loveCount > 9999 ? Math.floor(loveCount / 10000) + '0K' : loveCount + '';
    },

    isSkuLoved: function (skuId) {
        let store = require('Store');
        let lovesArray = store.getState().loves.shoppingListIds;
        return lovesArray && lovesArray.filter(elem => elem === skuId).length;
    },

    isColorIQMatch: function (sku) {
        const userUtils = require('utils/User');
        let skinTones = userUtils.getUserSkinTones();
        return skinTones.length && sku.primarySkinTone === skinTones[0];
    },

    getProductLovesCount: function (product) {
        let userLoves = 0;
        if (product.currentSku && this.isSkuLoved(product.currentSku.skuId)) {
            userLoves++;
        }

        if (product.regularChildSkus && product.regularChildSkus.length) {
            for (let x = 0, max = product.regularChildSkus.length; x < max; x++) {
                if (this.isSkuLoved(product.regularChildSkus[x].skuId) &&
                    (!product.currentSku ||
                    product.currentSku.skuId !== product.regularChildSkus[x].skuId)) {

                    userLoves++;
                }
            }
        }

        return this.formatLoveCount(product.lovesCount + userLoves);
    },

    // return correct image according to size
    getImgSrc: function (imageSize, images) {
        //check that images object exists so no error occurs
        if (!images) {
            images = {};
        }
        return images['image' + imageSize] || images.image;
    },

    getProductType: function (currentSku) {
        if (this.isFlash(currentSku)) {
            return this.skuTypes.FLASH;
        }

        if (this.isPlayBox(currentSku)) {
            return this.skuTypes.PLAYBOX;
        }

        if (this.isBiReward(currentSku)) {
            return this.skuTypes.REWARD;
        }

        if (this.isSubscription(currentSku)) {
            return this.skuTypes.SUBSCRIPTION;
        }

        return this.skuTypes.STANDARD;
    },

    getSkuFromProduct(product, skuId) {
        let foundSku = null;

        let {
            regularChildSkus = [],
            onSaleChildSkus = []
        } = product;

        let allSkus = regularChildSkus.concat(onSaleChildSkus);

        let foundSkus = allSkus.filter(sku => sku.skuId === skuId);

        if (foundSkus.length > 0) {
            foundSku = foundSkus[0];
        }

        return foundSku;
    },

    getSkuListFromProduct(product) {
        let {
            regularChildSkus = [],
            onSaleChildSkus = []
        } = product;

        let allSkus = regularChildSkus.concat(onSaleChildSkus);
        if (!allSkus.length && product.currentSku) {
            allSkus = [product.currentSku];
        }
        return allSkus.map(sku => sku.skuId);
    },

    parsePrice: function (price) {
        let parsedPrice = (price || '').match(priceRegExp);
        return parsedPrice ? parseFloat(parsedPrice[0]) : NaN;
    },

    isCustomSetsSingleSkuProduct: function (product) {
        return product.currentSku && product.currentSku.configurableOptions && product.currentSku.
                configurableOptions.skuOptions;
    },

    isCustomSetsGroupedSkuProduct: function (product) {
        return product.currentSku && product.currentSku.configurableOptions && product.currentSku.
                configurableOptions.groupedSkuOptions;
    },

    isFragrance: function (product, sku) {
        return (product || sku).variationType ===
            this.skuVariationType.SIZE_CONCENTRATION_FORMULATION;
    },

    getProductPageData: function() {
        let productData = null;

        let pidResult = /P\d+$/.exec(Sephora.renderQueryParams.urlPath);
        if (pidResult) {
            productData = {
                productId: pidResult[0]
            };

            let skuIdResult = /skuId=(\d+)/.exec(location.search);
            if (skuIdResult) {
                productData.skuId = skuIdResult[1];
            }
        }

        return productData;
    },

    brandShowUserGeneratedContent: function (brandId) {
        return this.BRANDS_WIHOUT_UGC_CONTENT.indexOf(+brandId) === -1;
    },

    showColorIQOnPPage: function (product) {
        const userUtils = require('./User');
        let userSkinTones = userUtils.getUserSkinTones();
        let hasColorMatch = false;
        let {
            parentCategory = {},
            regularChildSkus = []
        } = product;
        let displayName = parentCategory.displayName;
        if (userSkinTones.length) {
            hasColorMatch = regularChildSkus.some(sku => sku.primarySkinTone === userSkinTones[0]);
        }
        return (displayName === skuUtil.PARENT_CATEGORY.FOUNDATION ||
            displayName === skuUtil.PARENT_CATEGORY.CONCEALER) && hasColorMatch;
    },

    getColorIQMatchSku: function (regularChildSkus = []) {
        const userUtils = require('./User');
        const skinTones = userUtils.getUserSkinTones();

        let matchSku = false;

        if (regularChildSkus && skinTones.length) {
            regularChildSkus.some(sku => {
                return sku.primarySkinTone === skinTones[0] ? ((matchSku = sku), true) : false;
            });
        }
        return matchSku;
    },

    showFlashPDP: function (sku) {
        let {
            actionFlags,
            isOutOfStock,
            isHazmat
        } = sku;

        if (!isOutOfStock && !isHazmat) {
            if (actionFlags && actionFlags.showFlashOnPDP) {
                return !this.isGiftCard(sku) && !this.isSample(sku) && 
                    !this.isFlash(sku) && !this.isProductDisabled(sku);
            }
        }
        return false;
    }
};

module.exports = skuUtil;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Sku.js