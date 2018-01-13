import { makeLogger } from './logger'

export const PATRON_PROFILE_EVENTS = {
    DOMAIN: 'Patron Profile',

    CLICKED_MESSAGE: 'Clicked Message',
    OPENED_BLOCK_MODAL: 'Opened Block Modal',
    OPENED_UNBLOCK_MODAL: 'Opened Unblock Modal',
    CLICKED_SOCIAL_LINK: 'Clicked Social Link',

    CREATORS_TAB_LANDED: 'Creators : Landed',
    CLICKED_SUPPORTED_CREATOR: 'Clicked Supported Creator',
    CLICKED_FOLLOWED_CREATOR: 'Clicked Followed Creator',

    COMMENTS_TAB_LANDED: 'Comments : Landed',
    COMMENT_CLICKED_POST_TITLE: 'Comments : Clicked Post Title',
    COMMENT_CLICKED_POST_IMAGE: 'Comments : Clicked Post Image',
    COMMENT_CLICKED_CREATOR: 'Comments : Clicked Creator',

    LIKES_TAB_LANDED: 'Likes : Landed',
    LIKE_CLICKED_POST_TITLE: 'Likes : Clicked Post Title',
    LIKE_CLICKED_POST_IMAGE: 'Likes : Clicked Post Image',
    LIKE_CLICKED_CREATOR: 'Likes : Clicked Creator',

    ABOUT_TAB_LANDED: 'About : Landed',
}

export const logPatronProfileEvent = makeLogger(PATRON_PROFILE_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/patron-profile.js