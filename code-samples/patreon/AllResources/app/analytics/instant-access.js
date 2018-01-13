import { makeLogger } from './logger'

export const INSTANT_ACCESS_EVENTS = {
    DOMAIN: 'Instant Access',

    CLICKED_VIEW_CAMPAIGN: 'Clicked View Campaign',
    CLICKED_SHARE: 'Clicked Share',
    CLICKED_TAG: 'Clicked Tag',
    CLICKED_EDITED_LIKE: 'Clicked Edited Like',
    LANDED: 'Landed'
}

export const logInstantAccessEvent = makeLogger(INSTANT_ACCESS_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/instant-access.js