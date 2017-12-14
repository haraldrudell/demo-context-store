const LOVE_ACTION_TYPES = require('actions/LoveActions').TYPES;

const initialState = {
    currentLoves: [],
    shoppingListIds: []
};

/* shoppingListIds contains the skuId of every loved item in currentLoves.
*
* This is to ease the handling of add/remove loves locally upon POST/DELETE success.
* The addLove and removeLove actions will manipulate the requested sku accordingly here
* as we don't really need to fetch the updated list of loved skus if the API operations
* were successful. This state will not persist session, however, each page load will
* populate the list correctly.
*/

module.exports = function (state = initialState, action) {
    switch (action.type) {
        case LOVE_ACTION_TYPES.UPDATE_LOVES_LIST:
            return Object.assign({}, state, {
                currentLoves: action.currentLoves
            });
        case LOVE_ACTION_TYPES.UPDATE_SHOPPING_LIST_IDS:
            return Object.assign({}, state, {
                shoppingListIds: action.shoppingListIds
            });
        default:
            return state;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/reducers/loves.js