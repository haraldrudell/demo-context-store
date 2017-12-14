const store = require('Store');
const userUtils = require('utils/User');

const TYPES = {
    EYE_COLOR: 'eyeColor',
    HAIR_COLOR: 'hairColor',
    SKIN_TYPE: 'skinType',
    SKIN_TONE: 'skinTone',
    SKIN_CONCERNS: 'skinConcerns',
    HAIR_DESCRIBE: 'hairDescribe',
    HAIR_CONCERNS: 'hairConcerns',
    AGE_RANGE: 'ageRange'
};

const BEAUTY_MATCH_TEXT = `This reviewer has traits similar to yours 
    based on your Beauty Insider profile.`;

const BiProfile = {
    TYPES: TYPES,
    BEAUTY_MATCH_TEXT: BEAUTY_MATCH_TEXT,

    /**
     * Given a two sets of user trait values, 
     * returns a list of traits both users have in common
     * @param {Object} userBiTraits - Object containing bi traits of logged in user.
     * @param {Object} reviewerBiTraits - Object containig bi traits of reviewer.
     * @param {Array} traitListToMatch - Array of bi traits.
     */
    getMatchingBiTraits: function (userBiTraits, reviewerBiTraits, traitListToMatch) {
        let matchedTraits;

        if (userBiTraits && reviewerBiTraits) {
            matchedTraits = traitListToMatch.filter((trait) => {
                return userBiTraits[trait] === 
                    (reviewerBiTraits[trait] && reviewerBiTraits[trait].ValueLabel);
            });
        }

        return matchedTraits;
    },

    /**
     * Checks if logged in user has bi traits
     * if user does, returns a cleaned up version of the traits
     * if user does not have any bi traits, returns undefined
     */
    getBiProfileInfo: function () {
        const user = store.getState().user;

        let userBiInfo = user && user.beautyInsiderAccount &&
            user.beautyInsiderAccount.personalizedInformation;

        /* TODO: biPersonalInfoDisplayCleanUp should be moved to BiProfile util */
        return userBiInfo && userUtils.biPersonalInfoDisplayCleanUp(userBiInfo);
    },

    /**
     * Takes a list of bi traits and reorders them according to 
     * the order of traits of biTraitsOrder
     * @param {Array} biTraits - Logged in users's bi traits.
     * @param {Array} biTraitsOrder - List of bi traits in desired order
     */
    sortBiTraits: function(biTraits, biTraitsOrder) {
        let biTraitsArray = biTraits || [];

        biTraitsArray.sort(function (a, b) {
            var p = biTraitsOrder;
            return p.indexOf(a.Id) < p.indexOf(b.Id) ? -1
                : p.indexOf(a.Id) > p.indexOf(b.Id) ? 1
                : 0;
        });

        return biTraitsArray;
    },

    /** Transform data from the profile, which comes in the format:
     * {@param} {Object} savedData - an Object containing ONLY the data the user has
     * just changed. It could be as follows:
     * skinConcerns: [
     *     {
 *        displayName: "Acne",
 *        isSelected: true,
 *        value: "acne"
 *     }, {
 *         displayName: "Aging",
 *         isSelected: true,
 *         value: "aging"
 *    }
     * ]
     * {@param} {Object} wholedata - an Object containing the whole set of properties
     * related to the user profile (including the old values from the data the user
     * has just changed).
     *
     * {@returns} An object containing all data (replacing the old values with the new
     * ones the user has just changed) in the format that is needed for saving the data,
     * for instance, given the previous example:
     * skinConcerns: [ "acne", "aging" ]
     */
    completeProfileObject: function (savedData, wholeData) {
        const SINGLE_VALUE_PROPERTY = [
            'eyeColor',
            'gender',
            'hairColor',
            'skinTone',
            'skinType'
        ];

        // Get the keys from the data the user has just saved
        let savedDataKeys = Object.keys(savedData);
        // Get ALL the keys from ALL data
        let wholeDataKeys = Object.keys(wholeData);
        let finalObject;
        let personalizedInfo = [];

        // Get an array of ONLY the keys that are not being saved by the user right now
        let intactKeys = wholeDataKeys.filter(key => savedDataKeys.indexOf(key) === -1);

        for (let key of intactKeys) {
            for (let obj of wholeData[key]) {
                if (obj.isSelected) {
                    // Some properties can have multiple values, but some others can have JUST ONE.
                    // If we have a value that only allows a single one, set the property to that.
                    // Otherwise, push the value in an array
                    if (SINGLE_VALUE_PROPERTY.indexOf(key) !== -1) {
                        personalizedInfo[key] = obj.value;
                    } else {
                        if (personalizedInfo[key]) {
                            personalizedInfo[key].push(obj.value);
                        } else {
                            personalizedInfo[key] = [obj.value];
                        }
                    }
                }
            }
        }

        // Return the "merged" object from combining the two (the one the user just saved and
        // the rest of properties)
        return Object.assign({}, savedData, personalizedInfo);
    }
};

module.exports = BiProfile;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/BiProfile.js