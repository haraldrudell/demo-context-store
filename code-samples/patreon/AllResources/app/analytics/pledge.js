import { makeLogger } from './logger'

export const PLEDGE_EVENTS = {
    DOMAIN: 'Pledge Flow',

    LANDED: 'Landed',

    EDITED_PLEDGE_AMOUNT: 'Edited pledge amount',
    EDITED_CAP_AMOUNT: 'Edited cap amount',

    DELETE_CLICKED: 'Delete : Clicked',
    DELETE_CONFIRMED: 'Delete : Confirm',
    PAUSE_CLICKED: 'Pause : Clicked',
    PAUSE_CONFIRMED: 'Pause : Confirm',
    RESUME_CLICKED: 'Resume : Clicked',
    RESUME_CONFIRMED: 'Resume : Confirm',
    SELECT_REWARD_SUBMITTED: 'Select Reward : Submitted',
    SELECT_REWARD_LANDED: 'Select Reward : Landed',
    SELECT_REWARD_EDIT: 'Select Reward : Edit',
    SELECTED_REWARD_TIER: 'Select Reward : Selected different reward tier',
    CONFIRM_SUBMITTED: 'Confirm : Submitted',
    CONFIRM_LANDED: 'Confirm : Landed',
    ADD_CREDIT_CARD: 'Clicked add a new credit card',
    ADD_PAYPAL: 'Clicked add a new paypal'
}

export const PLEDGE_ENTRY_POINTS = {
    BECOME_PATRON_BUTTON: 'Clicked "Become a Patron" button',
    SELECT_REWARD_TIER: 'Clicked a reward tier'
}

export const logPledgeFlow = makeLogger(PLEDGE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/pledge.js