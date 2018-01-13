import { AUTH_EVENTS, logEvent } from 'analytics'

export const logAuthEvent = (eventName, properties) => {
    return logEvent({
        domain: AUTH_EVENTS.DOMAIN,
        title: eventName,
        info: properties,
    })
}



// WEBPACK FOOTER //
// ./app/shared/events/auth.js