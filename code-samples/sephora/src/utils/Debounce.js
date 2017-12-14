const Debounce = {
    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * delay ms
     * @param fn
     * @param delay
     * @returns {Function}
     */
    debounce: function (fn, delay) {
        var timer = null;
        return function () {
            var _this = this;
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(_this, args);
            }, delay);
        };
    },
    /**
     * The point of throttle function pretty much the same,
     * The main difference is that debounce function wait, and then call,
     * but throttle function call, and then wait.
     * So, throttle function is a best option to prevent occasional
     * double-click events and any events that supposed to be executed
     * only once at a time (threshhold).
     * @param fn
     * @param threshhold
     * @returns {Function}
     */
    throttle: function (fn, threshhold) {
        var last;
        var deferTimer;
        return function () {
            var _this = this;
            var now = +new Date();
            var args = arguments;
            if (last && now < last + threshhold) {
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                }, threshhold);
            } else {
                last = now;
                fn.apply(_this, args);
            }
        };
    }
};

module.exports = Debounce;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Debounce.js