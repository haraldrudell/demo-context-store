import { makeLogger } from './logger'

export const PLEDGE_COMPLETE_EVENTS = {
    DOMAIN: 'Pledge Complete',

    LANDED: 'Landed',

    CLICKED_SHARE_BUTTON: 'Clicked Share Button',
    CLICKED_RELATED_CREATOR: 'Clicked Related Creator',

    CLICKED_MODAL_SHARE_FACEBOOK: 'Clicked Modal Share Facebook',
    CLICKED_MODAL_SHARE_TWITTER: 'Clicked Modal Share Twitter',
    CLICKED_MODAL_RECOMMEND_CREATOR: 'Clicked Modal Recommend Creator',
    CLICKED_MODAL_START_PAGE: 'Clicked Modal Start Page',

    CLICKED_MODAL_NEXT: 'Clicked Modal Next',
    CLICKED_MODAL_DONE: 'Clicked Modal Done'
}

export const logPledgeCompleteEvent = makeLogger(PLEDGE_COMPLETE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/pledge-complete.js