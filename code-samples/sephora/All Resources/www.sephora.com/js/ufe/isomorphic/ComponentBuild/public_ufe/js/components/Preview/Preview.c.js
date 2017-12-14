// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var Preview = function () {};

// Added by sephora-jsx-loader.js
Preview.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const utilityApi = require('services/api/utility');
const CookieUtils = require('utils/Cookies');
const Location = require('utils/Location');

const FORMAT_DATE = /(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2})/;

/**
 * current datetime in ISO
 * b/c ios safari is the new IE6
 * non-standard printf 2000-01-01T00:00:00
 */
function generateIOS7Date() {
    let d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() < 10) ? '0' +
            (d.getMonth() + 1) : d.getMonth() + 1}` +
        `-${(d.getDate() < 10) ? '0' + (d.getDate()) : d.getDate()}T` +
    `${(d.getHours() < 10) ? '0' + (d.getHours()) : d.getHours()}:00:00`;
}

function formatDate(dateString) {
    let result = FORMAT_DATE.exec(dateString).map(Number);
    let d = new Date();
    d.setFullYear(result[1]);
    d.setMonth(result[2] - 1, result[3]);
    d.setHours(result[4]);
    d.setMinutes(result[5]);
    d.setSeconds(0);
    return `${(d.getMonth() < 10) ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}/` +
    `${(d.getDate() < 10) ? '0' + (d.getDate()) : d.getDate()}/` +
    `${d.getFullYear()} ${(d.getHours() < 10) ? '0' + (d.getHours()) : d.getHours()}:` +
    `${(d.getMinutes() < 10) ? '0' + (d.getMinutes()) : d.getMinutes()}:` +
    `${(d.getSeconds() < 10) ? '0' + (d.getSeconds()) : d.getSeconds()}`;
}

Preview.prototype.ctrlr = function () {
    let shouldSeePreview = !Location.isCheckout() && !Location.isPreview() &&
        CookieUtils.read(CookieUtils.KEYS.IS_PREVIEW_ENV_COOKIE);
    // for legacy mode there is old preview shown
    shouldSeePreview = shouldSeePreview && !Sephora.isLegacyMode;
    this.setState({
        shouldSeePreview: shouldSeePreview
    }, () => {
        if (this.state.shouldSeePreview) {
            let selectedDate = CookieUtils.read(CookieUtils.KEYS.PREVIEW_COOKIE);
            this.date.setValue(selectedDate ? selectedDate : generateIOS7Date());
        }
    });
};

Preview.prototype.setPreview = function () {
    let date = this.date.getValue(true);
    if (date.toString() !== 'Invalid Date') {
        utilityApi.updatePreviewSettings({
            previewDate: formatDate(date),
            activeStatusCheck: this.state.assets,
            viewOOSAsInStock: this.state.oosItems
        }).then(data => {
            if (data.profileStatus > -1 && data.profileLocale) {
                this.setState({
                    message: 'Preview options set.'
                });
                CookieUtils.write(CookieUtils.KEYS.PREVIEW_COOKIE, date, 0);
                if (Location.isPreview()) {
                    CookieUtils.write(CookieUtils.KEYS.IS_PREVIEW_ENV_COOKIE, true);
                    Location.setLocation('/');
                } else {
                    Location.reload();
                }
            } else {
                this.setState({
                    message: 'An error occured.'
                });
            }
        }).catch(() => this.setState({ message: 'An error occured.' }));
    } else {
        this.setState({ message: 'Invalid Date - please change value' });
    }
};


// Added by sephora-jsx-loader.js
module.exports = Preview.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Preview/Preview.c.js