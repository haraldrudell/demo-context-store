import { makeLogger } from './logger'

export const CREATOR_CARD_EVENTS = {
    DOMAIN: 'Creator Card',

    CLICK: 'Click'
}

export const logCreatorCardEvent = makeLogger(CREATOR_CARD_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/creator-card.js