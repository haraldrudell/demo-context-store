const skuUtils = require('utils/Sku');
const userUtils = require('utils/User');
const Locale = require('utils/LanguageLocale');

// TODO: Fix this so that we only check for
// merge basket key after ILLUPH-100297 is resolved on BE
const MERGE_BASKET_WARNING = {
    EN: 'Items in your last shopping session have been merged with your existing basket.',
    FR: 'Les articles sélectionnés pendant votre dernière séance de magasinage ' +
        'ont été fusionnés avec votre panier actuel.'
};

// The minimum points at which a reward is valuable enough to be shipping without a product
// also being in the order
const STANDALONE_REWARD_MIN_VALUE = 750;

function getItemByType(type) {
    let store = require('Store');
    let basket = store.getState().basket;
    let items = (basket.items || []).filter(function (item) {
        return (item.sku.type || '').toLowerCase() === type;
    });

    return items.length && items[0];
}

const Basket = {
    ADD_TO_BASKET_TYPES: {
        RED: 'RED',
        OUTLINE: 'OUTLINE',
        PRIMARY: 'PRIMARY',
        MUTED: 'MUTED'
    },

    PAGE_URL: (Sephora.isThirdPartySite ?
        'https://www.sephora.com/basket'
        : '/basket'),

    separateItems: function (newBasket) {
        let separatedItems = {
            rewards: [],
            promos: [],
            samples: [],
            products: []
        };

        newBasket.items && newBasket.items.forEach(function (element) {
            if (element.sku && skuUtils.isGwp(element.sku)) {
                separatedItems.promos.push(element);

            } else if (element.sku && skuUtils.isSample(element.sku)) {
                separatedItems.samples.push(element);

            } else if (element.sku && skuUtils.isBiReward(element.sku)) {
                separatedItems.rewards.push(element);
            } else {
                separatedItems.products.push(element);

            }
        });

        return Object.assign({}, newBasket, separatedItems);
    },

    calculateUpdatedBasket: function (newBasket) {
        let store = require('Store');
        let basket = store.getState().basket;

        if (basket && Array.isArray(basket.items)) {
            newBasket.items.forEach(item => {
                let i;
                for (i = 0; i < basket.items.length; i++) {
                    if (basket.items[i].sku.skuId === item.sku.skuId) {
                        basket.items.splice(i, 1);
                        break;
                    }
                }

                /**
                 * Always insert new item on the top of the basket items list
                 */
                basket.items.unshift(item);
            });
            newBasket.items = basket.items;
        }

        return newBasket;
    },

    catchItemLevelErrors: function (result, newBasket) {
        let store = require('Store');
        let basket = newBasket ? newBasket : store.getState().basket;
        let items = [];
        if (Array.isArray(basket.items)) {
            basket.items.forEach(item => {
                if (basket.errors && basket.errors[item.sku.skuId]) {
                    item.itemLevelMessages = [{
                        messages: [basket.errors[item.sku.skuId]]
                    }];
                    items.push(item);
                }
            });
        }
        return items.length ? items : undefined;
    },

    catchItemLevelMessages: function (basket) {
        if (!Array.isArray(basket.items)) {
            return null;
        }
        let messages = [];
        basket.items.forEach(item => {
            if (Array.isArray(item.itemLevelMessages)) {
                messages.push(item.itemLevelMessages.map(itemLevelMessage =>
                    itemLevelMessage.messages.join('')).join(''));
            }
        });
        return messages.length ? messages : undefined;
    },

    getOrderId: function () {
        let store = require('Store');
        let basket = store.getState().basket;
        return basket.orderId;
    },

    /**
     * Note that basket.subtotal factors in promos.  The merchandise total before promos is
     * in basket.rawSubtotal
     * @param withCurrency
     * @returns {*}
     */
    getSubtotal: function (withCurrency) {
        let store = require('Store');
        let basket = store.getState().basket;
        if (withCurrency) {
            return basket.subtotal;
        } else {
            return Number(this.removeCurrency(basket.subtotal));
        }
    },

    getSamplesInBasket: function () {
        let store = require('Store');
        let basket = store.getState().basket;
        let samplesList = [];

        if (basket.items) {
            samplesList = basket.items.filter(item => skuUtils.isSample(item.sku));
        }

        return samplesList;
    },

    getGwpPromoInBasket: function (newBasket) {

        let store = require('Store');
        let basket = typeof newBasket !== 'undefined' ? newBasket : store.getState().basket;
        let promoList = [];

        if (basket.items) {
            promoList = basket.items.filter(item => skuUtils.isGwp(item.sku));
        }

        return promoList;
    },

    getPromoMessage: function (newBasket) {

        let store = require('Store');
        let basket = typeof newBasket !== 'undefined' ? newBasket : store.getState().basket;
        let promoMessage = null;
        let discountNoCurrency = basket.discountAmount &&
            Number(this.removeCurrency(basket.discountAmount));
        let regularPromoApplied = ((basket.promoMessage) &&
            discountNoCurrency > 0) || basket.promoMessage;
        let skuPromoApplied = basket.promos.length > 0;

        if (skuPromoApplied || regularPromoApplied) {
            promoMessage = basket.promoMessage;
        }

        return promoMessage;
    },

    removeCurrency: function (amount) {
        let formattedAmount = Number(amount.replace(/[^\d.,-]/g, '')).toFixed(2);
        return '' + (isNaN(formattedAmount) ? 0 : formattedAmount);
    },

    getCurrency: function (money) {
        return money.replace(/[\d.,-]/g, '');
    },

    isEmpty: function (newBasket) {

        let store = require('Store');
        let basket = newBasket ? newBasket : store.getState().basket;

        return !basket.items || basket.items.length === 0;
    },

    isMergeBasketWarning: function (message) {
        return MERGE_BASKET_WARNING.EN === message ||
            MERGE_BASKET_WARNING.FR === message;
    },

    getMergeBasketWarning: function (json) {
        let mergeBasketWarning = null;

        if (json && Array.isArray(json.warnings)) {
            for (let i = 0; i < json.warnings.length; i++) {
                let warning = json.warnings[i];

                if (this.isMergeBasketWarning(warning)) {
                    mergeBasketWarning = warning;
                    break;
                }
            }
        }

        return mergeBasketWarning;
    },

    getEstimatedShipping: function () {
        let store = require('Store');
        let basket = store.getState().basket;
        if (basket && basket.items) {
            return this.getSubtotal() >= 50 ? 'FREE' : 'TBD';
        } else {
            return 'TBD';
        }
    },

    noStandardGoods: function () {
        let store = require('Store');
        let basket = store.getState().basket;
        if (basket && basket.items) {
            let hasStandardGood = basket.items.some(function (item) {
                return !skuUtils.isBiRewardGwpSample(item.sku);
            });

            return !hasStandardGood;
        } else {
            return true;
        }
    },

    hasWelcomeKit: function () {
        const store = require('Store');
        const basket = store.getState().basket;
        if (basket && basket.items) {
            return basket.items.filter(item => skuUtils.isWelcomeKit(item.sku)).length > 0;
        } else {
            return false;
        }
    },

    hasBirthdayGift: function () {
        const store = require('Store');
        const basket = store.getState().basket;
        if (basket && basket.items) {
            return basket.items.filter(item => skuUtils.isBirthdayGift(item.sku)).length > 0;
        } else {
            return false;
        }
    },

    isHazardous: function () {
        let store = require('Store');
        let basket = store.getState().basket;
        return basket && Array.isArray(basket.items) &&
            !!basket.items.filter((item) => item.sku.isHazmat || item.sku.isProp65).length;
    },

    containsRestrictedItem: function () {
        let store = require('Store');
        let basket = store.getState().basket || { items: [] };
        return !!basket.items.filter((item) => item.sku.isPaypalRestricted).length;
    },

    isPaypalRestricted: function () {
        let store = require('Store');
        let basket = store.getState().basket || { items: [] };
        return !basket.items.length || (this.containsRestrictedItem() &&
            basket.showPaypalRestrictedMessage);
    },

    getAvailableBiPoints: function () {
        let store = require('Store');
        let basket = store.getState().basket;
        let totalPoints = basket.availableBiPoints - basket.redeemedBiPoints;
        return (basket.availableBiPoints && totalPoints > 0 ? totalPoints : 0);
    },

    getFlashFromBasket: function () {
        return getItemByType(skuUtils.skuTypes.FLASH);
    },

    getGiftCardFromBasket: function () {
        return getItemByType(skuUtils.skuTypes.GC);
    },

    /**
     *
     * @param isCountStandaloneRewardAsProduct - if set to true then if the basket contains a reward
     * >= 750 points, then the method will return false
     * @returns {boolean}
     */
    isOnlySamplesRewardsInBasket: function (isCountStandaloneRewardAsProduct = false) {
        let store = require('Store');
        let basket = store.getState().basket;

        if (basket && basket.items) {
            let samplesRewardsInBasket = basket.items.filter(item =>
                (skuUtils.isBiReward(item.sku) &&
                    (!isCountStandaloneRewardAsProduct ||
                    skuUtils.getBiPoints(item.sku)) < STANDALONE_REWARD_MIN_VALUE
                ) || skuUtils.isSample(item.sku)
            );

            return samplesRewardsInBasket.length === basket.items.length;
        } else {
            return false;
        }
    },

    filterForEligibleRewards: function (json) {
        let filteredBiRewardGroups = {};
        if (json.biRewardGroups) {
            for (let group in json.biRewardGroups) {
                if (Object.prototype.hasOwnProperty.call(json.biRewardGroups, group)) {
                    let newRewardSkus = json.biRewardGroups[group].filter(sku => sku.isEligible);
                    filteredBiRewardGroups[group] = newRewardSkus;
                }
            }

            json.biRewardGroups = filteredBiRewardGroups;
        }

        return json;
    },

    isOnlyFlashInBasket: function () {
        let store = require('Store');
        let basket = store.getState().basket;

        if (basket && basket.items) {
            let flashInBasket = basket.items.filter(item => skuUtils.isFlash(item.sku));

            return flashInBasket.length === basket.items.length;
        } else {
            return false;
        }
    },

    /**
     * return user locale-specific default (0.00) subtotal
     * @returns {*}
     */
    getDefaultSubtotal: function () {
        let countryCode = userUtils.getShippingCountry().countryCode;

        return Locale.ISO_CURRENCY[countryCode] + ' 0.00';

    }
};

module.exports = Basket;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Basket.js