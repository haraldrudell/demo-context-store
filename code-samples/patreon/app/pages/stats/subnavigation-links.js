import { CREATOR_NAV_EVENTS } from 'analytics'

export const getLinks = () => [{
    url: '/dashboard/earnings',
    name: 'Earnings',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/patronage',
    name: 'Patronage',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/declines',
    name: 'Declines',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/payouts',
    name: 'Payouts',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/vat',
    name: 'VAT',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/refunds',
    name: 'Refunds',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/pledge-growth',
    name: 'Pledge Growth',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/posts',
    name: 'Posts',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/engagement',
    name: 'Engagement',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/exit-surveys',
    name: 'Exit Surveys',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}, {
    url: '/dashboard/widgets',
    name: 'Widgets',
    domain: CREATOR_NAV_EVENTS.DOMAIN,
    event: CREATOR_NAV_EVENTS.DASHBOARD_CLICKED_SUBPAGE,
}]



// WEBPACK FOOTER //
// ./app/pages/stats/subnavigation-links.js