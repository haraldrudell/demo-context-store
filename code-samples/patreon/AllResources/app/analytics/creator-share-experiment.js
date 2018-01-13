import { makeLogger } from './logger'

export const CREATOR_SHARE_EXPERIMENT_EVENTS = {
    DOMAIN: 'Creator Share Experiment',
    CLICKED_FACEBOOK_SHARE_BUTTON: 'Clicked Facebook Share Button',
    CLICKED_TWITTER_SHARE_BUTTON: 'Clicked Twitter Share Button'
}

export const logCreatorShareExperimentEvent = makeLogger(CREATOR_SHARE_EXPERIMENT_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/creator-share-experiment.js