const TYPES = {
    SET_OFFERS: 'SET_OFFERS',
    CANCEL_OFFERS: 'CANCEL_OFFERS',
    SET_SWAP_COMPONENT: 'SET_SWAP_COMPONENT',
    REGISTER_TEST: 'REGISTER_TEST'
};

function setOffers(data) {
    return {
        type: TYPES.SET_OFFERS,
        offers: data
    };
}

function cancelOffers(isCanceled) {
    return {
        type: TYPES.CANCEL_OFFERS,
        timeout: isCanceled
    };
}

function setSwapComponent(component) {
    return {
        type: TYPES.SET_SWAP_COMPONENT,
        testName: component.testName,
        component
    };
}

function registerTest(testName) {
    return {
        type: TYPES.REGISTER_TEST,
        testName
    };
}

module.exports = {
    TYPES,
    setOffers,
    cancelOffers,
    setSwapComponent,
    registerTest
};



// WEBPACK FOOTER //
// ./public_ufe/js/actions/TestTargetActions.js