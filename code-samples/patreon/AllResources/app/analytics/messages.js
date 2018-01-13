import { makeLogger } from './logger'

export const MESSAGES_EVENTS = {
    DOMAIN: 'Messages',

    LANDED: 'Landed',
    FOCUSED: 'Focused',
    CREATED_CONVERSATION: 'Created Conversation',
    SENT_MESSAGE: 'Sent Message'
}

export const logMessagesEvent = makeLogger(MESSAGES_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/messages.js