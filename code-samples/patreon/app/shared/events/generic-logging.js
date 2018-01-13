import { logEvent } from 'analytics'

export const logLandedEvent = (EVENTS_NAMESPACE) => {
    logEvent({
        domain: EVENTS_NAMESPACE.DOMAIN || document.title.replace('Patreon: ', ''),
        title: EVENTS_NAMESPACE.LANDED,
    })
}



// WEBPACK FOOTER //
// ./app/shared/events/generic-logging.js