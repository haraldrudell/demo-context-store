// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var SiteSearch = function () {};

// Added by sephora-jsx-loader.js
SiteSearch.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const watch = require('redux-watch');
const store = require('Store');
const Location = require('utils/Location');
const actions = require('actions/Actions');
const searchActions = require('actions/SearchActions');
const Debounce = require('utils/Debounce').debounce;
const JStorage = require('utils/localStorage/Search');
const UrlUtils = require('utils/Url');
const INPUT_SELECTOR = '[name="keyword"]';
const DEBOUNCE_KEYUP = 300;
const DEBOUNCE_BLUR = 200;
const SEARCH_SELECTION_TYPES = {
    MANUAL: 'manual',
    TYPEAHEAD: 'type-ahead'
};
const SEARCH_TYPE_KEY = 'prevSearchType';
const SEARCH_TERM_KEY = 'searchTerm';
const LEGACY_JSTORAGE_SEARCHTYPE = 'searchType';
const analyticsUtils = require('analytics/utils');

// TODO: Reimplement this code with debounced scroll
// SiteSearch.prototype.handleScroll = function () {
//     var el = ReactDOM.findDOMNode(this);
//     this.setState({
//         isTooltipVisible: window.scrollY <= (el && el.offsetTop &&
//         (el.offsetTop > site.HEADER_HEIGHT_MW) ?
//             (el.offsetTop - site.HEADER_HEIGHT_MW) : 0)
//     });
// };

SiteSearch.prototype.ctrlr = function () {
    const searchWatch = watch(store.getState, 'search');

    store.subscribe(searchWatch((newVal) => {
        this.setState({
            focus: newVal.focus,
            results: newVal.results,
            isFixed: newVal.isFixed,
            inline: newVal.inline
        }, () => {
            if (newVal.focus && this.textInput) {
                this.textInput.getDOMNode()
                    .querySelector(INPUT_SELECTOR).focus();
            }
        });
    }));
    
    // Handle initial scroll position on load
    // this.handleScroll();
};

SiteSearch.prototype.handleCancelClick = function (e) {
    if (this.state.isFixed) {
        store.dispatch(searchActions.toggleSearch());
    } else {
        Debounce(SiteSearch.prototype.handleBackdropClick, DEBOUNCE_BLUR)();
    }
};

SiteSearch.prototype.handleFocus = function () {
    store.dispatch(searchActions.getSearchResults(this.textInput.getValue()));
};

SiteSearch.prototype.keyUp = function () {
    store.dispatch(searchActions.getSearchResults(this.textInput.getValue()));
};

SiteSearch.prototype.handleKeyUp = Debounce(SiteSearch.prototype.keyUp, DEBOUNCE_KEYUP);

SiteSearch.prototype.blur = function (e) {
    if (Sephora.isDesktop()) {
        store.dispatch(searchActions.hideSearch());
    }
};

SiteSearch.prototype.handleBlur = Debounce(SiteSearch.prototype.blur, DEBOUNCE_BLUR);

SiteSearch.prototype.handleBackdropClick = function (e) {
    store.dispatch(searchActions.hideSearch());
};

SiteSearch.prototype.handleClearClick = function (e) {
    e.preventDefault();
    this.textInput.setValue('');
    this.handleFocus();
};

function storeSearchDataForAnalytics(type, product) {
    if (Sephora.isMobile()) {
        require('utils/localStorage/LegacyMW').setLegacyJStorageItem(LEGACY_JSTORAGE_SEARCHTYPE, type);
    } else {
        //Store for Legacy
        sessionStorage.setItem(SEARCH_TYPE_KEY, type);
    }

    //Store for UFE
    let searchData = {};
    searchData[SEARCH_TYPE_KEY] = type;
    searchData[SEARCH_TERM_KEY] = product.term || product.value;
    analyticsUtils.setNextPageData(searchData);
}

SiteSearch.prototype.handleSubmit = function (e) {
    e.preventDefault();
    let keyword = this.textInput.getValue().trim();
    if (keyword === '') {
        return;
    }

    //type ahead search is used if results is 1 and
    //that result isn't a previousSearchItem
    if (this.state.results &&
        this.state.results.length === 1 &&
        !JStorage.isPreviousSearchItem(this.state.results[0].term || '')) {
        storeSearchDataForAnalytics(SEARCH_SELECTION_TYPES.TYPEAHEAD, this.state.results[0]);
        this.processSubmit(this.state.results[0], keyword);
    } else {
        let product = { term: this.textInput.getValue() };
        storeSearchDataForAnalytics(SEARCH_SELECTION_TYPES.MANUAL, product);
        this.processSubmit(product, keyword);
    }

};
/**
 * This was isolated for testing proposes
*/
SiteSearch.prototype.processSubmit = function (product, keyword) {
    if (product.productId) {
        let url = '/product/' + product.productId;
        if (keyword) {
            url += '?keyword=' + keyword;
        }
        JStorage.setSearchTermStorageItem(product.value);
        Location.setLocation(url);
    } else {
        JStorage.setSearchTermStorageItem(product.term);
        UrlUtils.redirectTo(searchActions.URLS.SEARCH_URL + encodeURIComponent(product.term));
    }
};

SiteSearch.prototype.handleItemClick = function (e, product) {
    e.preventDefault();
    storeSearchDataForAnalytics(SEARCH_SELECTION_TYPES.TYPEAHEAD, product);
    this.processSubmit(product);
};

/**
 * Highlight part of the string in search results list,
 * if it's presented.
 */
SiteSearch.prototype.highlight = function (string, substring) {
    if (substring) {
        let reg = new RegExp(substring, 'gi');
        return string.replace(reg, function (str) {
            return '<b>' + str + '</b>';
        });
    } else {
        return string;
    }
};


// Added by sephora-jsx-loader.js
module.exports = SiteSearch.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/SiteSearch/SiteSearch.c.js