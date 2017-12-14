// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
var TestTarget = function () {};

// Added by sephora-jsx-loader.js
TestTarget.prototype.shouldComponentUpdate = wrapComponentRenderModule.shouldComponentUpdate;
const store = require('Store');
const watch = require('redux-watch');
const Events = require('utils/framework/Events');
const BCC = require('utils/BCC');
const TEST_TYPES = require('utils/TestTarget').TEST_TYPES;
const setSwapComponent = require('actions/TestTargetActions').setSwapComponent;

/**
  * T&T tested components may need to be explicitly added here in case they haven't been required
  * by another component (meaning it does not yet exist in the component library).
  *
  * These require statements are wrapped in require.ensure so that the required component
  * and its dependencies are not included in the priority bundle. They are added to the
  * components chunk instead.
  */

// require.ensure([], function(require) {
//     if (!Sephora.isRootRender) {
//         Sephora.Util.InflatorComps.Comps.Test = function () {
//             return require('components/Test/Test');
//         };
//      }
// }, 'components');

TestTarget.prototype.ctrlr = function () {
    if (Sephora.isThirdPartySite) {
        this.defaultToControl();
        return;
    }

    const testComponentClassLoaded = new Promise((resolve, reject) => {
        Events.onLastLoadEvent(window, [Events.TestTargetReady], () => {
            if (Sephora.Util.InflatorComps.Comps[this.props.testComponent]) {
                resolve();
            } else {
                Events.onLastLoadEvent(window, [Events.InPageCompsCtrlrsApplied], () => {
                    if (Sephora.Util.InflatorComps.Comps[this.props.testComponent]) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            }
        });
    });

    testComponentClassLoaded.then(() => {

        this.executeTest();

        // Subscribe to T&T updates
        const testTargetWatch = watch(store.getState, 'testTarget.results');
        store.subscribe(testTargetWatch(newVal => {
            this.executeTest();
        }));

    }, () => {

        /* TODO: Find an optimal solution for edge cases where the component class
        may not be available yet. */
        const warning = 'TestTarget: %s component class was not found, rendering empty instead.';
        return console.error(warning, this.props.testComponent);
    });
};

TestTarget.prototype.executeTest = function () {
    const results = store.getState().testTarget;
    const testResults = this.getTestResults(results);
    const testEligible = this.props.testName && this.props.testEnabled && testResults;

    if (!results.timeout && testEligible) {

        /* Handle tests involving BCC components*/
        if (this.props.isBcc && testResults.currentTest.testType !== undefined) {

            switch (testResults.currentTest.testType) {
                case TEST_TYPES.REORDERING:

                    /* Retrieve the name of the component that is supposed to swap with
                    this instance. */

                    // jscs:disable maximumLineLength
                    if (this.props.name in testResults.currentTest.arrangement) {
                        const replacementComponent = testResults.currentTest.arrangement[this.props.name];

                        this.registerSwapComponents(testResults.currentTest, testResults.testName).then(
                            components => this.handleComponentSwap(components, replacementComponent),
                            err => this.defaultToControl(err)
                        );
                    } else {
                        this.defaultToControl();
                    }
                    break;
                case TEST_TYPES.TOGGLE:
                    if (this.shouldHideComponent(testResults.currentTest.result)) {
                        this.setState({ componentHidden: true });
                        /* If component is to be hidden, returns to remain <Empty> and sets
                        componentHidden flag to hide bccStyleWrapper. */
                        return;
                    } else {

                        //jscs: disable maximumLineLength
                        this.setState({
                            displayComponent: Sephora.Util.InflatorComps.Comps[this.props.testComponent](),
                            updateProps: false
                        });
                        break;
                    }

                default:
                    this.defaultToControl();
            }

            /* Handle hard-coded tests */
        } else {
            this.setState({
                displayComponent: Sephora.Util.InflatorComps.Comps[this.props.testComponent](),
                updateProps: { testTarget: { [testResults.testName]: testResults.currentTest } }
            });
        }

        if (this.props.testCallback) {
            /* Hook to execute a callback when the test executes, useful for state changes */
            this.props.testCallback();
        }

    } else {

        /* Default to control if:
        ** 1. Test is disabled
        ** 2. testName was not passed
        ** 3. No matching result in store
        ** 4. Test flag is false in store
        ** 5. T&T service timeouts
        */
        this.defaultToControl();
    }
};

TestTarget.prototype.getTestResults = function (results) {
    //TODO: BCC and API should return an array of tests
    const testNames = this.props.testName ? this.props.testName.split(',') : [];

    let testResults = [];

    testNames.forEach(name => {
        const trimmedName = name.trim();

        if (results.offers[trimmedName]) {
            testResults.push({
                testName: trimmedName,
                currentTest: results.offers[trimmedName]
            });
        }
    });

    if (testResults.length) {
        return testResults.pop();
    } else {
        return false;
    }
};

TestTarget.prototype.defaultToControl = function (error) {
    let defaultProps;

    if (this.props.isBcc) {
        defaultProps = this.props;
    } else {
        defaultProps = { testTarget: false };
    }

    /* Render component as control case */
    this.setState({
        displayComponent: Sephora.Util.InflatorComps.Comps[this.props.testComponent](),
        updateProps: defaultProps
    });

    if (error) {
        console.error(error);
    }
};

/**
 * @param {object} currentTest - This test's corresponding object sent from T&T.
 */
TestTarget.prototype.shouldHideComponent = function (currentTest) {
    return typeof currentTest.isHidden !== 'undefined' && currentTest.isHidden;
};

/**
 * @param {array} components - This test's associated components.
 * @param {string} componentName - The name of the component to be swapped with (BCC property).
 */
TestTarget.prototype.handleComponentSwap = function (components, componentName) {

    /* Set the component's default setup as fallback. */
    let componentToRender = this.props.testComponent;
    let propsToRender = this.props;

    /* If there's no replaceComponent, then just hide the original one */
    if (!componentName) {
        this.setState({ componentHidden: true });
        return;
    }

    /* Filter the current test's component 'library' with the name of the component to be
    swapped with. */
    let replacement = components.filter(component => component.name === componentName);

    /* Ideally, the filtering will always return one component, however, we do a safety
    check in case there is a mismatch between the component names. If that is the case,
    it will render with the fallback set above. */
    if (replacement.length) {
        replacement = replacement.pop();

        /* Render this instance with the data of the component that it's being swapped with. */
        componentToRender = replacement.testComponent;
        propsToRender = replacement;
    }

    this.setState({
        displayComponent: Sephora.Util.InflatorComps.Comps[componentToRender](),
        updateProps: propsToRender
    });
};

/**
 * @param {object} currentTest - This test's corresponding object sent from T&T.
 */
TestTarget.prototype.registerSwapComponents = function (currentTest, testName) {
    /* Send component data to store so other instances can make it their own. */
    let modifiedProps = Object.assign({}, this.props);
    modifiedProps.testName = testName;

    store.dispatch(setSwapComponent(modifiedProps));

    /* Wait until the tested component's data is registered in the store before starting
    ** to swap.
    */
    return new Promise((resolve, reject) => {
        const getSwapComponents = () => store.getState().testTarget.swaps[testName];

        /* Resolve only when all components being tested have been stored. */
        const componentsHaveBeenRegistered = (components = getSwapComponents()) =>
            components.length === currentTest.componentCount;

        if (componentsHaveBeenRegistered()) {
            resolve(getSwapComponents());
        } else {

            /* Default to control in case test setup was misconfigured. This will occur if the
            amount of BCC components asigned to a same test does not match the component count
            setting in the T&T result. */
            const TIMEOUT = 3000;
            setTimeout(() => {
                reject(`TestTarget: component test ${testName} has timeout.`);
            }, TIMEOUT);

            /* Watch for components being registered to swap. */
            const watcher = watch(store.getState, 'testTarget.swaps');
            store.subscribe(watcher(newVal => {
                if (componentsHaveBeenRegistered(newVal[testName])) {
                    resolve(newVal[testName]);
                }
            }));
        }
    });
};


// Added by sephora-jsx-loader.js
module.exports = TestTarget.prototype;


// WEBPACK FOOTER //
// ./public_ufe/js/components/TestTarget/TestTarget.c.js