import { makeLogger } from './logger'

const FEATURED_PAGE_EVENTS = {
    DOMAIN: 'Featured',

    CLICKED_POST: 'Clicked Post',
    LANDED: 'Landed'
}

export const logFeaturedPageEvent = makeLogger(FEATURED_PAGE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/featured.js