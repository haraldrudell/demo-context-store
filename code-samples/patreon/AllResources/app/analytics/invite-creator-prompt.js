import { makeLogger } from './logger'

export const INVITE_CREATOR_PROMPT_EVENTS = {
    DOMAIN: 'Invite Creator Prompt',

    SOURCE_HOME: 'home',
    SOURCE_DASHBOARD: 'dashboard',

    RENDERED: 'Rendered Invite Creator Prompt',

    INVITE_CREATOR_CLICKED: 'Clicked Invite Creator',
    REMIND_LATER_CLICKED: 'Clicked Promotion Link',
    DISMISS_CLICKED: 'Clicked Dismiss'
}

export const logInviteCreatorPromptEvent = makeLogger(INVITE_CREATOR_PROMPT_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/invite-creator-prompt.js