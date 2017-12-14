const { site } = require('style');
const UrlUtils = require('utils/Url');
const LocalStorageSearchUtils = require('utils/localStorage/Search');
const wrapForLegacyAction = require('actions/Legacy').wrapForLegacyAction;
const LocationUtils = require('utils/Location.js');
const Location = require('utils/Location');
const Storage = require('utils/localStorage/Storage');
const snbApi = require('services/api/search-n-browse');

const TYPES = {
    CLEAR_SEARCH: 'CLEAR_SEARCH',
    TOGGLE_FIXED_SEARCH: 'TOGGLE_FIXED_SEARCH',
    TOGGLE_SEARCH: 'TOGGLE_SEARCH',
    HIDE_SEARCH: 'HIDE_SEARCH',
    SHOW_PREVIOUS_SEARCH: 'SHOW_PREVIOUS_SEARCH',
    HIDE_SEARCH_RESULTS: 'HIDE_SEARCH_RESULTS',
    SHOW_SEARCH_RESULTS: 'SHOW_SEARCH_RESULTS'
};
const KEYS = LocalStorageSearchUtils.KEYS;

const URLS = {
    SEARCH_URL: '/shop/search?keyword=',
    SEARCH_TYPEAHEAD_URL: '/api/catalog/search?type=typeahead&q=',
    SEARCHPAGE_LEGACY_MOBILE_URL: '/shop/search/',
    SEARCHPAGE_LEGACY_DESKTOP_URL: '/search/search.jsp?keyword='
};

const MAX_SEARCH_SUGGESTIONS_COUNT = 10;

function mapResults(results) {
    return results && results.length ?
        results.map((result) => {
            if (result instanceof Object) {
                let searchResult = result.brandName ? result.brandName + ' - ' : '';
                searchResult += result.productName;
                result.value = (typeof result.term !== 'undefined') ?
                    result.term : searchResult;
            }

            return result;
        }) : [];
}

function showSearchResults(results) {
    return {
        type: TYPES.SHOW_SEARCH_RESULTS,
        results: mapResults(results.slice(0, MAX_SEARCH_SUGGESTIONS_COUNT))
    };
}

function showPreviousSearchResults() {
    let data = Storage.local.getItem(KEYS.STORAGE_PREVIOUS_RESULTS);
    return {
        type: TYPES.SHOW_PREVIOUS_SEARCH,
        results: data ? mapResults(data.slice(0, KEYS.MAX_PREVIOUS_RESULTS_COUNT)) : []
    };
}

function isNoInlineSearch() {
    return LocationUtils.isCustomSets();
}

module.exports = {
    TYPES: TYPES,

    URLS: URLS,

    STORAGE_KEYS: {
        STORAGE_PREVIOUS_RESULTS: KEYS.STORAGE_PREVIOUS_RESULTS
    },

    clearSearch: function () {
        return {
            type: TYPES.CLEAR_SEARCH,
            focus: true
        };
    },

    toggleSearch: wrapForLegacyAction(
        Sephora.legacy && Sephora.legacy.SearchActions ?
            Sephora.legacy.SearchActions.toggleSearch :
            null,
        function (focus) {
            return {
                type: window.scrollY > site.HEADER_HEIGHT_MW || isNoInlineSearch() ?
                    TYPES.TOGGLE_FIXED_SEARCH : TYPES.TOGGLE_SEARCH,
                focus: typeof(focus) === 'boolean' ? focus : undefined
            };
        }
    ),

    hideSearch: function () {
        return {
            type: window.scrollY > site.HEADER_HEIGHT_MW ||
            isNoInlineSearch() || Location.isProductReviewsPage() ?
                TYPES.HIDE_SEARCH : TYPES.HIDE_SEARCH_RESULTS
        };
    },

    showPreviousSearchResults: showPreviousSearchResults,

    getSearchResults: function (keyword) {
        if (keyword && keyword.length) {
            /* show search suggestions only for keyword more then N characters long */
            if (keyword.length < KEYS.MIN_KEYWORD_LENGTH_FOR_SUGGESTIONS) {
                return showSearchResults([]);
            } else {
                return (dispatch) => {
                    return snbApi.searchTypeAhead(keyword).
                        then(data => dispatch(showSearchResults(data.typeAheadTerms))).
                        catch(() => dispatch(showSearchResults([])));
                };
            }
        } else {
            return showPreviousSearchResults();
        }
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/SearchActions.js