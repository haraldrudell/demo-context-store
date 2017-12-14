// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var InternationalShippingModal = function () {};

// Added by sephora-jsx-loader.js
InternationalShippingModal.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('store/Store');
const Actions = require('Actions');
const UserActions = require('actions/UserActions');
const Locale = require('utils/LanguageLocale.js');
const LocationUtils = require('utils/Location.js');
const userUtils = require('utils/User.js');
const utilityApi = require('services/api/utility');


InternationalShippingModal.prototype.ctrlr = function () {
    utilityApi.getShippingCountryList().
        then(shippingCountries => this.setState({ shippingCountries }));
};

InternationalShippingModal.prototype.close = function () {
    store.dispatch(Actions.showInternationalShippingModal(false));
};

InternationalShippingModal.prototype.selectCountry = function (country) {
    this.setState({ selectedCountry: country });
};

InternationalShippingModal.prototype.switchCountry = function () {
    let countryCode = this.state.selectedCountry.countryCode;
    if (countryCode !== Locale.COUNTRIES.US &&
            countryCode !== Locale.COUNTRIES.CA) {
        utilityApi.switchShippingCountry(countryCode).
            then(() => {
                userUtils.setShippingCountry(this.state.selectedCountry);
                LocationUtils.reload();
            }).
            catch(() => {
                store.dispatch(Actions.showInternationalShippingModal(false));
            });
    } else {
        store.dispatch(UserActions.switchCountry(countryCode));
    }
};


// Added by sephora-jsx-loader.js
module.exports = InternationalShippingModal.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/InternationalShippingModal/InternationalShippingModal.c.js