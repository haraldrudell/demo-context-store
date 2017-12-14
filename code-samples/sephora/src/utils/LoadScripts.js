'use strict';

// TODO: Change this to export an object rather than a function to facilitate stubbing
module.exports = (list, callback) => {
    const waiting = list.slice();

    const loaded = [];

    const done = (src) => {
        loaded.push(src);

        if (callback && (loaded.length === list.length)) {
            callback();
        }
    };

    const load = (src) => {
        const script = document.createElement('script');

        script.src = src;

        script.onload = () => {
            done(src);

            if (waiting.length) {
                load(waiting.shift());
            }
        };

        const firstScript = document.getElementsByTagName('script')[0];

        firstScript.parentNode.insertBefore(script, firstScript);
    };

    load(waiting.shift());
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/LoadScripts.js