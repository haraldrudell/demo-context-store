import { makeLogger } from './logger'

export const CATEGORY_PAGE_EVENTS = {
    DOMAIN: 'Category Page',

    LANDED: 'Landed',
    CLICKED_HERO_CTA: 'Clicked Hero CTA',
    CLICKED_BOTTOM_CTA: 'Clicked Bottom CTA',
    CLICKED_VIDEO: 'Clicked Watch Video',
}

export const logCategoryPageEvent = makeLogger(CATEGORY_PAGE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/category-page.js