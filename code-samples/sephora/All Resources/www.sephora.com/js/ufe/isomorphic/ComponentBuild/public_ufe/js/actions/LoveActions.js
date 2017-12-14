const profileApi = require('services/api/profile');

const TYPES = {
    UPDATE_LOVES_LIST: 'UPDATE_LOVES_LIST',
    UPDATE_SHOPPING_LIST_IDS: 'UPDATE_SHOPPING_LIST_IDS'
};

function setShoppingListIds(shoppingListItems) {
    return shoppingListItems.map(love => love.sku.skuId);
}

function updateLovesList(currentLoves) {
    return {
        type: TYPES.UPDATE_LOVES_LIST,
        currentLoves: currentLoves
    };
}

function getLovesList(profileId, callback) {
    return dispatch => {
        profileApi.getShoppingList(profileId).then(json => {
            const loves = json.shoppingListItems;
            if (typeof callback === 'function') {
                callback(loves);
            }
            return dispatch(updateLovesList(loves));
        });
    };
}

function updateShoppingListIds(skuIdArray) {

    /* See notes for this in reducers/loves.js */
    return {
        type: TYPES.UPDATE_SHOPPING_LIST_IDS,
        shoppingListIds: skuIdArray
    };
}

function setLovesList(shoppingList) {
    return dispatch => {
        let result;
        if (shoppingList && shoppingList.shoppingListItems) {
            const loves = shoppingList.shoppingListItems;
            const loveIds = setShoppingListIds(loves);
            dispatch(updateShoppingListIds(loveIds));
            result = dispatch(updateLovesList(loves));
        }
        return result;
    };
}

function lovesListChanged(data, profileId, dispatch, callback) {
    if (typeof callback === 'function') {
        callback();
    }
    dispatch(getLovesList(profileId, (lovesRes) => {
        return dispatch(updateShoppingListIds(lovesRes.map(loveItem =>
            loveItem.sku.skuId)));
    }));


    // TODO 17.2: Handle optimistically
}

function addLove(data, callback) {
    return (dispatch, getState) => {
        let profileId = getState().user.profileId;
        data = data instanceof Array ? data : [data];
        profileApi.addItemsToShoppingList(data).then(res => {
            lovesListChanged(res[data.length - 1], profileId, dispatch, callback);
        });
    };
}

function removeLove(data) {
    return (dispatch, getState) => {
        let profileId = getState().user.profileId;
        data = data instanceof Array ? data : [data];
        profileApi.removeItemsFromShoppingList(data, profileId).then(res => {
            lovesListChanged(res[data.length - 1], profileId, dispatch);
        });
    };
}

module.exports = {
    TYPES: TYPES,
    getLovesList: getLovesList,
    setLovesList: setLovesList,
    updateLovesList: updateLovesList,
    updateShoppingListIds: updateShoppingListIds,
    addLove: addLove,
    removeLove: removeLove
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/LoveActions.js