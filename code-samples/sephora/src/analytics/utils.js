/**
 * Analytics Utility Functions *
 *
 * This module is a property of Sephora.analytics.
 *
 * Dependencies: DataLayer.js
 */
module.exports = (function () {
    var deepExtend = require('deep-extend');
    var cookieUtils = require('utils/Cookies');
    const Locale = require('utils/LanguageLocale.js');
    const skuUtils = require('utils/Sku');
    const analyticsConsts = require('analytics/constants');

    var methods = {

        /**
         * Some values should only be added if certain conditons are met when the
         * next page loads. This function takes a value, runs the appropriate tests
         * and returns true if that value should be added.
         * @param  {object} - sourceObj The original object to add verified data to
         * @param {object} - dataToCheck An object containing values that will be added
         * if tests are passed.
         * @return {object} The potentially altered sourceObj that was passed in.
         */
        addIfConditionsMet: function (sourceObj, dataToCheck) {
            var profileInfo = window.digitalData.user[0].profile[0].profileInfo;
            var events = dataToCheck.events;

            if (events && Array.isArray(events)) {
                for (let i = 0; i < events.length; i += 1) {
                    let currentEvent = events[i].trim();

                    //Add events object if it didn't already exist
                    sourceObj.events = sourceObj.events || [];

                    //Email opt-in
                    if (currentEvent === 'event6' && profileInfo.biType !== 'non-bi') {
                        /* TODO: I'm waiting on BE Team to expose something like
                        ** Sephora.User.emailOptIn so I can check this
                        ** For now I'm just going to say yes if user is now bi */
                        sourceObj.events.push(currentEvent);
                    }

                    //Bi Opt-in
                    if (currentEvent === 'event11' && profileInfo.biType !== 'non-bi') {
                        sourceObj.events.push(currentEvent);
                    }

                    //Captcha was present
                    if (currentEvent === 'event39' && profileInfo.signInStatus === 'signed in') {
                        sourceObj.events.push(currentEvent);
                    }
                }
            }

            return sourceObj;
        },

        /**
        * Create a new item using the W3C blue print at the specified location.
        * @param  {string} location - Name of the array at which to add the new item
        * @param  {string} objToMerge - An object with values to merge into the new item
        * @return {*} - A reference to the newly created object
        * Note: This is currently only tested on adding new items to arrays. Consider
        * whether or not to create a new func for other situations.
        */
        addNewItemFromSpec: function (location, objToMerge) {
            var newArrayLength;
            var newItem;
            var newItemDestination = window.digitalData[location];
            var specModel = {
                event: {
                    eventInfo: {
                        eventName: '',
                        eventAction: '',
                        type: '',
                        timeStamp: new Date(),
                        attributes: {
                            eventStrings: [],
                            productStrings: []
                        }
                    }
                }
            };

            newArrayLength = newItemDestination.push(specModel[location]);
            newItem = newItemDestination[newArrayLength - 1];

            if (objToMerge) {
                deepExtend(newItem, objToMerge);
            }

            return newItem;
        },

        arrayItemsToLowerCase: function (arr) {
            let len = arr.length;
            let tempArray = [];

            for (let i = 0; i < len; i++) {
                if (typeof arr[i] === 'string') {
                    tempArray[i] = arr[i].toLowerCase();
                }
            }

            Object.assign(arr, tempArray);
        },

        /**
         * Builds a 5 item long, colon separated string, repeating the last item if needed
         * @param  {array} strings The strings to use to build the path
         * @return {string}
         */
        buildNavPath: function (strings) {
            var path = [];
            var currentString;

            for (let i = 0; i < 5; i += 1) {
                if (strings[i]) {
                    currentString = strings[i];
                }

                path[i] = currentString;
            }

            return path.join(':').toLowerCase();
        },

        /**
         * Takes a name that could come from anywhere and returns the
         * name that the reporting team wants to see for that page, module, etc.
         * @param  {string} name - The name to be converted.
         * @return {string} - The converted name if there was one, or the original argument.
         */
        convertName: function (name) {
            var map;

            map = {
                homepage: analyticsConsts.PAGE_NAMES.HOMEPAGE,
                basketpage: analyticsConsts.PAGE_NAMES.BASKET,
                lists: analyticsConsts.PAGE_NAMES.LISTS_MAIN,
                profile: analyticsConsts.PAGE_NAMES.PROFILE,
                beautyinsider: 'my beauty insider:benefits'
            };

            switch (name){
                case 'contentstore':
                    name = this.convertNameFromMediaID();
                    break;
                default:
            }

            return (map[name] || name);
        },

        /**
         * Returns the name for content store pages mapped with media id
         * @returns {string} - Page Name for mediaId
         */
        convertNameFromMediaID: function () {
            let map = {
                11000020: 'weekly specials'
            };

            return map[Sephora.analytics.backendData.mediaId];
        },

        /**
         * Takes a type that could come from anywhere and returns the
         * name that the reporting team wants to see for that page, module, etc.
         * @param  {string} type - The type to be converted.
         * @return {string} - The converted type if there was one, or the original argument.
         */
        convertType: function (type) {
            let map;

            map = {
                homepage: analyticsConsts.PAGE_TYPES.HOMEPAGE,
                basketpage: analyticsConsts.PAGE_TYPES.BASKET,
                richprofile: analyticsConsts.PAGE_TYPES.USER_PROFILE,
                bihq: analyticsConsts.PAGE_TYPES.USER_PROFILE
            };

            return (map[type] || type);
        },

        convertAdditionalInfo: (info) => {
            let map = {
                orders: 'recent-orders',
                addresses: 'saved-addresses',
                paymentmethods: 'payments-gift-cards',
                emailpostal: 'email-postal-preferences'
            };

            return (map[info] || info);
        },

        /**
         * @param {bool} clear - Whether or not we should delete the item after reading it.
         * @return {object} - The object stored in the cookie or null.
         */
        getPreviousPageData: function (clear) {
            var data = {};

            /* Protect against data that is not formatted as JSON */
            try {
                data = JSON.parse(cookieUtils.read('anaNextPageData'));

                //Data must always be an object
                if (typeof data !== 'object' || data === null) {
                    data = {};
                }

                if (data && data.conditionals) {
                    for (let i = 0; i < data.conditionals.length; i += 1) {
                        data = this.addIfConditionsMet(data, data.conditionals[i]);
                    }
                }
            } catch (e) {
                console.log('anaNextPageData was probably not formatted correctly.');
            }

            /**
             * Some of legacy pages uses this cookie to set previous page name
             * instead of using anaNextPageData object.
             * TODO: remove this workaround when legacy FS is refactored to use the same object
             * with the SAME DOMAIN
             */
            let prevPageName = cookieUtils.read('pPage');
            if (prevPageName) {
                data = data || {};
                data.pageName = prevPageName;
            }

            if (clear) {
                cookieUtils.delete('anaNextPageData');
                if (Sephora.isMobile()) {
                    cookieUtils.delete('pPage');
                }
            }

            return data;
        },

        /**
         * Use the event name to find the most recent of that type
         * @param  {string} eventName The name of the event to look for
         * @param {object} attributes Optional if need to find more specific event by extra data
         * attributes of event as a key for lookup
         * @return {object}           The most recent event object with that event name
         */
        getMostRecentEvent: function (eventName, attributes = {}) {
            function eventAttributesMatch(eventAttributes, matchAttributes) {
                for (let matchAttr in matchAttributes) {
                    if (matchAttributes.hasOwnProperty(matchAttr) &&
                        matchAttributes[matchAttr] !== eventAttributes[matchAttr]) {
                        return false;
                    }
                }
                return true;
            }
            if (window && window.digitalData && window.digitalData.event) {
                //Start at the end
                var i = window.digitalData.event.length - 1;
                var savedFallback = '';

                while (i !== -1) {
                    var eventInfo = window.digitalData.event[i].eventInfo;

                    if (eventInfo.attributes.specificEventName === eventName &&
                    eventAttributesMatch(eventInfo.attributes, attributes)) {
                        return window.digitalData.event[i];
                    } else if (!savedFallback && eventInfo.eventName === eventName &&
                        eventAttributesMatch(eventInfo.attributes, attributes)) {
                        savedFallback = window.digitalData.event[i];
                    }

                    i -= 1;
                }

                //If we haven't already returned by now
                return savedFallback;
            } else {
                return {};
            }
        },

        /**
         * Get the desired property from most recent event based on the parameters sent from Signal.
         * This is important as it greatly reduces the amount of code that we need in Signal.
         * @param  {Object} opts An object that may contain a specific event name, or prop name.
         * @return {*} The value of the property that we need. This will usually be a string, but
         *             could be an array or object.
         * Note: opts.pathToProperty will be a string. Ex. 'eventInfo.attributes.actionInfo'
         */
        getMostRecentEventProperty: function (opts = {}) {
            let eventName = this.safelyReadProperty('eventObject.detail.specificEventName', opts) ||
                opts.fallBackEventName;

            return this.safelyReadProperty(opts.pathToProperty, this.getMostRecentEvent(eventName));
        },

        /**
         * Fire an event and send data to the Tag Management System
         * @param  {string} eventName - The name of the event that the TMS is listening for.
         * @param  {*} eventData - Any data that needs to be sent along to the TMS event handler.
         */
        fireEventForTagManager: function (eventName, eventData = {}) {
            var event = new CustomEvent(eventName, eventData);

            window.dispatchEvent(event);
        },

        /**
        * Get the value of a query parameter.
        * @param  {string} name - The query parameter name.
        * @param  {string} href - The string to look in.
        * @return {string}      - The value of the found parameter or empty string.
        */
        getQueryParam: function (param, href) {
            try {
                var result = '';

                href = href || location.href;

                if (href.indexOf('%20&%20') > 0) {
                    href = href.replace('%20&%20', 'ampersand');
                }

                param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                result = new RegExp('[\\?&]' + param + '=([^&#]*)').exec(href);
                return result === null ? '' : param === 'om_mmc' ?
                    decodeURIComponent(result[1])
                    : decodeURIComponent(result[1].replace(/\+/g, ' '));
            } catch (e) {
                console.log('There was a problem with the getQueryParam function.');
            }

            return '';
        },

        /**
         * Remove any undefined items from an object
         * @param  {object / array} originalObj The original object or array
         * @return {object / array} The array with no undefined items
         */
        removeUndefinedItems: function (originalObj) {
            let isArray = Array.isArray(originalObj);

            if (isArray) {
                for (let i = 0, l = originalObj.length; i < l; i++) {
                    if (originalObj[i] === undefined) {
                        originalObj.splice(i, 1);
                    }
                }
            } else if (originalObj) {
                Object.keys(originalObj).forEach(key => {
                    if (originalObj[key] === undefined) {
                        delete originalObj[key];
                    }
                });
            }

            return originalObj;
        },

        /**
        * @param  {array or string} path - Path to the desired value
        * @param  {obj} start - Optional object with which to start looking up properties on
        * @return {*} - Whatever value is stored in the desired property or ''.
        */
        safelyReadProperty: function (pathToProperty = [], start = window) {
            let currentLocation = start;

            pathToProperty = (typeof pathToProperty === 'string') ?
                pathToProperty.split('.') : pathToProperty;

            for (let currentProp of pathToProperty) {
                if (typeof currentLocation[currentProp] !== 'undefined') {
                    currentLocation = currentLocation[currentProp];
                } else {
                    return '';
                }
            }

            return currentLocation;
        },

        /**
         * Save data into a cookie that gets read on every page load.
         * Data objects keys of prop[n], eVar[n] or event strings have
         * their values added to Adobe's global s object before the next tag fires.
         * @param  {object} data - The key value pairs that will be saved.
         */
        setNextPageData: function (data) {
            var existingData = this.getPreviousPageData();
            var mergedData;
            var key;

            try {
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }

                mergedData = data;

                if (existingData) {
                    for (key in data) { //Merge existing data with this data
                        if (key === 'events' && Array.isArray(existingData[key])) {
                            existingData[key] = existingData[key].concat(data[key]);
                        } else {
                            existingData[key] = data[key];
                        }
                    }

                    mergedData = existingData;
                }

                data = JSON.stringify(mergedData);
            } catch (e) {
                console.log('There was a problem with setNextPageData');
            }

            cookieUtils.write('anaNextPageData', data);
            /* set previous pageName for legacy pages */
            if (mergedData && mergedData.pageName && Sephora.isMobile()) {
                cookieUtils.write('pPage', mergedData.pageName);
            }
        },

        //Build the product string for 1 product.
        buildSingleProductString: function (sku = {}) {
            let events = '';

            if (sku.type === skuUtils.skuTypes.SAMPLE) {
                events += 'event17=1';
            }

            return ';' + sku.skuId + ';;;' + events + ';eVar26=' + sku.skuId;
        },

        /**
         * Builds the products string
         * @param  {Array} products - An array of products
         * @returns {String} The built products string
         */
        buildProductStrings: function (products = []) {
            const productStrings = products.map(product => {
                let sku = product.currentSku || product.sku;

                return !!sku ? this.buildSingleProductString(sku) : '';
            });

            return productStrings.join(',');
        },

        /**
        * Take a price and use Signal's currency converter to convert to USD.
        * @param  {string} price - The original price.
        * @return {string} - The (potentially converted) price.
        */
        convertToUSD: function (price) {
            // Using local require due to circular depedency
            const userUtils = require('utils/User.js');

            let currency = Locale.ISO_CURRENCY[userUtils.getShippingCountry().countryCode];

            if (currency !== 'USD') {
                if (typeof this.safelyReadProperty('BrightTag.Currency.convert') === 'function') {
                    price = window.BrightTag.Currency.convert(price, currency, 'USD');
                }
            }

            return price;
        },

        getDoubleClickCategory(pixel) {
            switch (pixel) {
                case 'footer':
                    return Sephora.isDesktop() ? 'deskt0' : 'mobil0';
                case 'basket':
                    return Sephora.isDesktop() ? 'deskt000' : 'mobil000';
                default:
                    return '';
            }
        },

        /**
         * In an attempt to keep the digitalData object as slim as possible, this method
         * allows us to create and populate properties on digitalData ONLY if the value exists.
         * @param {Obejct} baseObj     The base object that will get the new property.
         * @param {string} newProp     The key of the property that we are going to set.
         * @param {*} value            The value of the property that we will set.
         */
        setIfPresent(baseObj, newProp, value = null) {
            if (value) {
                baseObj[newProp] = value;
            }
        }

    };//End Methods

    return methods;
}());//End utilities export



// WEBPACK FOOTER //
// ./public_ufe/js/analytics/utils.js