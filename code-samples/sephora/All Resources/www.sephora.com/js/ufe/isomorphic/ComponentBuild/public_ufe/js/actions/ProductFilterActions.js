const TYPES = {
	ADD_FILTER: 'PRODUCT_FILTER.ADD_FILTER',
	REMOVE_FILTER: 'PRODUCT_FILTER.REMOVE_FILTER',
	UPDATE_REFINEMENTS: 'PRODUCT_FILTER.UPDATE_REFINEMENTS',
	UPDATE_FILTERS: 'PRODUCT_FILTER.UPDATE_FILTERS',
	SHOW_FILTERS: 'PRODUCT_FILTER.SHOW_FILTERS'
};

function updateFilters(filters) {
	return {
		type: TYPES.UPDATE_FILTERS,
		filters: filters
	};
}

function updateRefinements(refinements) {
	return {
		type: TYPES.UPDATE_REFINEMENTS,
		refinements: refinements
	};
}

function addFilter(filter) {
	return {
		type: TYPES.ADD_FILTER,
		filter: filter.toString()
	};
}

function removeFilter(filter) {
	return {
		type: TYPES.REMOVE_FILTER,
		filter: filter.toString()
	};
}

function showFilters(isOpen) {
	return {
		type: TYPES.SHOW_FILTERS,
		showFilters: isOpen
	};
}

module.exports = {
	TYPES: TYPES,
	updateFilters: updateFilters,
	updateRefinements: updateRefinements,
	addFilter: addFilter,
	removeFilter: removeFilter,
	showFilters: showFilters
};


// WEBPACK FOOTER //
// ./public_ufe/js/actions/ProductFilterActions.js