// jscs:disable maximumLineLength
// jscs:disable disallowMultipleVarDecl

const DebouncedScroll = 'DebouncedScroll',
    UserInfoLoaded = 'UserInfoLoaded',
    UserInfoReady = 'UserInfoReady',
    DOMContentLoaded = 'DOMContentLoaded',
    CertonaReady = 'CertonaReady',
    Immediate = 'Immediate',
    ImmediateReady = 'ImmediateReady',
    VisitorAPILoaded = 'VisitorAPILoaded',
    TestTarget = 'TestTarget',
    TestTargetReady = 'TestTargetReady',
    TestTargetLoaded = 'TestTargetLoaded',
    TestTargetResult = 'TestTargetResult',
    UserInfoCtrlrsApplied = 'UserInfoCtrlrsApplied',
    CertonaCtrlrsApplied = 'CertonaCtrlrsApplied',
    TestTargetCtrlrsApplied = 'TestTargetCtrlrsApplied',
    InPageCompsCtrlrsApplied = 'InPageCompsCtrlrsApplied',
    LazyLoadComplete = 'LazyLoadComplete',
    load = 'load',
    PostLoad = 'PostLoad',
    PostLoadCtrlrsApplied = 'PostLoadCtrlrsApplied';

// This function should run immediately the first time its called.
// It will then run at the specified interval if called again
// before that interval is up.
function debounce(func, wait, immediate) {
    var lastRun,
        timeout,
        args,
        _this,
        later = function () {
            clearTimeout(timeout);
            timeout = null;
            lastRun = new Date().getTime();
            func.apply(_this, args);
        };

    return function () {
        /* eslint-disable no-invalid-this */
        _this = this;
        args = arguments;

        var sinceLastRun = new Date().getTime() - lastRun;
        if (sinceLastRun > wait) {
            later();
        } else if (!timeout) {
            timeout = setTimeout(later, wait - sinceLastRun);
        }
    };
}

//TODO: Add debounced window resize
var debouncedScrollHandler = debounce(function () {
    window.dispatchEvent(new CustomEvent(DebouncedScroll, { detail: {} }));
}, 50, true);

window.addEventListener('scroll', debouncedScrollHandler);

var services = window.Sephora.Util.InflatorComps.services;

// const onLast = function (target, events, callback) {
//     var count = 0;
//
//     for (var i = 0; i < events.length; i++) {
//         target.addEventListener(events[i], function () {
//             if (++count === events.length) callback();
//         }, false);
//     }
// }

const onLastLoadEvent = function (target, events, callback) {

    var count = 0;

    for (var i = 0; i < events.length; i++) {
        if (services.loadEvents[events[i]] && ++count === events.length) {
            callback();
        } else {
            target.addEventListener(events[i], function () {
                if (++count === events.length) {
                    callback();
                }
            }, false);
        }
    }
};

module.exports = {
    DebouncedScroll: DebouncedScroll,
    onLastLoadEvent: onLastLoadEvent,
    UserInfoLoaded: UserInfoLoaded,
    UserInfoReady: UserInfoReady,
    DOMContentLoaded: DOMContentLoaded,
    CertonaReady: CertonaReady,
    Immediate: Immediate,
    VisitorAPILoaded: VisitorAPILoaded,
    TestTarget: TestTarget,
    TestTargetReady: TestTargetReady,
    TestTargetLoaded: TestTargetLoaded,
    TestTargetResult: TestTargetResult,
    UserInfoCtrlrsApplied: UserInfoCtrlrsApplied,
    CertonaCtrlrsApplied: CertonaCtrlrsApplied,
    TestTargetCtrlrsApplied: TestTargetCtrlrsApplied,
    InPageCompsCtrlrsApplied: InPageCompsCtrlrsApplied,
    LazyLoadComplete: LazyLoadComplete,
    load: load,
    PostLoad: PostLoad,
    PostLoadCtrlrsApplied: PostLoadCtrlrsApplied
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/framework/Events.js