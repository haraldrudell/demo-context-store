import { makeLogger } from './logger'

export const INDEX_PAGE_EVENTS = {
    DOMAIN: 'Index Page',

    JOIN_US: 'Click Join Us',

    // events for redesigned index page
    DOMAIN_V2: 'Index Page',

    LANDED: 'Landed',
    CLICKED_HERO_CTA: 'Clicked Hero CTA',
    CLICKED_BOTTOM_CTA: 'Clicked Bottom CTA',
    CLICKED_WHAT_IS_PATREON: 'Clicked What is Patreon',
    TESTIMONIALS_CLICKED_CYCLE: 'Testimonials : Clicked Cycle',
    CATEGORIES_CLICKED_RIGHT: 'Categories : Clicked Right',
    CATEGORIES_CLICKED_LEFT: 'Categories : Clicked Left',
    CATEGORIES_CLICKED_CATEGORY: 'Categories : Clicked Category',
    CATEGORIES_CLICKED_CREATOR: 'Categories : Clicked Creator'
}

export const logIndexPageEvent = makeLogger(INDEX_PAGE_EVENTS.DOMAIN)
export const logIndexPageV2Event = makeLogger(INDEX_PAGE_EVENTS.DOMAIN_V2)



// WEBPACK FOOTER //
// ./app/analytics/index-page.js