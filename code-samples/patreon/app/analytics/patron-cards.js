import { makeLogger } from './logger'

export const PATRON_CARD_EVENTS = {
    DOMAIN: 'Patron Cards',

    HOVER: 'Hovered',
    MESSAGE: 'Opened Message Modal',
    BLOCK: 'Opened Block Modal',
    GO_TO_PROFILE: 'Navigated to User Profile',
}

export const logPatronCardEvent = makeLogger(PATRON_CARD_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/patron-cards.js