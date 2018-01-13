import { makeLogger } from './logger'

export const PATRON_MANAGER_EVENTS = {
    DOMAIN: 'Patron Manager',

    LANDED: 'Landed',
    DOWNLOADED_CSV: 'Downloaded CSV',
    CLICKED_PAID_POST: 'Clicked Paid Post',
}

export const PATRON_MANAGER_PATRON_LIST_EVENTS = {
    DOMAIN: 'Patron Manager : Current Patrons',
    LANDED: 'Landed',
}

export const logPatronManagerEvent = makeLogger(PATRON_MANAGER_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/patron-manager.js