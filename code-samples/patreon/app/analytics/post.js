import { makeLogger } from './logger'

export const POST_EVENTS = {
    DOMAIN: 'Post',

    CLICKED_DATETIME: 'Clicked Datetime Stamp',
    CLICKED_TITLE: 'Clicked Title',
    CLICKED_TO_GET_ACCESS: 'Clicked Get Access',
    CLICKED_UNLOCKED_EA_POST: 'Clicked Unlocked Early Access Post',
    CLICKED_WATCH_LIVESTREAM: 'Clicked Watch Livestream',
}

export const logPostEvent = makeLogger(POST_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/post.js