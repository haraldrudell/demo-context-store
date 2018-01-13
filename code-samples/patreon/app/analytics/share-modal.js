import { makeLogger } from './logger'

export const SHARE_MODAL_EVENTS = {
    DOMAIN: 'Share Modal',
    RENDERED: 'Rendered',
    CLICKED_SHARE: 'Clicked Share',
    CLOSED: 'Closed'
}

export const SUGGESTED_ACTION_EVENTS = {
    DOMAIN: 'Suggested Action Card',
    RENDERED: 'Rendered',
    CLICKED_BUTTON: 'Clicked Button',
    DISMISSED: 'Dismissed'
}

export const logShareModalEvent = makeLogger(SHARE_MODAL_EVENTS.DOMAIN)
export const logSuggestedActionEvent = makeLogger(SUGGESTED_ACTION_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/share-modal.js