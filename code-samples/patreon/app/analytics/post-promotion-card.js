import { makeLogger } from './logger'

export const POST_PROMOTION_CARD_EVENTS = {
    DOMAIN: 'Post Promotion Card',

    /**
     * Is this coming from /home or cpv2
     */
    SOURCE_CPV2: 'cpv2',
    SOURCE_HOME: 'home',

    /**
     * Useful to track when a card is rendered in the post feed (which is randomized)
     * so we can see when a user doesn't click through one.
     */
    RENDERED: 'Rendered Promotion Card',

    CLICKED: 'Clicked Promotion Link'
}

export const logPostPromotionCardEvent = makeLogger(POST_PROMOTION_CARD_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/post-promotion-card.js