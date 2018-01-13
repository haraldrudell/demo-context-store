import { logEvent } from './logger'

export const YOUTUBE_LIVESTREAM_EVENTS = {
    DOMAIN: 'YouTube',

    // Events on postType selector page
    CLICKED_DISMISS_POPOVER: 'Clicked Dismiss Popover',

    // Events on YT education page
    LANDED_EDUCATION_PAGE: 'Education Page',
    CLICKED_I_MEET_ALL_REQUIREMENTS: 'Clicked I Meet All Requirements',
    CLICKED_SET_UP_MY_LIVESTREAM_ACCOUNT:
        'Clicked Set Up My Livestream Account',
    CLICKED_CONTINUE_WITH_YOUTUBE: 'Clicked Continue with YouTube',
    CLICKED_LEARN_MORE: 'Clicked Learn More',

    // Events on post editor
    CLICKED_START_UNLISTED_LIVESTREAM: 'Clicked Start Unlisted Livestream Link',
    CLICKED_START_UNLISTED_LIVESTREAM_MODAL:
        'Clicked Continue to Youtube to Livestream',

    CLICKED_SHOW_ME_URL: 'Clicked Show Me URL link',
    CLICKED_FOUND_URL_MODAL: 'Clicked Found URL',

    CLICKED_LIVESTREAM_GUIDE_FOOTER: 'Clicked Livestream Guide Footer Link',
    CLICKED_YOUTUBE_SUPPORT: 'Clicked YouTube Support Footer Link',
}

export function logYoutubeEvent(subdomains, info) {
    //Events are logged by concatenating the subdomains, delimited by a ' : '
    const event = {
        domain: YOUTUBE_LIVESTREAM_EVENTS.DOMAIN,
        title: subdomains.join(' : '),
    }
    if (info) {
        event.info = info
    }
    logEvent(event)
}



// WEBPACK FOOTER //
// ./app/analytics/youtube.js