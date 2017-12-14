const watch = require('redux-watch');
const skuUtils = require('utils/Sku');
const cookieUtils = require('utils/Cookies');
const Locale = require('utils/LanguageLocale.js');
const SHIP_COUNTRY_COOKIE = 'ship_country';
const SHIP_COUNTRY_FULLNAME_COOKIE = 'ship_country_fullname';
const helperUtils = require('utils/Helpers');
const PROFILE_STATUS = {
    LOGGED_IN: 4,
    RECOGNIZED: 2,
    ANONYMOUS: 0
};

let userUtils = {
    PROFILE_STATUS,
    types: {
        NON_BI: 'NON_BI',
        BI: 'BI',
        VIB: 'VIB',
        ROUGE: 'ROUGE',
        BI_DOWN: 'BI_DOWN',
        LOGGED_IN: 'loggedin',
        RECOGNIZED: 'recognized',
        UNRECOGNIZED: 'unrecognized',
        FLASH_AUTO_RENEW: 'Flash-AR'
    },

    getBiStatus: function () {
        let store = require('Store');
        let user = store.getState().user;
        return user.beautyInsiderAccount ? user.beautyInsiderAccount.vibSegment : this.types.NON_BI;
    },

    getBiStatusText: function (status) {
        let biStatus = status || this.getBiStatus();
        switch (biStatus) {
            case this.types.VIB :
                return 'VIB';
            case this.types.ROUGE :
                return 'VIB Rouge';
            case this.types.BI :
                return 'Beauty Insider';
            default:
                return this.types.NON_BI;
        }
    },

    getProfileId: function () {
        let store = require('Store');
        let user = store.getState().user;
        return user.profileId;
    },

    getPublicId: function () {
        let store = require('Store');
        let user = store.getState().user;
        return user.publicId;
    },

    getProfileStatus: function () {
        let store = require('Store');
        let user = store.getState().user;
        return user.profileStatus;
    },

    isFlash: function () {
        let store = require('Store');
        let user = store.getState().user;
        return user.isFlash;
    },

    isFlashAutoRenewed: function () {
        let store = require('Store');
        let user = store.getState().user;
        let userSubscriptions = user.subscriptionPrograms;
        if (userSubscriptions && userSubscriptions.flash) {
            if (userSubscriptions.flash.subscriptions &&
                userSubscriptions.flash.subscriptions.length) {
                let subscription = userSubscriptions.flash.subscriptions[0];
                return subscription === this.types.FLASH_AUTO_RENEW;
            }
        }
        return false;
    },

    isBI: function () {
        return this.getBiStatus() !== this.types.NON_BI;
    },

    isRouge: function () {
        return this.getBiStatus() === this.types.ROUGE;
    },

    isAnonymous: function () {
        let store = require('Store');
        let user = store.getState().user;
        return typeof user.profileStatus === 'undefined' ||
            user.profileStatus === PROFILE_STATUS.ANONYMOUS;
    },

    isSignedIn: function () {
        let store = require('Store');
        return store.getState().user.profileStatus === PROFILE_STATUS.LOGGED_IN;
    },

    isRecognized: function () {
        let store = require('Store');
        return store.getState().user.profileStatus === PROFILE_STATUS.RECOGNIZED;
    },

    isBiLevelQualifiedFor: function (sku) {
        let store = require('Store');
        let user = store.getState().user;

        const biTierMatrix = {
            none: 0,
            bi: 1,
            vib: 2,
            rouge: 3,
            /*eslint-disable camelcase*/
            non_bi: 0
        };

        let skuTier = (sku.biExclusiveLevel || 'none').toLowerCase();
        let userTier = (this.getBiStatus(user)).toLowerCase();
        let isTierMet = biTierMatrix[userTier] >= biTierMatrix[skuTier];

        return isTierMet;
    },

    isBiPointsBiQualifiedFor: function (sku) {
        let store = require('Store');
        let basket = store.getState().basket;
        let skuPoints = skuUtils.getBiPoints(sku);

        // bday gift, welcome kit, etc dont require points to be added to cart
        if (!skuPoints) {
            return true;
        } else {
            return skuPoints <= basket.availableBiPoints - basket.redeemedBiPoints;
        }
    },

    isRewardEligible: function (sku) {
        //checks sku BI level against users
        if (!this.isBiLevelQualifiedFor(sku)) {
            return false;
        }

        //checks the points of BI user against reward item
        return this.isBiPointsBiQualifiedFor(sku);

    },

    //Gets the current logged in user
    getUser: function () {
        let store = require('Store');
        return new Promise((resolve, reject) => {
            const userData = store.getState('user');
            const userWatch = watch(store.getState, 'user');

            if (userData.user && userData.user.profileId) {
                resolve(userData.user);
            } else {
                // Here, we're acting on a premise that the user can change only
                // once, i.e. on sign in. The page is supposed to get reloaded
                // always when user signs out.
                let unsubscribe = store.subscribe(userWatch(user => {
                    resolve(user);
                    unsubscribe();
                }));
            }
        });
    },

    /**
     * Validates that user state has been set
     * @returns {Promise}
     */
    validateUserStatus: function () {
        let store = require('Store');
        return new Promise((resolve, reject) => {
            const user = store.getState('user').user;
            const userWatch = watch(store.getState, 'user');

            if (user.profileLocale) {
                resolve(user);
            } else {
                // Here, we're acting on a premise that the user can change only
                // once, i.e. on sign in. The page is supposed to get reloaded
                // always when user signs out.
                let unsubscribe = store.subscribe(userWatch(newUser => {
                    resolve(newUser);
                    unsubscribe();
                }));
            }
        });
    },

    /** cleans up the various nested BI personalization information for display purposes.
      * params: personalizedInformation object from the beautyInsiderAccount object inside of user
      * returns either cleaned up information or an empty object
    **/
    biPersonalInfoDisplayCleanUp: function (personalizedInfo) {
        let personalInfo = Object.assign({}, personalizedInfo);
        let cherryPickInfo = function (objArray) {
            let newArray = [];
            objArray.forEach((obj) => {
                if (obj.hasOwnProperty('isSelected')) {
                    newArray.push(obj.displayName);
                }
            });
            if (newArray.length === 1) {
                return newArray[0];
            } else if (newArray.length === 0) {
                return null;
            } else {
                return newArray.join(', ');
            }
        };

        for (let key in personalInfo) {
            if (personalInfo.hasOwnProperty(key)) {
                let newDisplayValue = cherryPickInfo(personalInfo[key]);
                if (newDisplayValue) {
                    personalInfo[key] = newDisplayValue;
                } else {
                    personalInfo[key] = null;
                }
            }
        }

        return personalInfo;
    },

    /** if all the keys in the cleaned up bi personal info are empty except for gender
      * (because gender is always provided upon BI registration as true for female),
      * indicating that the user has not chosen any personalized information, return true
    **/
    isBiPersonalInfoEmpty: function (personalInfo) {
        let isEmpty = true;
        for (let key in personalInfo) {
            if (key !== 'gender' && personalInfo[key]) {
                isEmpty = false;
            }
        }

        return isEmpty;
    },

    //converts number for display with k for thousands and m for millions
    //param: number
    formatSocialCount: function (num) {
        switch (true) {
            case (num >= 1000000):
                return helperUtils.decimalFloor(num / 1000000, -1).toString()
                    .replace(/\.0$/, '') + 'm';
            case (num >= 1000):
                return helperUtils.decimalFloor(num / 1000, -1).toString()
                    .replace(/\.0$/, '') + 'k';
            default:
                return num;
        }
    },

    getShippingCountry: function () {
        let countryCode = cookieUtils.read(SHIP_COUNTRY_COOKIE) || Locale.getCurrentCountry() || '';
        return {
            countryCode: countryCode.toUpperCase(),
            countryLongName: cookieUtils.read(SHIP_COUNTRY_FULLNAME_COOKIE) ||
                (Locale.getCurrentCountry() === Locale.COUNTRIES.US ? 'United States' : 'Canada')
        };
    },

    setShippingCountry: function (country) {
        if (country && country.countryCode && country.countryLongName) {
            cookieUtils.write(SHIP_COUNTRY_COOKIE, country.countryCode);
            cookieUtils.write(SHIP_COUNTRY_FULLNAME_COOKIE, country.countryLongName);
        }
    },

    isSocial: function() {
        let store = require('Store');
        return !!(store.getState().user.nickName);
    },

    needsSocialReOpt: function() {
        let store = require('Store');
        return !store.getState().user.isSocialEnabled;
    },

    displayBiStatus: function (vibSegment) {
        switch (vibSegment) {
            case this.types.VIB:
                return 'VIB';
            case this.types.ROUGE:
                return 'ROUGE';
            default:
                return 'INSIDER';
        }
    },

    getSocialInfo: function () {
        let store = require('Store');
        let socialInfoWatch = watch(store.getState, 'socialInfo');

        return new Promise((resolve, reject) => {
            let lithiumSuccessCheck = function (socialInfo) {
                if (socialInfo.isLithiumSuccessful) {
                    resolve(socialInfo);
                } else {
                    reject();
                }
            };

            // Per Hanah Yendler:
            // 1. Get initial social info from store.
            // 2. If isLithiumSuccessful flag has not been updated to have
            // either true or false, subscribe to watch the social info.
            // 3. Once the value has been added, handle the outcome in
            // lithiumSuccessCheck.
            let initialSocialInfo = store.getState().socialInfo;
            if (initialSocialInfo.isLithiumSuccessful !== null) {
                lithiumSuccessCheck(initialSocialInfo);
            } else {
                let unsubscribe = store.subscribe(socialInfoWatch(newSocialInfo => {
                    unsubscribe();
                    lithiumSuccessCheck(newSocialInfo);
                }));
            }

        });
    },

    getUserSkinTones: function () {
        let store = require('Store');
        let userSkinTones = [];

        let {
            beautyInsiderAccount
        } = store.getState().user;

        let skinTones = beautyInsiderAccount ? beautyInsiderAccount.skinTones : [];

        if (skinTones && skinTones.length > 0) {
            skinTones.forEach(tone => {
                userSkinTones.push(tone.shadeCode);
            });
        }

        return userSkinTones;
    },

    showFlashPDP: function() {
        const localUtils = require('utils/LanguageLocale');
        let isFlash = this.isFlash() || this.isFlashAutoRenewed();
        let isCanada = localUtils.isCanada();

        return !this.isAnonymous() ? !isFlash && !isCanada : !isCanada;
    }
};

module.exports = userUtils;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/User.js