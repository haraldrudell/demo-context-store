'use strict';
const urlUtils = require('utils/Url');
const ReactDOM = require('react-dom');

const UI = {
    toggleMain: function () {
        if (Sephora.isMobile()) {
            var main = document.getElementById('main');
            main.classList.toggle('active');
            main.classList.toggle('in');
        }
    },

    swatchSize: function (product) {
        let size = {};
        switch (product.swatchType) {
            case 'Image - 36':
                size.width = 36;
                size.height = 36;
                break;
            case 'Image - 42':
                size.width = 42;
                size.height = 42;
                break;
            case 'Image - 62':
                size.width = 62;
                size.height = 62;
                break;
            case 'Image - Rectangle':
                size.width = 72;
                size.height = 36;
                break;
            default:
        }
        return size;
    },

    /**
     * Lock the body once your element needs it,
     * and unlock it right after its closed
     */
    preventBackgroundScroll: function (elementIsOpen) {
        if (!Sephora.isRootRender) {
            if (elementIsOpen && document.body.style.overflowY !== 'hidden') {
                document.body.style.overflowY = 'hidden';
            } else if (!elementIsOpen && document.body.style.overflowY === 'hidden') {
                document.body.style.overflowY = 'auto';
            }
        }
    },

    lockBackgroundPosition: function () {
        if (document.body.style.position !== 'fixed') {
            let offset = document.body.scrollTop;
            Object.assign(document.body.style, {
                position: 'fixed',
                left: 0,
                right: 0,
                top: (offset * -1) + 'px'
            });
        }
    },

    unlockBackgroundPosition: function () {
        if (document.body.style.position === 'fixed') {
            let scrollPosition = parseInt(document.body.style.top, 10) * -1;
            Object.assign(document.body.style, {
                position: '',
                left: '',
                right: ''
            });
            document.body.scrollTop = scrollPosition;
        }
    },

    getRetinaSrcSet: function (src) {
        if (src) {
            const ext = src.substring(src.lastIndexOf('.') + 1);
            const src2x = src.replace('.' + ext, '@2x.' + ext);
            return urlUtils.getImagePath(src) + ' 1x, ' +
                urlUtils.getImagePath(src2x) + ' 2x';
        } else {
            return null;
        }
    },

    scrollToTop: function () {
        // Cross-browser support: document.documentElement for Mozilla
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },

    scrollElementToTop: function (element) {
        element.scrollTop = 0;
    },

    observeElement: function (callback) {
        return new MutationObserver(callback);
    },

    hasHorizontalScrollBar: function (component) {
        const element = ReactDOM.findDOMNode(component);
        return element ? element.scrollWidth > element.clientWidth : false;
    },

    isSupportsLineClamp: function () {
        if (!Sephora.isRootRender) {
            return 'WebkitLineClamp' in document.documentElement.style;
        }
        return false;
    },

    detectIEVersion: function () {
        if (Sephora.isRootRender) {
            return false;
        }
        let userAgent = window && window.navigator && window.navigator.userAgent;
        if (!userAgent) {
            return false;
        }
        let msie = userAgent.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(userAgent.substring(msie + 5, userAgent.indexOf('.', msie)), 10);
        }
        let trident = userAgent.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            let rv = userAgent.indexOf('rv:');
            return parseInt(userAgent.substring(rv + 3, userAgent.indexOf('.', rv)), 10);
        }
        let edge = userAgent.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(userAgent.substring(edge + 5, userAgent.indexOf('.', edge)), 10);
        }
        // other browser
        return false;
    },

    refreshStuckUIRender: function () {
        if (!Sephora.isRootRender && this.isIOS()) {
            let element = document.body;
            element.scrollTop++;
            element.scrollTop--;
        }
    },

    isIOS: function () {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    }

};

module.exports = UI;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/UI.js