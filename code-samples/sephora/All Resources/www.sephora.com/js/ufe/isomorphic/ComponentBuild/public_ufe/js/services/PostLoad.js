const basketActions = require('actions/BasketActions');
const inlineBasketActions = require('actions/InlineBasketActions');
const store = require('Store');

module.exports = (function () {
    const InflatorComps = require('utils/framework/InflateComponents');
    const Events = require('utils/framework/Events');
    const servicesUtils = require('utils/Services');
    const shouldServiceRun = servicesUtils.shouldServiceRun;
    const TIMEOUT = servicesUtils.POST_LOAD_TIMEOUT;
    const Perf = require('utils/framework/Perf');

    require.ensure([], function (require) {
        let postLoadFired = false;

        let handleExternallyTriggeredEvents = function () {
            // Refreshes the ufe basket information and shows the inline basket
            // jscs:disable maximumLineLength
            window.addEventListener('UFE.openInlineBasket', function (e) {
                let refreshBasket = basketActions.refreshBasket();

                // Need to subscribe for refresh Basket end
                refreshBasket(store.dispatch).then(() => {
                    if (e.detail && e.detail.quantity) {
                        store.dispatch(
                            inlineBasketActions.addedProductsNotification(e.detail.quantity)
                        );
                    }

                    store.dispatch(inlineBasketActions.showInlineBasket(true));
                    if (e.detail && e.detail.error) {
                        store.dispatch(basketActions.showError(e.detail.error));
                    }

                });
            });

            window.addEventListener('UFE.refreshInlineBasket', function () {
                store.dispatch(basketActions.refreshBasket());
            });
        };

        handleExternallyTriggeredEvents();

        /* Initialize analytics
        ** Important: We need to do this before the load event to avoid errors in other files that
        ** trigger analytics events and depend on objects that are expected to be defined.
        ** UFE analytics are not used for legacy mode */
        if (!Sephora.isLegacyMode) {
            require('analytics/loadAnalytics');
        }

        Events.onLastLoadEvent(window, [Events.load], function () {

            //Put deferred scripts here
            // UFE analytics are not used for legacy mode
            if (!Sephora.isLegacyMode) {

                let analyticsConsts = require('analytics/constants');
                let processEvent = require('analytics/processEvent');

                //Populate prequesite properties that other code depends
                require('analytics/dataLayer/preLoadEventBindings');

                //Load Signal
                require('analytics/loadTagManagementSystem');

                processEvent.process(
                    analyticsConsts.PAGE_LOAD,
                    { pageType: Sephora.analytics.backendData.pageType }
                );
            }

        });

        const loadDependencies = (function () {
            let dependencies = [];
            dependencies.push(Events.UserInfoCtrlrsApplied);

            if (shouldServiceRun.certona()) {
                dependencies.push(Events.CertonaCtrlrsApplied);
            }

            if (shouldServiceRun.testTarget()) {
                dependencies.push(Events.TestTargetCtrlrsApplied);
            }

            dependencies.push(Events.InPageCompsCtrlrsApplied);
            dependencies.push(Events.load);

            return dependencies;
        })();

        /* Post Load Service */
        const firePostLoad = function firePostLoad() {
            /**
             * This require.ensure needs to be inside the ensure for components.chunk
             * so that its components aren't duplicated in both chunks.
             */
            if (!postLoadFired) {
                require.ensure([], function () {
                    postLoadFired = true;
                    Perf.report('PostLoad Ready');

                    var postLoadComponents = require('../build/postLoadList');
                    InflatorComps.Comps = Object.assign(InflatorComps.Comps, postLoadComponents);

                    // Trigger post load for components to react to
                    InflatorComps.services.loadEvents[Events.PostLoad] = true;
                    window.dispatchEvent(new CustomEvent(Events.PostLoad));

                    InflatorComps.renderQueue('PostLoad');

                }, 'postload');
            } else {
                return;
            }
        };

        /* Set a timeout in case dependencies don't fire */
        setTimeout(function () {
            firePostLoad();
        }, TIMEOUT);

        Events.onLastLoadEvent(window, loadDependencies, firePostLoad);

    }, 'components');

    return null;
})();



// WEBPACK FOOTER //
// ./public_ufe/js/services/PostLoad.js