const refetch = require('Refetch');
const restApi = require('RestApi');


// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Shopping+List


const _refetchAll = function (requestParamsList) {
    return Promise.all(
        requestParamsList.map(requestParams =>
            refetch.fetch(requestParams.url, requestParams.options)
        )
    ).then(values => {
        let promise;

        let errors = values.filter(data => data.errorCode);
        if (errors.length) {
            promise = Promise.reject(errors);
        } else {
            promise = Promise.resolve(values);
        }

        return promise;
    });
};

function addItemsToShoppingList(params) {
    return _refetchAll(params.map(data => {
        return {
            url: restApi.getRestLocation('/api/users/profiles/shoppingList'),
            options: {
                method: 'POST',
                body: JSON.stringify({
                    skuId: data.skuId,
                    source: data.loveSource
                })
            }
        };
    }));
}

function removeItemsFromShoppingList(params, profileId) {
    return _refetchAll(params.map(skuId => {
        return {
            url: restApi.getRestLocation('/api/users/profiles/' +
                profileId + '/shoppingList/' + skuId),
            options: {
                method: 'DELETE'
            }
        };
    }));
}

function getShoppingList(profileId) {
    let url = '/api/users/profiles/' + profileId + '/shoppingList';
    return refetch.fetch(restApi.getRestLocation(url), {
        method: 'GET'
    }).then(data => data.errorCode ? Promise.reject(data) : data);
}

module.exports = {
    addItemsToShoppingList,
    removeItemsFromShoppingList,
    getShoppingList
};



// WEBPACK FOOTER //
// ./public_ufe/js/services/api/profile/shoppingList.js