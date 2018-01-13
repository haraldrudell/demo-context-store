import { makeLogger } from './logger'

export const PLEDGES_EVENTS = {
    DOMAIN: 'Pledges : Active Pledges',

    LANDED: 'Landed',
}

export const PAUSED_PLEDGES_EVENTS = {
    DOMAIN: 'Pledges : Paused Pledges',

    LANDED: 'Landed',
}

export const PLEDGE_HISTORY_EVENTS = {
    DOMAIN: 'Pledges : Pledge History',

    LANDED: 'Landed',
}

export const logActivePledges = makeLogger(PLEDGES_EVENTS.DOMAIN)
export const logPausedPledges = makeLogger(PAUSED_PLEDGES_EVENTS.DOMAIN)
export const logPledgeHistory = makeLogger(PLEDGE_HISTORY_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/pledges.js