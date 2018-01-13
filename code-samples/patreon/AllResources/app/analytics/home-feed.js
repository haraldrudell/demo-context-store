import { makeLogger } from './logger'

export const HOME_FEED_EVENTS = {
    DOMAIN: 'Home Feed',

    SUGGESTED_CREATOR_CLICK: 'Suggested Creator Click',
    CLICKED_TAG: 'Post : Clicked Tag',
    CLICKED_POST: 'Clicked Post',
    LANDED: 'Landed',
    LOADED_NEXT_PAGE: 'Loaded Next Page'
}

export const logHomeEvent = makeLogger(HOME_FEED_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/home-feed.js