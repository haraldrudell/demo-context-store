import { CREATOR_NAV_EVENTS } from 'analytics'

export const getLinks = () => [{
    url: '/posts/new',
    aliases: ['/post'],
    name: 'New',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.POST_NEW,
}, {
    url: '/posts/published',
    name: 'Published',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.POST_PUBLISHED,
}, {
    url: '/posts/scheduled',
    name: 'Scheduled',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.POST_SCHEDULED,
}, {
    url: '/posts/drafts',
    name: 'Drafts',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.POST_DRAFTS,
}]



// WEBPACK FOOTER //
// ./app/pages/make_a_post/subnavigation-links.js