import { makeLogger } from './logger'

export const NOTIFICATIONS_EVENTS = {
    DOMAIN: 'Notifications',

    LANDED: 'Landed',
    CLICKED_NOTIFICATION: 'Clicked Notification',
    CLICKED_SHOW_MORE: 'Clicked Show More',
}

export const NOTIFICATION_TYPES = {
    COMMENTS: 'comment',
    LIKES: 'likes-notification',
    PLEDGES: 'pledges-notification',
    CHARGING_CREATOR: 'charging',
    CHARGING_PATRON: 'charging_patron',
}

export const logNotificationsEvent = makeLogger(NOTIFICATIONS_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/notifications.js