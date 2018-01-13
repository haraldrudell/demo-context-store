import { makeLogger } from './logger'

export const SOCIAL_CONNECT_EVENTS = {
    DOMAIN: 'Social Connect',
    CLICKED_CONNECT: 'Clicked Connect',
    CONNECT_SOCIAL_ACCOUNT: 'Connected Social Account',
    DISCONNECT_SOCIAL_ACCOUNT: 'Disconnected Social Account',
}

export const logSocialConnectEvent = makeLogger(SOCIAL_CONNECT_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/social-connect.js