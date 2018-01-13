import { makeLogger } from './logger'

export const EXPLORE_PAGE_EVENTS = {
    DOMAIN: 'Explore',

    LANDED: 'Landed',
    CAROUSEL_CLICKED_IMAGE: 'Carousel : Clicked Profile Image',
    CAROUSEL_CLICKED_VIEW: 'Carousel : Clicked Main CTA',

    CLICKED_CATEGORY: 'Clicked Category',

    CLICKED_POPULAR_CREATOR: 'Popular : Clicked Creator Card',
    CLICKED_NEW_CATEGORY: 'New : Clicked Creator Card',

    CATEGORIES_CLICKED_CREATOR: 'Categories : Clicked Creator',
    CATEGORIES_CLICKED_BACK: 'Categories : Clicked Back',
    CATEGORIES_SWITCHED_CATEGORY: 'Categories : Switched Category',

}

export const logExplorePageEvent = makeLogger(EXPLORE_PAGE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/explore-page.js