import { makeLogger } from './logger'

export const POST_IN_FEED_EVENTS = {
    DOMAIN: 'Post In Feed',
    SOURCE_HOME: 'home',
    SOURCE_CREATOR_PAGE: 'creator',

    /* This is for when they actually click to share on facebook or wherever */
    SHARE: 'Share',
    LIKE: 'Like',
    UNLIKE: 'Unlike'
}

export const logPostInFeedEvent = makeLogger(POST_IN_FEED_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/post-in-feed.js