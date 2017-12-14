'use strict';
const store = require('store/Store');
const watch = require('redux-watch');

const COMPONENT_NAMES = {
    CAROUSEL: 54,
    GRID: 55,
    IMAGE: 53,
    LINK: 58,
    LINK_GROUP: 59,
    MARKDOWN: 57,
    MODAL: 56,
    REWARDS_CAROUSEL: 62,
    SLIDESHOW: 52,
    VIDEO: 61,
    TARGETER: 63,
    HTML: 64,
    PRODUCT_FINDER: 66
};

const IMAGE_SIZES = {
    '42': 42,
    '50': 50,
    '62': 62,
    '97': 97,
    '135': 135,
    '162': 162,
    '250': 250,
    '300': 300,
    '450': 450,
    '1500': 1500
};

const BCC = {
    COMPONENT_NAMES,
    IMAGE_SIZES,
    /** Function to process targeters async after userInfo service has completed */
    processTargeters: function (targetersList, callback) {
        if (!(targetersList instanceof Array)) {
            targetersList = [targetersList];
        }

        for (let i = 0; i < targetersList.length; i++) {
            let targeterName = targetersList[i];
            let targeters = store.getState().targeters;
            if (targeters.results && targeters.results.targeterResult &&
                targeters.results.targeterResult[targeterName]) {
                callback(targeters.results.targeterResult[targeterName], targeterName);
            }

            let watchTargeters = watch(store.getState, 'targeters');

            store.subscribe(watchTargeters(watchedTargeters => {
                if (watchedTargeters.results && watchedTargeters.results.targeterResult &&
                    watchedTargeters.results.targeterResult[targeterName]) {
                    callback(watchedTargeters.results.targeterResult[targeterName], targeterName);
                }
            }));
        }
    }
};

module.exports = BCC;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/BCC.js