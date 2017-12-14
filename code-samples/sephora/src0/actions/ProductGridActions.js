// THE PRODUCTGRID IMPLEMENTATION IS OUT OF DATE
// IF THIS IS GOING TO BE USED, IT NEEDS TO BE REVISITED AND BROUGHT UP TO DATE WITH LATEST UFE
// STANDARDS.

const urlUtils = require('utils/Url');
const snbApi = require('services/api/search-n-browse');
const ProductFilterActions = require('./ProductFilterActions');


const TYPES = {
    CHANGE_CATEGORY: 'PRODUCT_GRID.CHANGE_CATEGORY',
    REQUEST_PRODUCTS: 'PRODUCT_GRID.REQUEST_PRODUCTS',
    RECEIVE_PRODUCTS: 'PRODUCT_GRID.RECEIVE_PRODUCTS',
    UPDATE_TOTAL_PRODUCTS: 'PRODUCT_GRID.UPDATE_TOTAL_PRODUCTS'
};

function changeCategory(categoryId) {
    return {
        type: TYPES.CHANGE_CATEGORY,
        categoryId: categoryId
    };
}

function receiveProducts(products) {
    return {
        type: TYPES.RECEIVE_PRODUCTS,
        products: products
    };
}

function updateTotalProducts(totalProducts) {
    return {
        type: TYPES.UPDATE_TOTAL_PRODUCTS,
        totalProducts: totalProducts
    };
}

/**
 * This method is out of date and would need to be revisited using current UFE best practices
 * if it were to be used.
 * @returns {function(*, *)}
 */
function fetchProducts() {
    return (dispatch, getState) => {

        // (!) Mykhaylo Gavrylyuk:
        // This side effect is separated from the rest of the action's work and
        // per comment left by Aaron Liebling earlier, this is broken and needs
        // to be revisited.
        // Aaron Liebling:
        // > TODO: queryUrl does not match the current parameter requirements for
        // > buildQuery. This would need to be fixed if it is to be used.
        (() => {
            let queryUrl = [];

            let filters = getState().productFilters.filters;
            let currentSort = getState().productSort.currentSort;

            let query = {
                filters: {
                    name: 'ref',
                    value: filters.toString()
                },
                sorts: {
                    name: 'sortBy',
                    value: currentSort
                }
            };

            if (filters && filters.length) {
                queryUrl.push(query.filters);
            }

            if (currentSort && currentSort.length) {
                queryUrl.push(query.sorts);
            }

            queryUrl = urlUtils.buildQuery(queryUrl);
            urlUtils.updateURL(queryUrl, null, false);
        })();


        let options = {
            categoryId: getState().productGrid.categoryId,
            currentPage: getState().productGrid.currentPage,
            pageSize: 60,
            ref: getState().productFilters.filters.toString(),
            sortBy: getState().productSort.currentSort
        };

        return snbApi.getNthLevelCategory(options).then(data => {
            dispatch(receiveProducts(data.products));
            dispatch(updateTotalProducts(data.products.length));
            dispatch(ProductFilterActions.updateRefinements(data.refinements));
        });
    };
}

module.exports = {
    TYPES,
    changeCategory,
    fetchProducts,
    receiveProducts,
    updateTotalProducts
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/ProductGridActions.js