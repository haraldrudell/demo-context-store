// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var BeautyMatchCheckbox = function () {};

// Added by sephora-jsx-loader.js
BeautyMatchCheckbox.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const Authentication = require('Authentication');
const Actions = require('Actions');
const userUtils = require('utils/User');
const BiProfile = require('utils/BiProfile');
const Filters = require('utils/Filters');
const store = require('store/Store');
const reduxActionWatch = require('redux-action-watch');
const BEAUTY_MATCH_FILTERS = ['hairColor', 'skinTone', 'skinType', 'eyeColor'];

BeautyMatchCheckbox.prototype.hasAllTraits = function () {
    let biInfo = BiProfile.getBiProfileInfo();
    return !!biInfo && BEAUTY_MATCH_FILTERS.every(trait => biInfo[trait]);
};

BeautyMatchCheckbox.prototype.toggleBeautyMatches = function () {
    this.setState({ checked: !this.state.checked }, () => {
        let filters = {};
        if (this.state.checked && this.hasAllTraits()) {
            let biInfo = BiProfile.getBiProfileInfo();
            Object.keys(biInfo).forEach(filterKey => {
                if (BEAUTY_MATCH_FILTERS.indexOf(filterKey) !== -1 &&
                        biInfo[filterKey]) {
                    filters[filterKey] = [biInfo[filterKey]];
                }
            });

            if (this.props.sortBy) {
                filters[Filters.REVIEW_FILTERS_TYPES.SORT] = [this.props.sortBy];
            }
        }

        this.props.onSelect(filters, this.state.checked, this.props.name);
    });
};

BeautyMatchCheckbox.prototype.toggle = function () {
    Authentication.requireAuthentication().then(()=> {
        if (userUtils.isBI()) {
            this.toggleBeautyMatches();
        } else {
            store.dispatch(Actions.showBiRegisterModal(true, () => {
                this.toggleBeautyMatches();
            }));
        }
    });
};

BeautyMatchCheckbox.prototype.ctrlr = function () {

    if (this.props.updateOnAction) {
        /**
         * Reset Checkbox if it doesn't match filters anymore
         */
        reduxActionWatch.actionCreators.onAction(store.dispatch)(
            this.props.updateOnAction,
            (data) => {

                let biInfo = BiProfile.getBiProfileInfo();

                // Ignore sorting
                delete data.filters[Filters.REVIEW_FILTERS_TYPES.SORT];

                let userFilters = 0;
                if (!biInfo) {
                    return;
                }

                BEAUTY_MATCH_FILTERS.forEach(filterKey => {
                    if (biInfo[filterKey]) {
                        userFilters++;
                    }
                });

                let newFilters = Object.keys(data.filters);

                let matchedCount = newFilters.filter(filterKey => {
                    let currentFilter = data.filters[filterKey];
                    return currentFilter.length === 1 &&
                        currentFilter[0] === biInfo[filterKey];
                }).length;

                this.setState({
                    checked: this.hasAllTraits() &&
                        matchedCount === BEAUTY_MATCH_FILTERS.length &&
                        matchedCount === newFilters.length
                });

            });
    }
};


// Added by sephora-jsx-loader.js
module.exports = BeautyMatchCheckbox.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/BeautyMatchCheckbox/BeautyMatchCheckbox.c.js