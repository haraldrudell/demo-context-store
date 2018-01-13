import { logEvent } from './logger'
import { camelize } from 'humps'

export const CONCIERGE_DOMAIN = 'Concierge'
export const CONCIERGE_PAGES = {
    START_PAGE: 'Start Page',
    NAME_PAGE: 'Name',
    PLURAL: 'Plural',
    AUTH: 'Auth',
    CATEGORY: 'Category',
    REWARDS: 'Rewards : Standard',
    REWARDS_STRETCH: 'Rewards : Premium',
    NSFW: 'NSFW',
    CREATE: 'Create',
    PAYMENT_SCHEDULE: 'Payment Schedule',
    CREATION_NAME: 'Payment Schedule : Creation Name',
    LINKS: 'Links',
    OUTRO: 'Outro',
    EARNINGS: 'Earnings',
    FINISH_INSPIRATION: 'Finish Inspiration',
    CLASSIFICATION: 'Classification',
}
export const CONCIERGE_NONPAGE_EVENTS = {
    FORWARD: 'Forward',
    BACK: 'Back',
    SKIP: 'Skip',
}

const SUB_EVENTS = ['Submitted', 'Landed', 'Error', 'Success']

function _logConcierge(event, info) {
    const e = {
        domain: CONCIERGE_DOMAIN,
        title: event,
    }
    if (info) {
        e.info = info
    }
    logEvent(e)
}

// Use like:
// _logConcierge.paymentSchedule.landed();
// _logConcierge.outro.submitted();
Object.keys(CONCIERGE_PAGES).forEach(eventName => {
    const thisEvent = camelize(eventName.toLowerCase())
    _logConcierge[thisEvent] = {}
    SUB_EVENTS.forEach(subEvent => {
        _logConcierge[thisEvent][subEvent.toLowerCase()] = _logConcierge.bind(
            null,
            CONCIERGE_PAGES[eventName] + ' : ' + subEvent,
        )
    })
})

// Use like:
// _logConcierge.back()
Object.keys(CONCIERGE_NONPAGE_EVENTS).forEach(eventName => {
    const thisEvent = camelize(eventName.toLowerCase())
    _logConcierge[thisEvent] = _logConcierge.bind(
        null,
        CONCIERGE_NONPAGE_EVENTS[eventName],
    )
})

// Use like:
// _logConcierge.skipPage('start')
_logConcierge.skipPage = skippedPage => {
    _logConcierge.skip({ 'previous step': skippedPage })
}

/*
 * Extra methods for rewards suggestions
 */

function rewardsSubmitted(page, numberOfRewards, rewardIds) {
    _logConcierge(page + ' : ' + 'Submitted', {
        number_of_rewards: numberOfRewards,
        reward_ids: rewardIds,
    })
}
function rewardsSuggest(page, amountCents) {
    _logConcierge(page + ' : ' + 'Suggest', { reward_tier: amountCents })
}
function rewardsDismiss(page, suggestionId, amountCents) {
    _logConcierge(page + ' : ' + 'Dismiss', {
        suggestion_id: suggestionId,
        reward_tier: amountCents,
    })
}

// Use like:
// _logConcierge.rewards.submitted(2,[720, 12])
_logConcierge.rewardsStretch.submitted = rewardsSubmitted.bind(
    null,
    CONCIERGE_PAGES.REWARDS_STRETCH,
)
_logConcierge.rewards.submitted = rewardsSubmitted.bind(
    null,
    CONCIERGE_PAGES.REWARDS,
)

// Use like:
// _logConcierge.rewards.suggest(100)
_logConcierge.rewardsStretch.suggest = rewardsSuggest.bind(
    null,
    CONCIERGE_PAGES.REWARDS_STRETCH,
)
_logConcierge.rewards.suggest = rewardsSuggest.bind(
    null,
    CONCIERGE_PAGES.REWARDS,
)

// Use like:
// _logConcierge.rewards.dismiss(74032, 100)
_logConcierge.rewardsStretch.dismiss = rewardsDismiss.bind(
    null,
    CONCIERGE_PAGES.REWARDS_STRETCH,
)
_logConcierge.rewards.dismiss = rewardsDismiss.bind(
    null,
    CONCIERGE_PAGES.REWARDS,
)

export const logConcierge = _logConcierge



// WEBPACK FOOTER //
// ./app/analytics/concierge.js