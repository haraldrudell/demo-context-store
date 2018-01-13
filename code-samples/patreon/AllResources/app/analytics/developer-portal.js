import { makeLogger } from './logger'

export const DEV_PORTAL_EVENTS = {
    DOMAIN: 'Developer Portal',

    LANDED: 'Landed',
    CLICKED_HERO_CTA: 'Clicked Hero CTA',
    CLICKED_SUBPAGE: 'Clicked Subpage',
}

export const logDevPortalEvent = makeLogger(DEV_PORTAL_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/developer-portal.js