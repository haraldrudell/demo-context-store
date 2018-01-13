import { makeLogger } from './logger'

export const SEARCH_EVENTS = {
    DOMAIN: 'Search',

    LANDED: 'Landed',
    FOCUS: 'Gained Focus',
    BLUR: 'Lost Focus',
    VIEW_ALL: 'Viewed All Results',
    SELECT: 'Selected Result'
}

export const logSearchEvent = makeLogger(SEARCH_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/search.js