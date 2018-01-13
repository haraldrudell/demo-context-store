import { makeLogger } from './logger'

export const REWARD_ITEM_EVENTS = {
    DOMAIN: 'Reward Items',

    CREATED_CUSTOM_ITEM: 'Created Custom Item',
    CREATED_RECOMMENDED_ITEM: 'Created Recommended Item',
    CREATED_ITEM_FROM_RECOMMENDED_TIER: 'Created Item from Recommended Tier',

    ADDED_ITEM_TO_TIER: 'Added Item to Tier',
    REMOVED_ITEM_FROM_TIER: 'Removed Item from Tier',

    EDITED_ITEM: 'Edited Item',

    DELETED_ITEM: 'Deleted Item',

    ATTEMPTED_LONG_ITEM_TITLE: 'Attempted Item Title Exceeded Length Restrictions'
}

export const logRewardItemEvent = makeLogger(REWARD_ITEM_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/reward-items.js