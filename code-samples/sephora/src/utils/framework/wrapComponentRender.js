/*eslint no-console: 0*/
/*eslint max-len: 0*/
/*eslint no-invalid-this: 0*/
/*eslint brace-style: 0*/
/*eslint quotes: 0*/

module.exports = (function() {

    var React = require('react'),
        ReactDOM = require('react-dom/server'),
        Constants = require('utils/framework/Constants');

    var renderServerErrors = (global.process.env.UFE_ENV !== Constants.UFE_ENV_PRODUCTION);
    /* Backend Component Rendering */
    /* In order to step through react as it render's elements put a stop point at
     * the start of ReactReconciler.mountComponent. That's line 39 in ReactReconciler.js.
     * This is called once for every ReactComponent being rendered. If a custom component
     * is being rendered it will be called twice, once for the custom component and once for
     * it's internal root component. */

    /* Life Cycle of a component */
    /* - React.createElement() is called passing the component class or a string reprisenting
     *   an HTML tag, e.g. 'div'
     * - instantiateReactComponent() receives a ReactElement and returns a "mount image"
     * - ReactCompositeComponentMixin.mountComponent() or ReactDOMComponent.Mixin.mountComponent()
     *   is called on the ReactElement instance. This initializes the component, renders markup,
     *   and registers event listeners, then returns rendered markup to be inserted into the DOM.
     * - ReactElement.type.prototype.render is called during the mounting process for
         ReactComponents. This is the component's render function.
     * - The render function calls its children's React.createElement() functions. The nested
     *   nature of JSX means that createElement() will be called for child elements before their
     *   parent element in the case of regular HTML tags, and elements being nested for
     *   transclusion in component tags. A component's non-transcluded child elements will be
     *   called when it's render function is run. This can mean the order in which react
     *   element's are created is somewhat unpredictable, but has the benefit of not initializing
     *   the bulk of a component until it is rendered.
     * - If the element being called is a component:
     *   - instantiateReactComponent() is now called on its root element
     *   - ReactDOMComponent.Mixin.mountComponent() is called for the root element
     *   - ReactMultiChild.Mixin.mountChildren() is called for the root element, which calls
     *     instantiateReactComponent() for each child element.
     *   - ReactCompositeComponentMixin.mountComponent() or
     *     ReactDOMComponent.Mixin.mountComponent() is called for each element
     *   - ReactElement.type.prototype.render is called during the mounting process and the
     *     cycle continues
     */

    /*
     * The following characters must be escaped to allow the component JSON to be written out as js
     * in the page.
     *
     * For info no \u2028 and \u2029 see http://timelessrepo.com/json-isnt-a-javascript-subset
     */
    let escapedCharacters = /([\/'"\u2028\u2029\\])/g;
    let isProduction = process.env.NODE_ENV === 'production';

    var checkForRoot = null,
        rootCompCount = 0;

    function getRootCompCount() {
        return rootCompCount;
    }

    function setRootCompCount(count) {
        rootCompCount = count;
    }

    function wrapComponentRender(originalRender) {

        let renderWrapper = function renderWrapper() {

            let originalVDomElement,
                error,
                isRootComponent,
                runOriginalRender = function(target) {

                    if (Sephora.isRootRender && (target.hasCtrlr || target.isForcedRoot)) {

                        /* TODO: Use logger / debug switch when ILLUPH-82156 is done. */
                        if (!isProduction && checkForRoot && target.asyncRender) {

                            /**
                             * Async components will not be rendered asynchronously if the
                             * component is child of a root component.
                             * See ILLUPH-82153 for more information.
                             */
                            console.warn(`Async component [${target.class}] is child of a root component, it will not render asynchronously.`);
                        }

                        if (target.postLoad || target.isForcedRoot) {

                            isRootComponent = true;
                            return React.createElement('div');

                        } else if (!checkForRoot) {

                            isRootComponent = true;

                            // This disables check for root so that render functions run by
                            // the subsequent ReactDOM.renderToString don't go through this same
                            // function.
                            checkForRoot = target;

                            let createdReactElement = React.createElement(target.classRef, target.props),
                                componentHTML = ReactDOM.renderToString(createdReactElement),
                                compiledComponent = React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: componentHTML
                                    }
                                });

                            checkForRoot = null;

                            return compiledComponent;
                        }
                    }

                    return originalRender.apply(target, arguments);
                };

            // WRAP PRODUCTION COMPONENT RENDERING IN TRY...CATCH... //
            // ***************************************************** //
            if (isProduction) {
                try {
                    originalVDomElement = runOriginalRender(this);
                } catch (e) {
                    error = e;
                    if (renderServerErrors && Sephora.serverErrors) {
                        Sephora.serverErrors.push({
                            name: error.name,
                            message: error.message,
                            stack: error.stack
                        });
                    }
                    console.error(error);
                    return null;
                }
            } else {
                originalVDomElement = runOriginalRender(this);
            }

            let newVDomElement,
                rootComp,
                compStore,
                parentCompRef;

            // IF RENDER RETURNS 'NULL' OR 'FALSE' //
            // *********************************** //
            // React allows you to pass 'null' or 'false' if you don't want the component to
            // render. When this happens server side react adds an empty div with the comment
            // <!-- react-empty: 1 -->
            // Since we still need to hook up our component on the front end we instead generate
            // an empty div to act as our front end hookup target element. For more information see
            // ILLUPH-76784.
            if (Sephora.isRootRender && (this.hasCtrlr || this.isForcedRoot) && !checkForRoot && originalVDomElement === null) {
                originalVDomElement = React.createElement('div');
            } else if (originalVDomElement === null) {
                return null;
            }
            // *********************************** //

            // Create a copy of the vDOM element, and vDom element props. This is necessary to
            // unfreeze it
            newVDomElement = Object.assign({}, originalVDomElement);
            newVDomElement.props = Object.assign({}, originalVDomElement.props);

            // If rendering with regular react-lite
            if (!Sephora.isRootRender) {
                compStore = newVDomElement.props;
                parentCompRef = this.props.comps;
                // If rendering with regular React
            } else {
                compStore = newVDomElement;
                parentCompRef = this._reactInternalInstance._currentElement.comps;
            }

            // If the initial element of the root component is itself a component, e.g.
            // <Component>, rather than an html element, e.g. <div>
            // wrap the render function of the initial element instead.
            if (typeof newVDomElement.type === 'function') {

                // Unwrap this component class's render function
                // this.__proto__.render = originalRender;

                // Wrap child component class's render function
                // originalRender = newVDomElement.type.prototype.render;
                // newVDomElement.type.prototype.render = wrapRender;

                // If the initial element of the initial element component is also a component
                // pass on the original root component. This will keep being passed
                // down the tree until a standard HTML element is reached.
                if (parentCompRef) {
                    parentCompRef.push(this);
                    compStore.comps = parentCompRef;
                } else {
                    compStore.comps = [this];
                }

                // Refreeze vDomElement
                if (Sephora.isRootRender) {
                    Object.freeze(newVDomElement);
                }

                return newVDomElement;
            }
            // If the initial element is a standard HTML element and this component is the
            // initial element of another component
            else if (parentCompRef) {
                // Set root component to the top level component instance
                parentCompRef.push(this);
                compStore.comps = parentCompRef;
            }
            // This root component has a default HTML element as its initial element and can
            // wrap its own render function
            else {
                compStore.comps = [this];
            }

            rootComp = compStore.comps[0];

            // LINK REACT FROM THE SERVER TO THE CLIENT //
            // **************************************** //
            // TODO: Checkout markup = ReactMarkupChecksum.addChecksumToMarkup(markup); to see if they have any helper functions for adding content to rendered HTML strings
            if (Sephora.isRootRender && isRootComponent) {
                if (!rootComp.asyncRender || Sephora.isThirdPartySite) {

                    // Assign component a unique sephora id for linking it up in the front end from linkJSON
                    let id = rootCompCount++;
                    newVDomElement.props = {
                        'data-sephid': id
                    };
                    Object.assign(newVDomElement.props, originalVDomElement.props);

                    if (rootComp.props.children) {
                        console.error(rootComp +
                            ': Component should not use transclusion. It is not possible to pass this.props.children between server and client.\n' +
                            rootComp.class + ' at data-sephid=' + id + ' will not render with its props client side.'
                        );
                        rootComp.props = null;
                    }

                    if (rootComp.hasCtrlr || rootComp.isForcedRoot) {
                        // Hookup JSON is added to the index prototype so that it can be rendered after all the other components are finished rendering.
                        // Add component to linkJSON so inflate comps knows it needs to be linked up on the front end
                        Sephora.linkJSON.push({
                            id: id,
                            class: rootComp.class,
                            path: rootComp.path,
                            props: rootComp.props,
                            postload: rootComp.postLoad,
                            pageClientRender: rootComp.pageClientRender
                        });
                    } else {
                        console.error('wrapComponentRender: The component "' + this.class + '" inherits from root parent component "' + rootComp.class + '". ' + rootComp.class + ' is not recognized as a root component since it has no controller and does not use isForcedRoot. Setup ' + rootComp.class + ' as a root component or wrap ' + this.class + ' in a native html element.');
                    }

                } else {

                    // TODO: Leave the code below commented out for now. Its likely to be useful in future refactors.
                    // newVDomElement.props = Object.assign({}, originalVDomElement.props);
                    //
                    // // Duplicate component's children property
                    // var children = newVDomElement.props.children;
                    // if (children) {
                    //     children = [].concat(children);
                    // } else {
                    //     children = [];
                    // }
                    //
                    // // Add script element as the last child of the component to tell inflate comps to render this component ASAP
                    // // This is for high priority components that require personalized data to render
                    // children.push(React.createElement('script', {
                    //     dangerouslySetInnerHTML: {
                    //         __html: 'Sephora.Util.InflatorComps.queue(\'' + rootComp.class + '\', \'' + JSON.stringify(rootComp.props) + '\', \'' + rootComp.asyncRender + '\');'
                    //     }
                    // }));
                    //
                    // newVDomElement.props.children = children;

                    newVDomElement.props.dangerouslySetInnerHTML.__html += '<script>Sephora.Util.InflatorComps.queue(\'' + rootComp.class + '\', \'' + JSON.stringify(rootComp.props).replace(escapedCharacters, "\\$1") + '\', \'' + rootComp.asyncRender + '\');</script>';
                }
            }

            /* DISPLAY COMPONENT NAMES AND UNIQUE IDS FOR AUTOMATED TESTING
             * This is enabled by setting AUTOMATION_TARGETS=true when starting node
             * Wrap react so that component names are added to component elements
             * This is used in development mode and also as targeting for the automated testing
             team */
            if (!isRootComponent && Sephora.debug && Sephora.debug.displayAutomationAttr) {
                // for each new component add more line here [Name of Component, Path To Props]
                let uidProperties = new Map([
                    ['BccImage', 'useMap'],
                    ['ProductItem', 'productId:skuId'], // Couple Props
                    ['QuickLookModal', 'product.productId:currentSku.skuId'] // Props In Objects
                ]);
                // Functions should only be added to WrapReact when server initializes.
                // Adding a function when requests are recieved will cause a memory leak.
                newVDomElement.props['data-comp'] = compStore.comps.map(function(instance) {
                    return instance.class;
                }).join(' ');
                // Only the exact\last Component class matters
                let uidProperty = uidProperties.get(compStore.comps[0].class);
                if (uidProperty) {
                    uidProperty = uidProperty.split(':');
                    let uidString = '';
                    uidProperty.forEach(function(uidPropPath) {
                        let uidPropPathArr = uidPropPath.split('.');
                        let uidValue = compStore.comps[0].props[uidPropPathArr[0]];
                        uidPropPathArr.forEach(function(prop, i) {
                            if (i && uidValue instanceof Object) { // pass first of them
                                uidValue = uidValue[prop];
                            }
                        });

                        uidValue && (uidString += uidValue + ' ');
                    });

                    if (uidString !== '') {
                        newVDomElement.props['data-uid'] = uidString.trim();
                    }
                }
            }

            /* HANDLE GLOBAL ACCESS OF COMPONENTS
             *
             */
            if (!Sephora.isRootRender) {
            // If rendering component on the front end
                for (let i = 0; i < compStore.comps.length; i++) {
                    let compInstance = compStore.comps[i];
                    if (compInstance.state && compInstance.state.globalRef) {
                        // Apply global instance attributes to react element
                        Object.assign(newVDomElement.props, compInstance.state.globalRef.attrs);
                    }
                }
            } else if (!checkForRoot) { // checkForRoot ensures that this is only appled to images that will not be re-rendered on the front end
            // If rendering component on the backend put in a flag so it can be added to instances
            // array on the front end
                let ref = '';
                for (let i = 0; i < compStore.comps.length; i++) {
                    let compInstance = compStore.comps[i];
                    if (compInstance.globalAccess) {
                        ref += compInstance.class;
                    }
                }
                if (ref.length) {
                    newVDomElement.props['data-ref'] = ref;
                }
            }

            // Refreeze vDomElement
            if (Sephora.isRootRender) {
                Object.freeze(newVDomElement.props);
                Object.freeze(newVDomElement);
            }

            // Unwrap render function. This prevents recursive issues.
            // this.__proto__.render = originalRender;
            return newVDomElement;

        };

        return renderWrapper;
    }

    function shouldComponentUpdate(nextProps, nextState) {
        var MAX_DEPTH_OF_CHECK = 5;
        var depthOfCheck = 0;
        function isObject(val) {
            return (typeof val === 'object' || typeof val === 'function') && val !== null;
        }
        function objectsAreEqual(first, second) {
            var isFirstObject = isObject(first);
            var isSecondObject = isObject(second);
            if (!isFirstObject && !isSecondObject) { // both are not objects, compare primitives
                return first === second;
            } else if (!isFirstObject || !isSecondObject) { // one of them is not object
                return false;
            }
            if (depthOfCheck >= MAX_DEPTH_OF_CHECK) { // do not check object up to infinite loop
                try {
                    return JSON.stringify(first) === JSON.stringify(second);
                } catch (e) {
                    return false;
                }
            } else {
                depthOfCheck++;
            }
            var firstProps = Object.keys(first);
            var secondProps = Object.keys(second);
            if (firstProps.length !== secondProps.length) { // not equal amount of properties
                return false;
            }
            var diffProps = firstProps.filter(function (val) {
                return secondProps.indexOf(val) < 0;
            });
            if (diffProps.length) {
                return false; // names of props are not equal
            }
            for (var i = 0; i < firstProps.length; i++) {
                var key = firstProps[i];
                var firstItem = first[key];
                var secondItem = second[key];
                var objectsEqual = objectsAreEqual(firstItem, secondItem);
                if (!objectsEqual) {
                    return false;
                }
            }
            return true;
        }
        //var start = performance.now();
        try {
            var statesAreEqual = objectsAreEqual(this.state, nextState);
            var propsAreEqual = objectsAreEqual(this.props, nextProps);
            var shouldUpdate = !statesAreEqual || !propsAreEqual;
            // if (shouldUpdate) {
            //     var end = performance.now();
            //     console.log(end + ': ' + this.class + ' shouldComponentUpdate started at ' +
            //         start + ' and finished in ' + (end - start) + ' ms with decision to update');
            // }
            return shouldUpdate;
        } catch (e) {
            return true;
        }
    }

    return {
        shouldComponentUpdate: shouldComponentUpdate,
        wrapComponentRender: wrapComponentRender,
        setRootCompCount: setRootCompCount,
        getRootCompCount: getRootCompCount
    };

}());



// WEBPACK FOOTER //
// ./public_ufe/js/utils/framework/wrapComponentRender.js