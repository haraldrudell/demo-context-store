import { makeLogger } from './logger'

export const FOLLOW_EVENTS = {
    DOMAIN: 'Follow',

    FOLLOWED: 'User Followed User',
    UNFOLLOWED: 'User Unfollowed User'
}

export const logFollowEvent = makeLogger(FOLLOW_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/follow.js