var Events = require('utils/framework/Events'),
    frameworkActions = require('actions/FrameworkActions'),
    InflatorComps = require('utils/framework/InflateComponents'),
    store = require('store/Store'),
    urlUtils = require('utils/Url'),
    watch = require('redux-watch'),
    Perf = require('utils/framework/Perf');

// Anything that would normally go into DOMContentLoaded related to
// components functionality should be placed here.
Events.onLastLoadEvent(window, ['DOMContentLoaded'], function () {

    /** Reposition header on mobile when scrolling **/
    if (Sephora.isMobile()) {
        let headerPosition = '',
            header = document.querySelector('#HeaderMain'),
            initialOffset = header.offsetParent.offsetTop;

        const updateHeaderPosition = function(newPosition) {
            if (newPosition !== headerPosition) {
                header.style.position = newPosition;
            }
        };
        const checkHeaderPosition = function() {
            let position = (window.scrollY > initialOffset) ? 'fixed' : 'absolute';
            updateHeaderPosition(position);
        };

        let searchWatch = watch(store.getState, 'search');
        store.subscribe(searchWatch((newVal) => {
            if (newVal.isFixed) {
                header.style.top = window.scrollY;
            }
        }));

        checkHeaderPosition();
        window.addEventListener(Events.DebouncedScroll, checkHeaderPosition);
    }

    // Add all url params to the store
    let queryParams = urlUtils.getParams();
    store.dispatch(frameworkActions.updateQueryParams(queryParams));
});

// The Immediate event fires once all priority code is loaded but prior to any third party or api
// dependencies.  Immediate should be used for components that need to potentially re-render ASAP
// based on information that is available in the initial page load but which might not be correct
// in the initial server-side render.
//
// The prime example of this is product pages, which render on the server (and cached by akamai)
// generically by product id, but which display differently depending on the skuId url parameter.
InflatorComps.services.loadEvents.ImmediateReady = true;
window.dispatchEvent(new CustomEvent(Events.ImmediateReady, { detail: {} }));
Perf.report('Immediate Ready');

InflatorComps.renderQueue(Events.Immediate);



// WEBPACK FOOTER //
// ./public_ufe/js/utils/framework/PriorityLoaded.js