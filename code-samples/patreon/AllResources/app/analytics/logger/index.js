import patreonTrackerClient from './patreon-tracker-client'
import getWindow from 'utilities/get-window'

function _getTracker(windowKey, readableName) {
    if (
        process.env &&
        process.env.NODE_ENV === 'production' &&
        process.env.PATREON_ENV !== 'testing'
    ) {
        /* We are on delta or in production – client initialization happens in py template */
        const tracker = getWindow()[windowKey]

        if (!tracker) {
            /* something should be there. */
            _logError(readableName)
            return null
        } else if (tracker === 'impersonating') {
            /* if admin user is impersonating another user then this is an expected case, but don't send events. */
            return null
        } else {
            return tracker
        }
    }
    /* Not in an environment where we expect amplitude to exist */
    return null
}

function _logError(trackerName) {
    const message = trackerName + ' was expected to be present on window.'

    console.error(message)

    if (getWindow().Rollbar && getWindow().Rollbar.error) {
        getWindow().Rollbar.error(message)
    }
}

function _getGoogleAnalytics() {
    return _getTracker('ga', 'Google Analytics')
}

function eventName(domain, title) {
    return title ? domain + ' : ' + title : domain
}

export function logEvent(options) {
    const { domain, title, info } = options
    const name = eventName(domain, title)

    patreonTrackerClient.logEvent(name, info)
}

export function logGoogleAnalyticsEvent(category, action) {
    const googleAnalytics = _getGoogleAnalytics()
    googleAnalytics &&
        googleAnalytics('send', 'event', {
            eventCategory: category,
            eventAction: action,
        })
}

export function logBlogGoogleAnalyticsEvent(category, action) {
    const blogGoogleAnalytics = _getGoogleAnalytics()
    blogGoogleAnalytics &&
        blogGoogleAnalytics('blogTracker.send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
        })
}

export function logLoadEvent(title, info) {
    logEvent({
        domain: 'Load',
        title: title,
        info: info,
    })
}

export function setUserProperties(properties) {
    // this is only being called from a snippet in the python repo
    // I'm worried about removing it before we remove the python snippet
    // we'll remove the snippet, then remove this next.
}

export function logPageLoad(event) {
    event.domain = 'Page Load'
    logEvent(event)
}

// Tracker for facebook conversions using facebook pixel
// (https://developers.facebook.com/docs/facebook-pixel)
export function trackFacebookConversionEvent(event, options) {
    if (getWindow().fbq) {
        getWindow().fbq('trackCustom', event, options)
    }
}

// A higher order logger fn gives us a lot more flexibility and allows us to
export function makeLogger(domain, callback) {
    return function logEventFn(title, info, ...rest) {
        if (callback && typeof callback === 'function') {
            callback.call(null, title, info, ...rest)
        }

        // Since the logging function can also be called with an object w/ shape
        // { title, domain, info }, we need to overload the logEventFn to accept input of that form
        if (title instanceof Object) {
            const event = title
            event.info = {
                ...event.info,
                origin_pathname: getWindow().location.pathname,
            }
            logEvent({
                domain,
                ...event,
            })
        } else {
            logEvent({
                domain,
                title,
                info: {
                    ...info,
                    origin_pathname: getWindow().location.pathname,
                },
            })
        }
    }
}



// WEBPACK FOOTER //
// ./app/analytics/logger/index.js