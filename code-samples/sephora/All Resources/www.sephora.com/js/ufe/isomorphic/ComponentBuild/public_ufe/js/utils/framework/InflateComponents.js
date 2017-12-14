/*eslint max-len: 0*/
/*eslint no-param-reassign: 0*/
/*eslint no-console: 0*/

/* Helper Functions */
function isFn(obj) {
    return typeof obj === 'function';
}

module.exports = (function () {
    'use strict';
    const performance = require('performance-polyfill');
    const Perf = require('utils/framework/Perf');

    var React = require('react'),
        ReactDOM = require('react-dom'),
        Comps = {},
        InflatorComps = Sephora.Util.InflatorComps,
        isPageClientRendered = false;

    // All Async Loadable Components Should Be Included Here
    Comps = InflatorComps.Comps = {};
    var asyncComponents = require('../../build/asyncList');
    Object.assign(Comps, asyncComponents);

    /**
     * Fires the callback only when all events have been fired
     * @param target
     * @param events
     * @param callback
     */
    var services = InflatorComps.services;

    /**
     * Actually render the component (wraps react)
     * @param componentClass
     * @param props
     * @param element
     * @returns {*}
     */
    InflatorComps.render = function (componentClass, props, element) {
        var createdReactElement;

        if (typeof componentClass === 'string') {
            componentClass = Comps[componentClass]();
        } else {
            Comps[componentClass.prototype.class] = componentClass;
        }

        // Mark root components with red border
        if (process.env.NODE_ENV === 'development' && Sephora.debug.showRootComps) {
            element.style.border = '1px solid red';
        }

        if (typeof props === 'string') {
            try {
                props = JSON.parse(props);
            } catch (e) {
                console.error(e);
                return null;
            }
        } else {
            props = props;
        }

        createdReactElement = React.createElement(componentClass, props);
        return ReactDOM.render(createdReactElement, element);
    };

    let fireAppliedEvent = function(service) {
        Perf.report(service + ' Service Ctrlrs Applied');
        window.dispatchEvent(new CustomEvent(service + 'CtrlrsApplied', { detail: {} }));
        services.loadEvents[service + 'CtrlrsApplied'] = true;
    };

    /**
     * Called when a service is ready so all dependent components can be rendered
     * and their controllers applied
     * @param service
     */
    InflatorComps.renderQueue = function (service) {
        var component;

        Perf.report(service + ' Service AsyncRendering');

        if (services[service] && services[service].queue) {
            for (var i = 0; i < services[service].queue.length; i++) {
                services[service].queue[i].instance = InflatorComps.render(services[service].queue[i].class, services[service].queue[i].props, services[service].queue[i].element);
                Perf.report([services[service].queue[i].class + ' Component Async Rendered', services[service].queue[i].element], false);
            }

            // InflatorComps.applyCtrlr(services[service].queue, service);
        }
        // else {
        //     console.log(performance.now() + ': No ' + service + ' Ctrlrs - firing applied event immediately');
        // }

        fireAppliedEvent(service);
    };

    /* inflate-comps.js is loaded into the front end asyncronusly. The call to
     * InflatorComps.applyCtrlr below adds the script tag to the DOM.
     * inflate-comps.js should load before the page has finished parsing. However, if
     * it doesn't this will be slowing down applying the component controllers to the
     * components already on the page. This could be a good thing or a bad thing, but basically as long
     * as there is no noticable delay between a button appearing on the screen and its
     * click event listener being applied then it shouldn't matter.
     * If this does become a problem you will need to use webpack to add another entry point
     * to the dependency management, so that the components already on the page can be
     * initialized on DOMContentLoaded.
     */
    InflatorComps.applyCtrlr = function (components, name) {
        // Since we don't know at this point if DOMContentLoaded has fired we need to check first
        // then apply then initialize the controllers apropriatly.
        if (!Sephora.DOMContentLoadedFired) {
            window.addEventListener('DOMContentLoaded', function () {
                InflatorComps.applyCtrlr(components, name);
            });
            return;
        }

        Perf.report(name + ' Applying Ctrlrs');

        var i,
            compCtrlr;

        if (typeof components === 'string') {
            var componentDataElementId = components;

            components = null;
            // Retrieve link JSON data and parse the object
            var componentsElement = document.body.querySelector('#' + componentDataElementId);
            if (componentsElement) {
                components = JSON.parse(componentsElement.innerHTML);
            }

            if (!components) {
                return;
            }

            for (i = 0; i < components.length; i++) {
                // Comps[components[i].class] = require('../../components/' + components[i].path + '/' + components[i].class + '.r.jsx');
                components[i].element = document.body.querySelector('[data-sephid="' + components[i].id + '"]');

                // If a page component is marked to be rendered completely in the client
                if (!isPageClientRendered && components[i].pageClientRender) {
                    isPageClientRendered = true;
                }
            }
        }

        for (i = 0; i < components.length; i++) {
            let component = components[i];

            if (component.postload) {
                InflatorComps.queue(component.class, component.props, 'PostLoad', component.element);
            } else if (isPageClientRendered) {
                InflatorComps.queue(component.class, component.props, 'UserInfo', component.element);
            } else {
                InflatorComps.render(component.class, component.props, component.element);
                Perf.report([component.class + ' Ctrlr Applied', component.class + ' was backend rendered, and ctrlr is now applied at: ', component.element], false);
            }
        }

        fireAppliedEvent(name);

    };

    // Initialize page components
    Perf.report('Add Components Chunk to Page');
    require.ensure([], function (require) {

        // ---------------------------------------------------------------------
        // WHEN WE MOVE FROM HAVING OLAPIC WIDGETS ON LEGACY PAGES (add-photo),
        // THE BELOW WILL BE PROVIDED ON ALL TARGET PAGES WITH MEANS OF
        // <OlapicComponent name={componentName} />.
        // UNTIL THEN, THIS `window.getBeautyBoardUser` SNIPPET STAYS HERE.
        // THIS IS DUPLICATE CODE FROM components/BeautyBoard/OlapicComponent.
        // ---------------------------------------------------------------------

        /*eslint-disable camelcase*/
        window.getBeautyBoardUser = function () {
            const userUtils = require('utils/User');
            return userUtils.validateUserStatus().then(user => {
                if (user) {
                    let personalInfo = user.beautyInsiderAccount ? userUtils.biPersonalInfoDisplayCleanUp(
                        user.beautyInsiderAccount.personalizedInformation) : {};
                    let colorIQ = user.beautyInsiderAccount && user.beautyInsiderAccount.skinTones ?
                        user.beautyInsiderAccount.skinTones[0].shadeCode : '';
                    let beautyBoardUserInfo = {
                        bi_status: userUtils.getBiStatus(),
                        email: user.login,
                        eye_color: personalInfo.eyeColor || '',
                        first_name: user.firstName,
                        hair_color: personalInfo.hairColor || '',
                        hair_concern: personalInfo.hairConcerns || '',
                        public_id: user.publicId,
                        last_name: user.lastName,
                        skin_tone: personalInfo.skinTone || '',
                        skin_type: personalInfo.skinType || '',
                        skincare_concerns: personalInfo.skinConcerns || '',
                        nick_name: user.nickName,
                        your_hair: personalInfo.hairDescrible || '',
                        color_iq: colorIQ,
                        store_id: '',
                        store_name: '',
                        store_token: '',
                        roles: ''
                    };
                    return beautyBoardUserInfo;
                } else {
                    return Promise.reject();
                }
            });
        };

        var inPageComponents = require('../../build/inPageList');
        Object.assign(Comps, inPageComponents);

        InflatorComps.applyCtrlr('linkJSON', 'InPageComps');

        if (Sephora.isLazyLoadEnabled) {
            const LazyLoader = require('utils/framework/LazyLoad');
            LazyLoader.start();
        }

    }, 'components');

    return InflatorComps;
})();



// WEBPACK FOOTER //
// ./public_ufe/js/utils/framework/InflateComponents.js