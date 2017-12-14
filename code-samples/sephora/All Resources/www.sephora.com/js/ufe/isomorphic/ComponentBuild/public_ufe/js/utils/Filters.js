'use strict';
const biUtils = require('utils/BiProfile');

const ADD_REVIEW_PAGES_NAMES = {
    SHADES: 'SHADES',
    RATE_AND_REVIEW: 'RATE_AND_REVIEW',
    ABOUT_YOU: 'ABOUT_YOU',
    CONFIRMATION: 'CONFIRMATION'
};

const REVIEW_FILTERS_TYPES = {
    SKU: 'SKU',
    CUSTOM: 'CUSTOM',
    EXTERNAL: 'EXTERNAL',
    INTERNAL: 'INTERNAL',
    SORT: 'SORT',
    ALL: 'ALL'
};

const REVIEW_SORT_TYPES = [
    'Helpfulness:desc',
    'SubmissionTime:desc',
    'SubmissionTime:asc',
    'Rating:desc',
    'Rating:asc'
];

const REVIEW_SORT_TYPES_LABELS = {
    'Helpfulness:desc': 'Most Helpful',
    'SubmissionTime:desc': 'Newest',
    'SubmissionTime:asc': 'Oldest',
    'Rating:desc': 'Highest Rating',
    'Rating:asc': 'Lowest Rating'
};

