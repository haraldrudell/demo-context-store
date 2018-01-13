import {
    SETTINGS_PAGE_EVENTS,
} from 'analytics'

export default function getSettingsPageLinks() {
    return [{
        url: '/edit',
        name: 'Edit Creator Page',
        domain: SETTINGS_PAGE_EVENTS.DOMAIN,
        event: SETTINGS_PAGE_EVENTS.CLICKED_SUBPAGE,
        isCreatorOnly: true,
    }, {
        url: '/settings/profile',
        name: 'Profile',
        domain: SETTINGS_PAGE_EVENTS.DOMAIN,
        event: SETTINGS_PAGE_EVENTS.CLICKED_SUBPAGE,
    }, {
        url: '/settings/account',
        name: 'Account',
        domain: SETTINGS_PAGE_EVENTS.DOMAIN,
        event: SETTINGS_PAGE_EVENTS.CLICKED_SUBPAGE,
    }, {
        url: '/settings/payment',
        name: 'Payment Methods',
        domain: SETTINGS_PAGE_EVENTS.DOMAIN,
        event: SETTINGS_PAGE_EVENTS.CLICKED_SUBPAGE,
    }, {
        url: '/settings/payout',
        name: 'Payout Preferences',
        domain: SETTINGS_PAGE_EVENTS.DOMAIN,
        event: SETTINGS_PAGE_EVENTS.CLICKED_SUBPAGE,
    }, {
        url: '/settings/email',
        name: 'Email Settings',
        domain: SETTINGS_PAGE_EVENTS.DOMAIN,
        event: SETTINGS_PAGE_EVENTS.CLICKED_SUBPAGE,
    }]
}



// WEBPACK FOOTER //
// ./app/pages/settings/subnavigation-links.js