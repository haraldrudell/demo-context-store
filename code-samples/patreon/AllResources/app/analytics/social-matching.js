import { makeLogger } from './logger'

export const SOCIAL_MATCHING_EVENTS = {
    DOMAIN: 'Social Matching',
    LANDED: 'Landed',
    CLICKED_SOCIAL_CONNECT_CTA: 'Clicked Social Connect CTA',
    CLICKED_VIEW_CAMPAIGN: 'Click View Campaign',
    GOT_MATCHES: 'Got Matches',
    NO_MATCHES: 'No Matches'
}

export const logSocialMatchingEvent = makeLogger(SOCIAL_MATCHING_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/social-matching.js