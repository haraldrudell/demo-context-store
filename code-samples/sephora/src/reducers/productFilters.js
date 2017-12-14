var update = require('react-addons-update');

const PRODUCT_FILTER_ACTION_TYPES = require('../actions/ProductFilterActions').TYPES;

const initialState = {
	refinements: [],
	filters: [],
	isFiltered: false,
	showFilters: false
};

const ProductFilters = (state = initialState, action) => {
	switch (action.type) {
		case PRODUCT_FILTER_ACTION_TYPES.ADD_FILTER:
			return update(state, {
				filters: {$push: [action.filter]},
				isFiltered: {$set: true}
			});
		case PRODUCT_FILTER_ACTION_TYPES.REMOVE_FILTER:
			return update(state, {
				filters: {$splice: [[state.filters.indexOf(action.filter), 1]]},
				isFiltered: {$set: (state.filters.length !== 0)}
			});
		case PRODUCT_FILTER_ACTION_TYPES.UPDATE_FILTERS:
			return update(state, {
				filters: {$set: action.filters},
				isFiltered: {$set: (action.filters.length !== 0)}
			});
		case PRODUCT_FILTER_ACTION_TYPES.UPDATE_REFINEMENTS:
			return update(state, {
				refinements: {$set: action.refinements}
			});
		case PRODUCT_FILTER_ACTION_TYPES.SHOW_FILTERS:
			return update(state, {
				showFilters: {$set: action.showFilters}
			});
		default:
			return state;
	}
};

module.exports = ProductFilters;


// WEBPACK FOOTER //
// ./public_ufe/js/reducers/productFilters.js