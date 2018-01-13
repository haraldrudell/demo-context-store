import { makeLogger } from './logger'

export const COMPLETE_YOUR_PAGE_EXPERIMENT_EVENTS = {
    DOMAIN: 'Complete Your Page Experiment',

    GOALS_CLICKED: 'Goals : Clicked',
    GOALS_SUCCESS: 'Goals : Success',

    REWARDS_CLICKED: 'Rewards : Clicked',
    REWARDS_SUCCESS: 'Rewards : Success',

    DESCRIPTION_CLICKED: 'Description : Clicked',
    DESCRIPTION_SUCCESS: 'Description : Success'
}

export const logCompleteYourPageEvent = makeLogger(COMPLETE_YOUR_PAGE_EXPERIMENT_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/complete-your-page-experiment.js