import { makeLogger } from './logger'

export const CREATOR_SELL_PAGE_EVENTS = {
    DOMAIN: 'Creator Sell Page',
    LANDED: 'Landed',
    CLICKED_CREATE_PAGE_CTA: 'Clicked Create Page CTA',
    CLICKED_VIDEO: 'Clicked Video',
    CLICKED_CATEGORY: 'Clicked Category',
}

export const logCreatorSellPageEvent = makeLogger(CREATOR_SELL_PAGE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/creator-sell-page.js