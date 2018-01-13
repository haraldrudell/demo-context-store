import { logEvent } from './logger'

export const LIVESTREAM_EVENTS = {
    DOMAIN: 'Livestream',
    EDUCATION_PAGE: 'Education Page',
    LANDED: 'Landed',
    CLICKED_DISMISS: 'Clicked Dismiss',
}

export function logLivestreamEvent(eventName, info) {
    const event = {
        domain: LIVESTREAM_EVENTS.DOMAIN,
        title: `${LIVESTREAM_EVENTS.EDUCATION_PAGE} : ${eventName}`,
    }
    if (info) {
        event.info = info
    }
    logEvent(event)
}



// WEBPACK FOOTER //
// ./app/analytics/livestreaming.js