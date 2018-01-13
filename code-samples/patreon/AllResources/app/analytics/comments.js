import { makeLogger } from './logger'

export const COMMENT_EVENTS = {
    DOMAIN: 'Comment',

    ADD_EVENT: 'Add',
    EDIT_EVENT: 'Edit',
    DELETE_EVENT: 'Delete',
    VOTE_EVENT: 'Vote',

    // legacy
    WEB_COMMENTS_SOURCE: 'web_comments_v2', // angular?
    WEB_COMMENTS_V3_SOURCE: 'web_comments_v3', // react, when not yet more specific

    CREATOR_OVERVIEW_SOURCE: 'creator_overview',
    CREATOR_PAGE_SOURCE: 'creator_feed',
    COMMUNITY_PAGE_SOURCE: 'community_feed',
    HOME_FEED_SOURCE: 'home_feed',
    POST_PAGE_SOURCE: 'post_page',
    INSTANT_ACCESS_SOURCE: 'instant_access',
    NOTIFICATIONS_SOURCE: 'notifications',
}

export const logCommentEvent = makeLogger(COMMENT_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/comments.js