let filters = {

    BEAUTY_MATCH_CHECKBOX_TYPES: {
        GALLERY: 'GALLERY',
        REVIEW: 'REVIEW',
        MODAL_REVIEW: 'MODAL_REVIEW'
    },

    TYPES: {
        CHECKBOX: 'CHECKBOX',
        RADIO: 'RADIO'
    },

    ADD_REVIEW_PAGES_NAMES: ADD_REVIEW_PAGES_NAMES,

    REVIEW_SORT_TYPES: REVIEW_SORT_TYPES,

    REVIEW_SORT_TYPES_LABELS: REVIEW_SORT_TYPES_LABELS,

    REVIEW_FILTERS_TYPES: REVIEW_FILTERS_TYPES,

    REVIEW_FILTERS: {
        [biUtils.TYPES.EYE_COLOR]: {
            label: 'Reviewer Eye Color',
            type: REVIEW_FILTERS_TYPES.INTERNAL,
            values: ['Blue', 'Brown', 'Green', 'Gray', 'Hazel'],
            hasImages: true,
            bvValues: ['blue', 'brown', 'green', 'gray', 'hazel'],
            bvName: 'eyeColor'
        },
        [biUtils.TYPES.HAIR_COLOR]: {
            label: 'Reviewer Hair Color',
            type: REVIEW_FILTERS_TYPES.INTERNAL,
            values: ['Blonde', 'Brunette', 'Auburn', 'Black', 'Red', 'Gray'],
            hasImages: true,
            bvValues: ['blonde', 'brunette', 'auburn', 'black', 'red', 'gray'],
            bvName: 'hairColor'
        },
        [biUtils.TYPES.SKIN_TONE]: {
            label: 'Reviewer Skin Tone',
            type: REVIEW_FILTERS_TYPES.INTERNAL,
            values: ['Porcelain', 'Fair', 'Light', 'Medium', 'Tan', 'Olive', 'Deep', 'Dark',
                'Ebony'],
            hasImages: true,
            bvValues: ['porcelain', 'fair', 'light', 'medium', 'tan', 'olive', 'deep', 'dark',
                'ebony'],
            bvName: 'skinTone'
        },
        [biUtils.TYPES.SKIN_TYPE]: {
            label: 'Reviewer Skin type',
            type: REVIEW_FILTERS_TYPES.INTERNAL,
            values: ['Normal', 'Combination', 'Dry', 'Oily'],
            bvValues: ['normal', 'combination', 'dry', 'oily'],
            bvName: 'skinType'
        },
        [biUtils.TYPES.SKIN_CONCERNS]: {
            label: 'Reviewer Skin Concerns',
            type: REVIEW_FILTERS_TYPES.INTERNAL,
            values: ['Acne', 'Aging', 'Blackheads', 'Calluses', 'Cellulite', 'Cuticles',
                'Dark Circles', 'Dullness', 'Redness', 'Sensitivity', 'Stretch Marks', 'Sun Damage',
                'Uneven Skin Tones'],
            bvValues: ['acne', 'aging', 'blackheads', 'calluses', 'cellulite', 'cuticles',
                'darkCircles', 'dullness', 'redness', 'sensitivity', 'stretchMarks', 'sunDamage',
                'unevenSkinTones'],
            bvName: 'skinConcerns'
        },
        [biUtils.TYPES.HAIR_DESCRIBE]: {
            label: 'Reviewer Hair type',
            type: REVIEW_FILTERS_TYPES.INTERNAL,
            values: ['Chemically Treated', 'Coarse', 'Curly', 'Dry', 'Fine', 'Normal', 'Oily',
                'Straight', 'Wavy'],
            bvValues: ['chemicallyTreated', 'coarse', 'curly', 'dry', 'fine', 'normal', 'oily',
                'straight', 'wavy'],
            bvName: 'hairCondition'
        },
        [biUtils.TYPES.HAIR_CONCERNS]: {
            label: 'Reviewer Hair Concerns',
            type: REVIEW_FILTERS_TYPES.INTERNAL,
            values: ['Anti-aging', 'Color Protection', 'Curl Enhancing', 'Damaged', 'Dandruff',
                'Frizz', 'Heat Protection', 'Hold', 'Oiliness', 'Shine', 'Straightening/Smoothing',
                'Thinning', 'Volumizing'],
            bvValues: ['AntiAging', 'ColorProtection', 'CurlyEnhancing', 'Damage', 'Dandruff',
                'Frizz', 'HeatProtection', 'Hold', 'Oiliness', 'Shine', 'StraighteningSmoothing',
                'Thinning', 'Volumizing'],
            bvName: 'hairConcerns'
        },
        [biUtils.TYPES.AGE_RANGE]: {
            label: 'Reviewer Age Range',
            type: REVIEW_FILTERS_TYPES.INTERNAL,
            values: ['13-17', '18-24', '25-34', '35-44', '45-54', 'Over 54'],
            bvValues: ['13to17', '18to24', '25to34', '35to44', '45to54', 'over54'],
            bvName: 'age'
        },
        'reviewContent': {
            label: 'Review Content',
            type: REVIEW_FILTERS_TYPES.EXTERNAL,
            values: ['Photos', 'Video']
        }
    },

    NON_BV_FILTERS: ['reviewContent'],

    shadeCodeToHEX: function(val) {
        const shademap = {
            '1Y01': 'd0b5a7',
            '2Y01': 'd4b5a1',
            '3Y01': 'd4b59f',
            '4Y01': 'd4b69d',
            '5Y01': 'd3b69d',
            '1R02': 'd1af9f',
            '1Y02': 'ceb0a0',
            '2Y02': 'd0b09c',
            '3Y02': 'cfb09b',
            '4Y02': 'ceb199',
            '5Y02': 'cdb198',
            '2R03': 'd0aa9b',
            '1R03': 'ccaa9b',
            '1Y03': 'cbaa99',
            '2Y03': 'cdac98',
            '3Y03': 'ccad97',
            '4Y03': 'caad96',
            '5Y03': 'c9ad95',
            '5R04': 'c49e96',
            '4R04': 'c4a096',
            '3R04': 'c4a195',
            '2R04': 'c4a193',
            '1R04': 'c2a294',
            '1Y04': 'c2a292',
            '2Y04': 'c1a18f',
            '3Y04': 'bfa290',
            '4Y04': 'bfa38f',
            '5Y04': 'bda38e',
            '5R05': 'c09990',
            '4R05': 'c2998e',
            '3R05': 'c19b8e',
            '2R05': 'c09b8e',
            '1R05': 'bf9c8d',
            '1Y05': 'bf9c8a',
            '2Y05': 'be9c88',
            '3Y05': 'bc9d8a',
            '4Y05': 'bb9e88',
            '5Y05': 'b89f8b',
            '5R06': 'c0958a',
            '4R06': 'c09487',
            '3R06': 'bf9587',
            '2R06': 'bf9684',
            '1R06': 'bb9684',
            '1Y06': 'ba9581',
            '2Y06': 'ba9681',
            '3Y06': 'b89882',
            '4Y06': 'b79980',
            '5Y06': 'b6997e',
            '5R07': 'b88e83',
            '4R07': 'b88d81',
            '3R07': 'b88d7f',
            '2R07': 'b78e7d',
            '1R07': 'b78f7d',
            '1Y07': 'b6907c',
            '2Y07': 'b4907a',
            '3Y07': 'b49177',
            '4Y07': 'b29276',
            '5Y07': 'b19275',
            '4R08': 'b48477',
            '3R08': 'b48574',
            '2R08': 'b48571',
            '1R08': 'b4866f',
            '1Y08': 'b3876e',
            '2Y08': 'b1886c',
            '3Y08': 'ad886e',
            '4Y08': 'ab8a6f',
            '5Y08': 'a98b6d',
            '4R09': 'aa7e71',
            '3R09': 'ab7e6e',
            '2R09': 'ab7f6b',
            '1R09': 'ac7f69',
            '1Y09': 'a87e65',
            '2Y09': 'a78065',
            '3Y09': 'a58164',
            '4Y09': 'a38164',
            '5Y09': 'a28364',
            '3R10': 'a57461',
            '2R10': 'a4745f',
            '1R10': 'a3765e',
            '1Y10': 'a1765c',
            '2Y10': '9d775d',
            '3Y10': '9b785d',
            '4Y10': '98795d',
            '3R11': '986b59',
            '2R11': '986b55',
            '1R11': '976c53',
            '1Y11': '946c52',
            '2Y11': '946d51',
            '3Y11': '8f6e54',
            '4Y11': '8e6f54',
            '3R12': '89604e',
            '2R12': '89614d',
            '1R12': '88614b',
            '1Y12': '87624a',
            '2Y12': '87644b',
            '3Y12': '84644a',
            '3R13': '765546',
            '2R13': '775645',
            '1R13': '775744',
            '1Y13': '765743',
            '2Y13': '765741',
            '4R14': '654a40',
            '3R14': '654c41',
            '2R14': '664c40',
            '1R14': '684d3d',
            '1Y14': '6a4d39',
            '4R15': '56433c',
            '3R15': '57433a',
            '2R15': '574136',
            '1R15': '5b4233'
        };

        return shademap[val];
    },

    getReviewImages: function (filterKey, values) {
        return values.map(value => {
            let filterValue = value.toLowerCase();
            // TODO: fix this dirty hack for image
            if (filterKey === biUtils.TYPES.EYE_COLOR && value === 'Gray') {
                filterValue = 'grey';
            }
            return '/img/ufe/rich-profile/' + filterKey.toLowerCase() + '-' +
                filterValue + '.png';
        });
    },

    getBazaarVoiceFilter: function (filterKey, filterValues, bvFilters) {
        if (filterKey === REVIEW_FILTERS_TYPES.SKU || !filterValues || !filterValues.length) {
            return null;
        }
        let value = '';
        let isSort = filterKey === REVIEW_FILTERS_TYPES.SORT;
        let prefix = !isSort ? 'contextdatavalue_' +
            (filters.REVIEW_FILTERS[filterKey].bvName || '') +
            ':' : '';

        if (filterKey === 'reviewContent') {
            if (filterValues.indexOf('Photos') >=0) {
                bvFilters.push('HasPhotos:eq:true');
            }
            if (filterValues.indexOf('Video') >=0) {
                bvFilters.push('HasVideos:eq:true');
            }

            // Prevents processing of the filter key below since its values have already been
            // added to filters here
            value = null;

        } else if (isSort) {
            value = filterValues.join(',');
        } else {
            value = this.getBVValues(filterKey, filterValues, null);
        }
        return value ? prefix + value : null;
    },

    getBVValues: function (name, values) {
        let bvValue = [];
        (values instanceof Array ? values : values.split(', ')).forEach(value => {
            let valueIndex = filters.REVIEW_FILTERS[name].values.indexOf(value);
            if (valueIndex >=0) {
                bvValue.push(filters.REVIEW_FILTERS[name].bvValues[valueIndex]);
            }
        });
        return bvValue.join(',');
    },

    /**
     * Return ContextData values for bi attributes.
     *
     * null or undefined values are not included
     *
     * @param user
     * @param info
     * @returns {{ContextDataValue_age: string}}
     */
    getContextDataValues: function(user, info, extraData) {
        let contextDataValues = {};
        let biTypes = biUtils.TYPES;
        user.beautyInsiderAccount.birthRange &&
            (contextDataValues['ContextDataValue_' + this.REVIEW_FILTERS[biTypes.AGE_RANGE].
                bvName] = this.getBVValues(biTypes.AGE_RANGE,
                user.beautyInsiderAccount.birthRange));

        info.skinTone &&
            (contextDataValues['ContextDataValue_' + this.REVIEW_FILTERS[biTypes.SKIN_TONE].
                bvName] = this.getBVValues(biTypes.SKIN_TONE, info.skinTone));

        info.skinType &&
            (contextDataValues['ContextDataValue_' + this.REVIEW_FILTERS[biTypes.SKIN_TYPE].
                bvName] = this.getBVValues(biTypes.SKIN_TYPE, info.skinType));

        info.eyeColor &&
            (contextDataValues['ContextDataValue_' + this.REVIEW_FILTERS[biTypes.EYE_COLOR].
                bvName] = this.getBVValues(biTypes.EYE_COLOR, info.eyeColor));

        info.hairColor &&
            (contextDataValues['ContextDataValue_' + this.REVIEW_FILTERS[biTypes.HAIR_COLOR].
                bvName] = this.getBVValues(biTypes.HAIR_COLOR, info.hairColor));

        info.skinConcerns && (contextDataValues['ContextDataValue_' +
            this.REVIEW_FILTERS[biTypes.SKIN_CONCERNS].bvName] =
            this.getBVValues(biTypes.SKIN_CONCERNS, info.skinConcerns));

        info.hairDescribe && (contextDataValues['ContextDataValue_' +
            this.REVIEW_FILTERS[biTypes.HAIR_DESCRIBE].bvName] =
            this.getBVValues(biTypes.HAIR_DESCRIBE, info.hairDescribe));

        info.hairConcerns && (contextDataValues['ContextDataValue_' +
            this.REVIEW_FILTERS[biTypes.HAIR_CONCERNS].bvName] =
            this.getBVValues(biTypes.HAIR_CONCERNS, info.hairConcerns));

        if (extraData) {
            extraData.isFreeSample &&
                (contextDataValues['ContextDataValue_IncentivizedReview'] = 'true');
            extraData.isSephoraEmployee &&
                (contextDataValues['ContextDataValue_StaffContext'] = 'true');
        }
        return contextDataValues;
    },

    /**
     * Creates an array of sku values used for displaying filtering options
     * @param  {skus} array of skus for product
     * @return {skuList} object containing label, value and image arrays
     */
    createSkuAggregatedList: function (skus) {

        /* Create filter option label */
        let getAccSkuID = function (sku) {
            let { refinements = {} } = sku;
            let {
                finishRefinements = []
            } = refinements;
            return sku.variationValue + ' - ' + finishRefinements.join(',');
        };
        let skuList = {
            labels: [],
            values: [],
            images: []
        };

        let skusAggregetedBySize = skus.reduce((acc, sku) => {
            let accSkuID = getAccSkuID(sku);
            let skuInAcc = acc[accSkuID];
            if (!skuInAcc) {
                acc[accSkuID] = {
                    value: sku.skuId,
                    label: accSkuID,
                    image: sku.smallImage
                };
            } else {
                acc[accSkuID].value += ',' + sku.skuId;
            }
            return acc;
        }, {});
        Object.keys(skusAggregetedBySize).forEach(key => {
            let skuAggregetedBySize = skusAggregetedBySize[key];
            skuList.labels.push(skuAggregetedBySize.label);
            skuList.values.push(skuAggregetedBySize.value);
            skuList.images.push(skuAggregetedBySize.image);
        });

        return skuList;
    },

    convertFilterName: function (bvFilterName) {
        for (let key in this.REVIEW_FILTERS) {
            if (hasOwnProperty.call(this.REVIEW_FILTERS, key)) {
                if (this.REVIEW_FILTERS[key].bvName === bvFilterName) {
                    return key;
                }
            }
        }
        return null;
    }
    
};

module.exports = filters;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Filters.js