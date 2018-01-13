import {
    isProduction,
    isClient,
    getRuntimeEnvironment,
    getCurrentGitSHA,
} from 'shared/environment'
import windowOrFixture from 'utilities/get-window'

const raven = typeof window !== 'undefined' && window.Raven
const windowObj = windowOrFixture()
const sentryUrl = 'https://9c09b19c299a4e36b676cc5272f4e7c6@sentry.io/198407'
const sentryConfig = () => ({
    logger: 'frontend',
    environment: 'production',
    sampleRate: 0.5, // send 50% of events, drop the other half,
    allowDuplicates: false,
    release: getCurrentGitSHA(),
})

const hasBeenInitialized = () => {
    if (raven && raven.isSetup()) {
        return true
    }
    return false
}

export const initializeSentry = () => {
    if (isProduction() && !hasBeenInitialized() && raven) {
        raven.config(sentryUrl, sentryConfig()).install()
        raven.setTagsContext({
            environment: getRuntimeEnvironment(),
            origin: isClient() ? 'client' : 'server',
            source: 'js',
        })
    }
}

export const setUserContext = (email, id) => {
    if (!hasBeenInitialized()) {
        windowObj.console &&
            windowObj.console.error('Error logging has not ben initialized')
        return
    }
    raven.setUserContext({
        email,
        id,
    })
}

export const logException = (exception, context) => {
    if (!hasBeenInitialized()) {
        windowObj.console.error('Error logging has not been initialized')
        windowObj.console && windowObj.console.error(exception)
        return
    }
    raven.captureException(exception, {
        extra: context,
    })
    /*eslint no-console:0*/
    windowObj.console && console.error && console.error(exception)
}

export const logWarning = (message, context) => {
    if (!hasBeenInitialized()) {
        windowObj.console.error('Error logging has not ben initialized')
        return
    }
    raven.captureMessage(message, {
        level: 'warning',
        extra: context,
    })
    /*eslint no-console:0*/
    windowObj.console && console.warn && console.warn(message)
}



// WEBPACK FOOTER //
// ./app/shared/logging/sentry/index.js