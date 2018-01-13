import { makeLogger } from './logger'

export const CREATOR_PAGE_EVENTS = {
    DOMAIN: 'Creator Page',

    LANDED: 'Landed',
    SELECT_REWARD: 'Select Reward',
    BECOME_PATRON: 'Become Patron',
    RESUME_PLEDGE: 'Resume Pledge',
    ACCEPT_NEW_PAGE: 'Accept New Page',

    SECTIONS_SWITCHED: 'Sections : Switched Section',

    CAMPAIGN_INFO_OPENED_SHARE: 'Campaign Info : Opened Share Menu',
    CAMPAIGN_INFO_OPENED_MORE: 'Campaign Info : Opened More Menu',
    CAMPAIGN_INFO_OPENED_BLOCK_MODAL: 'Campaign Info : Opened Block Modal',
    CAMPAIGN_INFO_OPENED_UNBLOCK_MODAL: 'Campaign Info : Opened Unblock Modal',
    CAMPAIGN_INFO_OPENED_MESSAGE: 'Campaign Info : Opened New Message',

    EARNINGS_VISIBILITY_SUBMITTED: 'Earnings Visibility : Submitted',

    CLICKED_POST: 'Clicked Post',
    CREATED_PATRON_POST: 'Created Patron Post',
    LOADED_NEXT_PAGE: 'Loaded Next Page',

    EXPLAIN_PATREON_MODAL_DISPLAYED: 'Explain Patreon Modal : Displayed',
    EXPLAIN_PATREON_MODAL_CLOSED: 'Explain Patreon Modal : Closed',

    /* This is for when they actually click to share on facebook or wherever */
    SHARE: 'Share',

    GOALS_SWITCH: 'Goals : Switch Goal',
    GOALS_SHOW_ALL: 'Goals : Show All',
    GOALS_SELECT: 'Goals : Select Goal',

    MINI_MAKE_A_POST_OPEN: 'Mini Make A Post : Open',
    MINI_MAKE_A_POST_PUBLISH: 'Mini Make A Post : Publish Post',

    FEATURED_TAGS_CARD_TAG_CLICKED: 'Featured Tags Card : Clicked Featured Tag',

    POSTS_FILTER_EXPANDED: 'Posts Filter : Expanded Filter Card',
    POSTS_FILTER_SELECTED_ALL_POSTS: 'Posts Filter : Selected All Posts',
    POSTS_FILTER_SELECTED_FEATURED_TAG_FILTER:
        'Posts Filter : Selected Featured Tag Filter',
    POSTS_FILTER_SELECTED_TAG_FILTER: 'Posts Filter : Selected Tag Filter',
    POSTS_FILTER_SELECTED_TYPE_FILTER: 'Posts Filter : Selected Type Filter',
    POSTS_FILTER_OPENED_MONTH_DROPDOWN: 'Posts Filter : Opened Month Dropdown',
    POSTS_FILTER_SELECTED_MONTH_FILTER: 'Posts Filter : Selected Month Filter',

    POST_CLICKED_TAG: 'Post : Clicked Tag',

    THANK_YOU_LANDED: 'Thank You : Landed',
    THANK_YOU_CLICKED_OK: 'Thank You : Clicked OK',
    THANK_YOU_DISMISSED: 'Thank You : Dismissed',

    PATRON_TOUR_FEED_LANDED: 'Patron Tour : Feed : Landed',
    PATRON_TOUR_FEED_DISMISSED: 'Patron Tour : Feed : Dismissed',
    PATRON_TOUR_FEED_NEXT: 'Patron Tour : Feed : Next',
    PATRON_TOUR_FILTERS_LANDED: 'Patron Tour : Filters : Landed',
    PATRON_TOUR_FILTERS_DISMISSED: 'Patron Tour : Filters : Dismissed',
    PATRON_TOUR_FILTERS_NEXT: 'Patron Tour : Filters : Next',

    CLICKED_LENS: 'Clicked Lens',
}

export const logCreatorPageEvent = makeLogger(CREATOR_PAGE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/creator-page.js