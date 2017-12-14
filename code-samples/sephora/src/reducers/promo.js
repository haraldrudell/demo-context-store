const ACTION_TYPES = require('actions/PromoActions').TYPES;
const initialState = {
    promo: null,
    promoCode: null,
    afterLogin: null,
    msgPromosSkuList: [],
    promoErrorMessage: null
};
module.exports = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_PROMOS:
            return Object.assign({}, state, {
                promo: action.promo,
                promoApplied: action.promoApplied,
                showApplyButton: false,
                promoCode: action.promoCode,
                afterLogin: null,
                msgPromosSkuList: []
            });
        case ACTION_TYPES.APPLY_PROMO_AFTER_LOGIN:
            return Object.assign({}, state, { afterLogin: action.promoCode });
        case ACTION_TYPES.UPDATE_MSG_PROMO_LIST:
            return Object.assign({}, state, {
                msgPromosSkuList: action.msgPromosSkuList,
                promoCode: action.promoCode 
            });
        case ACTION_TYPES.SHOW_PROMOS_ERROR:
            return Object.assign({}, state, { promoErrorMessage: action.promoErrorMessage });
        case ACTION_TYPES.REMOVE_PROMOS:
            return Object.assign({}, state, {
                promo: action.promo,
                promoApplied: action.promoApplied,
                showApplyButton: true,
                promoMessage: null
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/promo.js