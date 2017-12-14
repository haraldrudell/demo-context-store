// This module provides API call methods for Sephora Commerce Profile APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Profile+APIs


const createUser = require('./createUser');

const { getPublicProfileByNickname,
        getCurrentProfileEmailSubscriptionStatus,
        lookupProfileByLogin,
        getProfileForPasswordReset } = require('./getProfile');

const getProfileFullInformation = require('./getProfileFullInformation');

const { getProfileIdentifiersByNickname,
        getProfileIdentifiersByPublicId,
        getProfileIdentifiersByProfileId } = require('./getProfileIdentifiers');

const { getShoppingList,
        addItemsToShoppingList,
        removeItemsFromShoppingList } = require('./shoppingList');

const getOrderHistory = require('./getOrderHistory');
const getReservations = require('./getReservations');
const updateProfile = require('./updateProfile');
const removePayPalFromProfile = require('./removePayPalFromProfile');
const cancelSubscription = require('./cancelSubscription');
const setNickname = require('./setNickname');
const updatePlaySubscription = require('./playSubscription/updatePlaySubscription');

const getCreditCardsFromProfile = require('./creditCards/getCreditCardsFromProfile');
const setDefaultCreditCardOnProfile = require('./creditCards/setDefaultCreditCardOnProfile');
const addCreditCardToProfile = require('./creditCards/addCreditCardToProfile');
const updateCreditCardOnProfile = require('./creditCards/updateCreditCardOnProfile');
const removeCreditCardFromProfile = require('./creditCards/removeCreditCardFromProfile');

const { getPromotionalEmailPreferences,
        setPromotionalEmailPreferences } = require('./mailingPreferences/promotionalEmails');

const { getNotificationsAndRemindersPreferences,
        setNotificationsAndRemindersPreferences } = require('./mailingPreferences/notificationsAndReminders');

const { getPostalMailPreferences,
        setPostalMailPreferences } = require('./mailingPreferences/postalMail');

const { getPlayEmailPreferences } = require('./mailingPreferences/play');

const getUserSpecificProductDetails = require('./getUserSpecificProductDetails');

const enrollToSephoraEmails = require('./enrollToSephoraEmails');

const getLithiumSSOToken = require('./getLithiumSSOToken');

const addShippingAddress = require('./addresses/addShippingAddress');
const getShippingAddresses = require('./addresses/getShippingAddresses');
const removeShippingAddress = require('./addresses/removeShippingAddress');
const updateShippingAddress = require('./addresses/updateShippingAddress');
const setDefaultShippingAddress = require('./addresses/setDefaultShippingAddress');

const { getProfileSamplesByDMG } = require('./getProfileSamples');
const switchCountry = require('./switchCountry');


module.exports = {
    createUser,

    getPublicProfileByNickname,
    getCurrentProfileEmailSubscriptionStatus,
    getProfileIdentifiersByNickname,
    getProfileIdentifiersByPublicId,
    getShoppingList,
    addItemsToShoppingList,
    removeItemsFromShoppingList,
    lookupProfileByLogin,
    getProfileForPasswordReset,
    getProfileFullInformation,
    getProfileIdentifiersByProfileId,
    getOrderHistory,
    getReservations,
    updateProfile,
    removePayPalFromProfile,
    cancelSubscription,
    setNickname,
    updatePlaySubscription,

    getCreditCardsFromProfile,
    setDefaultCreditCardOnProfile,
    addCreditCardToProfile,
    updateCreditCardOnProfile,
    removeCreditCardFromProfile,

    addShippingAddress,
    getShippingAddresses,
    removeShippingAddress,
    updateShippingAddress,
    setDefaultShippingAddress,

    getPromotionalEmailPreferences,
    setPromotionalEmailPreferences,
    getNotificationsAndRemindersPreferences,
    setNotificationsAndRemindersPreferences,
    getPostalMailPreferences,
    setPostalMailPreferences,
    getPlayEmailPreferences,

    getUserSpecificProductDetails,

    enrollToSephoraEmails,

    getLithiumSSOToken,

    getProfileSamplesByDMG,

    switchCountry
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/index.js