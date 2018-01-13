import { makeLogger } from './logger'

export const POST_EXCLUSIVE_CARD_EVENTS = {
    DOMAIN: 'Post Exclusive Card',

    /**
     * Useful to track when a card is rendered in the post feed
     * so we can see when a user doesn't click through one.
     */
    RENDERED: 'Rendered Exclusive Card',
    CLICKED_EXPLAIN_LOCKED_POST: 'Clicked Explain Locked Post',
    CLICKED: 'Clicked Exclusive Link'
}

export const logPostExclusiveCardEvent = makeLogger(POST_EXCLUSIVE_CARD_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/post-exclusive-card.js