import { makeLogger } from './logger'

export const PLATFORM_LANDING_PAGE_EVENTS = {
    DOMAIN: 'Platform Landing Page',

    LANDED: 'Landed',

    CLICKED_APP_DIRECTORY: 'Clicked App Directory',
    CLICKED_DEVELOPER_PORTAL: 'Clicked Developer Portal',
}

export const logPlatformLandingPageEvent = makeLogger(
    PLATFORM_LANDING_PAGE_EVENTS.DOMAIN,
)



// WEBPACK FOOTER //
// ./app/analytics/platform-landing-page.js