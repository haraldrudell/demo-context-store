import { makeLogger } from './logger'

export const POST_PAGE_EVENTS = {
    DOMAIN: 'Post Page',

    LANDED: 'Landed',
    CLICKED_REWARD: 'Clicked Reward',
    CLICKED_BECOME_PATRON: 'Clicked Become Patron',
    CLICKED_EDIT_PLEDGE: 'Clicked Edit Pledge',
    CLICKED_CAROUSEL: 'Clicked Carousel',
    CLICKED_VIEW_PATRON: 'Clicked View Patron',
    CLICKED_VIEW_ALL_PATRONS: 'Clicked View All Patrons',
    CLICKED_VIEW_CAMPAIGN: 'Clicked View Campaign',
    CLICKED_SHARE: 'Clicked Share',
    CLICKED_COPY_URL: 'Clicked Copy URL',
    CLICKED_TAG: 'Clicked Tag',
    EDITED_LIKE: 'Edited Like',
}

export const logPostPageEvent = makeLogger(POST_PAGE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/post-page.js