// Manage cookies.
module.exports = {

    KEYS: {
        SESSIONID: 'JSESSIONID',
        IS_PREVIEW_ENV_COOKIE: 'preview',
        PREVIEW_COOKIE: 'previewdate'
    },

    //temp moved to headerfooter.js remove from headerfooter.js when we are using bTag for analytics
    write: function (name, value, days, top) {
        if (typeof (days) === 'undefined') {
            days = 365;
        }

        this.writeCookieMillis(name, value, days * 86400000, top);
    },

    writeCookieMillis: function (name, value, millis, onTopDomain) {
        if (typeof (onTopDomain) === 'undefined') {
            onTopDomain = false;
        }

        millis || (millis = 0);

        //use encodeURI, decodeURI, encodeURIComponent, and decodeURIComponent
        var cookieStr = escape(name) + '=' + escape(value);

        if (millis !== 0) {
            var now = new Date();
            var then = new Date(now.getTime() + millis);
            var exp = then.toGMTString();
            cookieStr += '; expires=' + exp;
        }

        cookieStr += '; path=/';
        if (onTopDomain) {
            var dom;
            var parts;
            if (isNaN(parseInt(document.domain.replace(/\./g, '')))) {
                parts = document.domain.split('.');
                dom = parts.slice(-2).join('.');
            } else {
                dom = document.domain;
            }

            cookieStr += ';domain=' + dom;
        }

        document.cookie = cookieStr;
        return cookieStr;
    },

    delete: function (key) {
        this.writeCookieMillis(key, null, 0);
    },

    read: function (key) {
        var cookies = ('' + document.cookie).split('; ');
        var i = 0;
        var currentCookie = [];
        var name = '';

        for (i = 0; i < cookies.length; ++i) {
            currentCookie = cookies[i].split('=');
            if (currentCookie.length !== 2) {
                /* eslint no-continue: 0 */
                continue;
            }

            name = window.unescape(currentCookie[0]);

            if (key === name) {
                return window.unescape(currentCookie[1]);
            }
        }

        return null;
    }
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Cookies.js