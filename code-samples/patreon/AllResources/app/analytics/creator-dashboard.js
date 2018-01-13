import { makeLogger } from './logger'

export const CREATOR_DASHBOARD = {
    DOMAIN: 'Creator Stats',
    LANDED: 'Landed',

    OPEN_SECTION_LIST: 'Open Section List',
    ENTER_SUBPAGE: 'Enter Subpage',
    DOWNLOAD_CSV: 'Download CSV',

    POSTS_RECENT_POSTS_SWITCH_TAB: 'Posts : Recent Posts : Switch Tab',
    POSTS_RECENT_POSTS_CLICK_POST: 'Posts : Recent Posts : Click Post',
    POSTS_RECENT_POSTS_LOAD_POSTS: 'Posts : Recent Posts : Load More Posts',

    WIDGETS_COPY_SNIPPET: 'Widgets : Clicked Copy',
    WIDGETS_LEARN_MORE: 'Widgets : Clicked Learn More',
    WIDGETS_OTHER_PLATFORM_VIEW: 'Widgets : Other Platforms : Clicked View'
}

export const CREATOR_DASHBOARD_SECTIONS = {
    PLEDGES: 'Pledges',
    POSTS: 'Posts',
    PATRONS: 'Patrons',
    GROWTH: 'Growth'
}

export const CREATOR_DASHBOARD_SUBSECTIONS = {
    EARNINGS: 'earnings',
    PATRONAGE: 'patronage',
    VAT: 'vat',
    RETENTION: 'retention',
    ENGAGEMENT: 'engagement',
    DECLINES: 'declines',
    PAYOUTS: 'payouts',
    REFUNDS: 'refunds',
    PLEDGE_GROWTH: 'pledge-growth',
    EXIT_SURVEYS: 'exit-surveys',
    POSTS: 'posts',
    WIDGETS: 'widgets'
}

export const CREATOR_DASHBOARD_RECENT_POSTS_TABS = {
    ENGAGEMENT: 'Engagement',
    SOURCES: 'Sources',
    VIEWERS: 'Viewers'
}

export const logCreatorDashboardEvent = makeLogger(CREATOR_DASHBOARD.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/creator-dashboard.js