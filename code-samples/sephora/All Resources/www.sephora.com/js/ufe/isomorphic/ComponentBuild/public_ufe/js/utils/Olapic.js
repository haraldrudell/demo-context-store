'use strict';

const OLAPIC_LIBRARY_URL =
    '//photorankstatics-a.akamaihd.net/static/frontend/sephora-js/build.min.js';
const OLAPIC_LIBRARY_LOAD_TIMEOUT = 10000;

const OlapicComponentName = {
    GALLERY: 'gallery',
    LIGHTBOX: 'lightbox',
    UPLOADER: 'uploader'
};


let _injectRunOlapicScript = function (componentName, containerId) {
    return new Promise((resolve, reject) => {
        let loadTimeout = setTimeout(function () {
            reject({
                errCode: 'timeout',
                message: `Failed to load Olapic library in ${OLAPIC_LIBRARY_LOAD_TIMEOUT} ms!`
            });
        }, OLAPIC_LIBRARY_LOAD_TIMEOUT);

        let scriptEl = window.document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.src = OLAPIC_LIBRARY_URL;

        scriptEl.setAttribute('data-olapic', 'true');
        scriptEl.setAttribute('data-components', componentName);
        scriptEl.setAttribute('data-div', containerId);

        scriptEl.onload = function () {
            resolve();
            clearTimeout(loadTimeout);
        };

        window.document.head.appendChild(scriptEl);
    });
};

_injectRunOlapicScript = (function (decorated) {
    let promises = {};

    return function (...args) {
        let fingerprint = args.join('|');

        if (!promises[fingerprint]) {
            let start = decorated.apply(null, args);

            start.catch(reason => {
                console.error(JSON.stringify(reason));
                return Promise.reject(reason);
            });

            promises[fingerprint] = start;
        }

        return promises[fingerprint];
    };
})(_injectRunOlapicScript);


// (!) Because we get notified of the Olapic script load event only, we need to
// wait before the script runs to leverage the window.bbApp set of utils
// provided for us.

let olapicTools;
let _getBBApp = function () {
    return new Promise((resolve, reject) => {
        let checkAndResolve = () => {
            if (window.bbApp) {
                olapicTools = window.bbApp;
                resolve(olapicTools);
            } else {
                setTimeout(checkAndResolve, 10);
            }
        };

        if (!olapicTools) {
            checkAndResolve();
        } else {
            resolve(olapicTools);
        }
    });
};

module.exports = {

    OlapicComponentName,

    startUploader: function (containerId) {
        return _injectRunOlapicScript(
                OlapicComponentName.UPLOADER, containerId);
    },

    startGallery: function (containerId) {
        return _injectRunOlapicScript(
                OlapicComponentName.GALLERY, containerId);
    },

    enableLightbox: function () {
        const WIDGET_CONTAINER_ID = 'olapic-lightbox-widget';
        let olapicWidgetEl = document.createElement('div');
        olapicWidgetEl.setAttribute('id', WIDGET_CONTAINER_ID);
        document.body.appendChild(olapicWidgetEl);

        return _injectRunOlapicScript(
                OlapicComponentName.LIGHTBOX, WIDGET_CONTAINER_ID);
    },

    openLightbox: function (mediumId) {
        this.enableLightbox().
            then(() => _getBBApp()).
            then(bbApp => bbApp.lightbox.open(mediumId));
    },

    includeOlapicScripts: function () {
        if (!window.Sephora.Olapic) {
            window.Sephora.Olapic =
                require('services/api/thirdparty/SephoraOlapic');
        }

        if (!window.getBeautyBoardUser) {
            window.getBeautyBoardUser = function () {
                const userUtils = require('utils/User');
                return userUtils.validateUserStatus().then(user => {
                    if (user) {
                        let personalInfo =
                            user.beautyInsiderAccount ? userUtils.biPersonalInfoDisplayCleanUp(
                                user.beautyInsiderAccount.personalizedInformation) : {};
                        let colorIQ =
                            user.beautyInsiderAccount && user.beautyInsiderAccount.skinTones ?
                                user.beautyInsiderAccount.skinTones[0].shadeCode : '';
                        let beautyBoardUserInfo = {
                            bi_status: userUtils.getBiStatus(),
                            email: user.login,
                            eye_color: personalInfo.eyeColor || '',
                            first_name: user.firstName,
                            hair_color: personalInfo.hairColor || '',
                            hair_concern: personalInfo.hairConcerns || '',
                            public_id: user.publicId,
                            last_name: user.lastName,
                            skin_tone: personalInfo.skinTone || '',
                            skin_type: personalInfo.skinType || '',
                            skincare_concerns: personalInfo.skinConcerns || '',
                            nick_name: user.nickName,
                            your_hair: personalInfo.hairDescrible || '',
                            color_iq: colorIQ,
                            store_id: '',
                            store_name: '',
                            store_token: '',
                            roles: ''
                        };
                        return beautyBoardUserInfo;
                    } else {
                        return Promise.reject();
                    }
                });
            };
        }
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Olapic.js