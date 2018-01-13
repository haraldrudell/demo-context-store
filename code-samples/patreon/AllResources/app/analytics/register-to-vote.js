import { makeLogger } from './logger'

export const VOTE_EVENTS = {
    DOMAIN: 'Voter Registration Alert',
    ALERT_DISPLAYED: 'Alert Displayed',
    CLICKED_OK_LETS: 'Clicked Ok Lets',
    CLICKED_REGISTER_TO_VOTE: 'Clicked Register To Vote',
    DISMISS_MODAL: 'Dismiss Modal'
}

export const logVoteEvent = makeLogger(VOTE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/register-to-vote.js