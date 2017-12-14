const ACTION_TYPES = require('../actions/Actions').TYPES;
const PRODUCT_GRID_ACTION_TYPES = require('../actions/ProductGridActions').TYPES;

const initialState = {
	currentPage: 0,
	products: [],
	categoryId: '',
	totalProducts: 0
};

const productGrid = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPES.LOAD_MORE_PRODUCTS:
			return Object.assign({}, state, {
				currentPage: state.currentPage + 1,
				products: state.products.concat(action.products)
			});
		case PRODUCT_GRID_ACTION_TYPES.CHANGE_CATEGORY:
			return Object.assign({}, state, {
				categoryId: action.categoryId
			});
		case PRODUCT_GRID_ACTION_TYPES.RECEIVE_PRODUCTS:
			return Object.assign({}, state, {
				products: action.products
			});
		case PRODUCT_GRID_ACTION_TYPES.UPDATE_TOTAL_PRODUCTS:
			return Object.assign({}, state, {
				totalProducts: action.totalProducts
			});
		default:
			return state;
	}
};

module.exports = productGrid;


// WEBPACK FOOTER //
// ./public_ufe/js/reducers/productGrid.js