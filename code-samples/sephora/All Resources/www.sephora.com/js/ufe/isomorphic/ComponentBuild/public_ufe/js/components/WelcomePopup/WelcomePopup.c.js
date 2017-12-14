// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var WelcomePopup = function () {};

// Added by sephora-jsx-loader.js
WelcomePopup.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const CookieUtils = require('utils/Cookies');

const mediaPopupData = {
    20800040: {
        title: 'WELCOME TO SEPHORA.COM.AU',
        link: 'https://www.sephora.com.au/',
        country: 'Australia'
    },
    32300030: {
        title: 'WELCOME TO SEPHORA.COM.BN',
        link: 'https://www.sephora.com.bn/',
        country: 'Brunei'
    },
    32300029: {
        title: 'WELCOME TO SEPHORA.HK',
        link: 'https://www.sephora.hk/',
        country: 'Hong Kong'
    },
    32300028: {
        title: 'WELCOME TO SEPHORA.CO.ID',
        link: 'https://www.sephora.co.id/',
        country: 'Indonesia',
        isLarge: true
    },
    32300026: {
        title: 'WELCOME TO SEPHORA.MY',
        link: 'https://www.sephora.my/',
        country: 'Malaysia'
    },
    32300032: {
        title: 'WELCOME TO SEPHORA.NZ',
        link: 'https://www.sephora.nz/',
        country: 'New Zealand'
    },
    32300031: {
        title: 'WELCOME TO SEPHORA.PH',
        link: 'https://www.sephora.ph/',
        country: 'Philippines'
    },
    32300025: {
        title: 'WELCOME TO SEPHORA.SG',
        link: 'https://www.sephora.sg/',
        country: 'Singapore'
    },
    32300027: {
        title: 'Welcome to SEPHORA.CO.TH',
        link: 'https://www.sephora.co.th/',
        country: 'Thailand'
    },
    38800022: {
        title: 'Welcome to SEPHORA.COM.MX',
        link: 'https://www.sephora.com.mx/',
        country: 'Mexico'
    },

    // Border Free
    20800044: null,
    20800046: null,
    20800042: null,
    21700025: null,
    21700023: null
};

WelcomePopup.prototype.ctrlr = function () {
    const updateState = newVal => {
        const newState = Object.assign({}, newVal, {
            showWelcomePopup: this.shouldShowPopup(newVal.countryCode),
            isMedia: this.isMedia(newVal.mediaId),
            modalData: this.getMediaPopupData(newVal.mediaId)
        });

        this.setState(newState, () => this.setCookies());
    };

    let welcomeMatWatch = watch(store.getState, 'welcomeMat');

    store.subscribe(welcomeMatWatch(newVal => {
        updateState(newVal);
    }));

    const welcomeMat = store.getState().welcomeMat;

    if (welcomeMat) {
        updateState(welcomeMat);
    }
};

/**
 * Checks if the conditions to show the media or non media popup modal are met
 * @param  {string} country - the country code
 */
WelcomePopup.prototype.shouldShowPopup = function (countryCode) {
    let shouldShowPopup = false;

    // Welcome popups are displayed if the country they are
    // visiting from and their profileLocale is different.
    if (countryCode !== store.getState().user.profileLocale) {

        if (this.state.isMedia) {
            shouldShowPopup = this.state.modalData !== null;
        } else {
            if (Sephora.isMobile()) {
                if (countryCode === 'CA') {
                    shouldShowPopup = CookieUtils.read('showCanadianWelcome') === 'true';
                } else {
                    let internationalCookie =
                        CookieUtils.read(this.getInternationalCookieName(countryCode));
                    shouldShowPopup = internationalCookie ? false : true;
                }
            } else {
                shouldShowPopup = true;
            }
        }
    }

    return shouldShowPopup;
};

/**
 * Sets the appropriate cookies according to the different test cases,
 * there are cookies specific to Desktop and some other specific to mobile
 */
WelcomePopup.prototype.setCookies = function () {
    const EXPIRES = {
        NOT_SET: 0,
        IN_ONE_DAY: 1,
        NEVER: 3650
    };

    // TODO: Unify cookies once we dont have to support Legacy
    if (this.state.showWelcomePopup) {
        if (Sephora.isMobile()) {
            if (this.state.countryCode === 'CA') {
                // Since this cookie is being set by the API to control the
                // welcome mat behaviour and Akamai caches it, the below is
                // a hack to keep the stone rolling before we can rework
                // the approach to be trully unified and away from being
                // API-driven.
                // https://jira.sephora.com/browse/ILLUPH-84237
                CookieUtils.write(
                    'showCanadianWelcome',
                    'false', EXPIRES.NOT_SET, true);
            } else {
                CookieUtils.write(
                    this.getInternationalCookieName(this.state.countryCode),
                    1, EXPIRES.NOT_SET, false);
            }
        } else {
            if (this.state.countryCode !== 'CA') {
                CookieUtils.write('trackIntlPopup', true, EXPIRES.IN_ONE_DAY, true);
            }

            if (this.state.type === 'REDIRECT') {
                CookieUtils.write('showIntlPopupRedirect', false, EXPIRES.NOT_SET, true);
            } else {
                CookieUtils.write('showIntlPopup', false, EXPIRES.NEVER, true);
            }
        }
    }
};

/**
 * Returns the name of the international cookie
 * @param  {string} country - the country code
 */
WelcomePopup.prototype.getInternationalCookieName = function (countryCode) {
    return 'wp' + countryCode;
};

/**
 * Updates the component's state to close the modal
 */
WelcomePopup.prototype.requestClose = function () {
    this.setState({ showWelcomePopup: false });
};

/**
 * Checks if the modal should get the content from the media API
 * @param  {string} mediaId
 */
WelcomePopup.prototype.isMedia = function (mediaId) {
    return mediaPopupData.hasOwnProperty(mediaId);
};

/**
 * Returns the modal data to be used for media modals on mobile web
 * @param  {string} mediaId
 */
WelcomePopup.prototype.getMediaPopupData = function (mediaId) {
    return mediaPopupData[mediaId] || null;
};


// Added by sephora-jsx-loader.js
module.exports = WelcomePopup.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/WelcomePopup/WelcomePopup.c.js