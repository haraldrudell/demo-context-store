import { makeLogger } from './logger'

export const POLL_EVENTS = {
    DOMAIN: 'Poll',

    VOTED: 'Voted',
    LANDED: 'Landed'
}

export const logPollEvent = makeLogger(POLL_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/poll.js