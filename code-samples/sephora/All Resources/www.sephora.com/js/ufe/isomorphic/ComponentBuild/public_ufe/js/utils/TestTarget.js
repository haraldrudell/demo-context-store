const LanguageLocale = require('utils/LanguageLocale');
const getCurrentCountry = LanguageLocale.getCurrentCountry;
const LOCAL_STORAGE = require('utils/localStorage/Constants');
const Storage = require('utils/localStorage/Storage');

const getSelected = arr => {
    try {
        const choices = arr.filter(elem => elem.isSelected)
            .map(choice => choice.displayName.toLowerCase());

        if (choices.length) {
            return choices.length > 1 ? choices.join(',') : choices[0];
        } else {
            return '';
        }

    } catch (e) {
        return '';
    }

};

const TEST_TYPES = {
    TOGGLE: 'toggle',
    REORDERING: 'reordering'
};

module.exports = {
    MBOX_NAME: 'sephora_global',
    MBOX_TIMEOUT: 5000,
    TEST_TYPES,

    setUserParams: function (user) {
        /* TODO: support brand, categoryPath, and pageType when UFE rolls out
         ** to other pages besides HP
         */
        let targetParams = {
            pageName: window.location.pathname,
            locale: getCurrentCountry().toLowerCase(),
            brand: '',
            categoryPath: '',
            pageType: ''
        };

        if (user.profileStatus !== 0 && typeof user.beautyInsiderAccount !== 'undefined') {
            const userData = user.beautyInsiderAccount;
            const birthDate = userData.birthMonth + '/' +
                userData.birthDay + '/' + userData.birthYear;

            const addToParams = function (paramsKey, dataKey) {
                /* This will not add the parameter if it does not exist in the user info data.
                 ** This is so user info data saved by Test & Target is not overwritten
                 ** with blank data.
                 */

                if (dataKey !== '') {
                    targetParams[paramsKey] = dataKey;
                }
            };

            addToParams('profile.biStatus', userData.vibSegment.toLowerCase());
            addToParams('profile.biPoints', userData.promotionPoints);
            addToParams('profile.biYtdSpend', userData.vibSpendingForYear);
            addToParams('profile.birthday', birthDate);
            addToParams('profile.biSignUpDate', new Date(userData.signupDate)
                .toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                }));
            addToParams('gender', getSelected(userData.personalizedInformation.gender));
            addToParams('eyeColor', getSelected(userData.personalizedInformation.eyeColor));
            addToParams('skinType', getSelected(userData.personalizedInformation.skinType));
            addToParams('skinCareConcerns',
                getSelected(userData.personalizedInformation.skinConcerns));
            addToParams('skinTone', getSelected(userData.personalizedInformation.skinTone));
            addToParams('hairColor', getSelected(userData.personalizedInformation.hairColor));
            addToParams('yourHair', getSelected(userData.personalizedInformation.hairDescrible));
            addToParams('hairConcerns', getSelected(userData.personalizedInformation.hairConcerns));

            /* cache targetParams only for authenticated users. */
            Storage.local.setItem(LOCAL_STORAGE.TARGET_PARAMS, targetParams);
        }

        return targetParams;
    },

    setComponentArrangement: function () {
        let newArrangement = {};

        /* This property is used to verify that the amount of BCC components assigned to a
        specific test matches the amount of components prescribed in T&T. */
        this.componentCount = this.arrangement.length;

        /* We transform the arrangement array into an object where each key will be
        the original component's name and its value is its replacements component's
        name. This way, the swapping TestTarget instance can do a look-up like
        arrangement[this.props.name] to get the name of the component it is supposed
        to swap with. */
        this.arrangement.forEach(item => {
            newArrangement[item.originalComponent] = item.replacementComponent;
        });

        this.arrangement = newArrangement;
    },

    checkTestAndTargetFlags: function (PPageTestAndTargetData) {

        let isMobile = Sephora.isMobile();
        let targetResults = { };
        if (!isMobile && PPageTestAndTargetData &&
            PPageTestAndTargetData.hidePPageChatDesktop) {
            targetResults.hideChat = true;
            Sephora.configurationSettings.isPPagesChatEnabled = false;
        } else if (!isMobile && PPageTestAndTargetData &&
            PPageTestAndTargetData.hidePPageFlashBannerAndChatDesktop) {
            targetResults.hideChat = true;
            Sephora.configurationSettings.isPPagesChatEnabled = false;
        } else if (isMobile && PPageTestAndTargetData &&
            PPageTestAndTargetData.hidePPageChatMW) {
            targetResults.hideChat = true;
            Sephora.configurationSettings.isPPagesChatEnabled = false;
        } else if (isMobile && PPageTestAndTargetData &&
            PPageTestAndTargetData.hidePPageFlashBannerAndChatMW) {
            targetResults.hideChat = true;
            Sephora.configurationSettings.isPPagesChatEnabled = false;
        }
        return targetResults;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/TestTarget.js