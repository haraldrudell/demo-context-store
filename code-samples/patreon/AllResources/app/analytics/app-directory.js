import { makeLogger } from './logger'

export const APP_DIRECTORY_EVENTS = {
    DOMAIN: 'App Directory',

    LANDED: 'Landed',

    CATEGORIES_SWITCHED_CATEGORY: 'Categories : Switched Category',

    CLICKED_BUILD_ON_PATREON: 'Clicked Build On Patreon',
    CLICKED_APP: 'Clicked App',
}

export const APP_PAGE_EVENTS = {
    DOMAIN: 'App Page',

    LANDED: 'Landed',

    CLICKED_HERO_CTA: 'Clicked Hero CTA',
}

export const logAppDirectoryEvent = makeLogger(APP_DIRECTORY_EVENTS.DOMAIN)
export const logAppPageEvent = makeLogger(APP_PAGE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/app-directory.js