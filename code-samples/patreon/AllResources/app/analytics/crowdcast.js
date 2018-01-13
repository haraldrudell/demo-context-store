import { logEvent } from './logger'

export const CROWDCAST_EVENTS = {
    DOMAIN: 'Crowdcast',

    //Major subdomains
    //Education Page : Clicked Get Started
    //Education Page : Clicked Learn More
    //etc...
    EDUCATION_PAGE: 'Education Page',
    OAUTH: 'Oauth',
    UPLOAD_COVER_PHOTO: 'Upload Cover Photo',
    LIVESTREAM_PREVIEW_MODAL: 'Livestream Preview Modal',
    MAKE_A_POST_EDITOR: 'Make a Post Editor',
    SCHEDULED: 'Scheduled',
    PUBLISH_MODAL: 'Publish Modal',

    //Keys:
    CLICKED_GET_STARTED: 'Clicked Get Started',
    CLICKED_LEARN_MORE: 'Clicked Learn More',
    CLICKED_UPLOAD_COVER_PHOTO: 'Clicked Upload Cover Photo',
    CLICKED_REMOVE_COVER_PHOTO: 'Clicked Remove Cover Photo',
    CLICKED_CREATE_LIVESTREAM: 'Clicked Create Livestream',
    CLICKED_OPEN_LIVESTREAM: 'Clicked Open Livestream',
    CLICKED_CONTINUE_TO_CROWDCAST: 'Clicked Continue to Crowdcast',
    CLICKED_TEST_LIVE_STREAM: 'Clicked Test Livestream',
    CLICKED_LIVESTREAM_GUIDE: 'Clicked Livestream Guide',
    CLICKED_SUPPORT: 'Clicked Support',
    CLICKED_PROMOTE: 'Clicked Promote',
    CLICKED_LATER: 'Clicked Later',
    CLICKED_MANAGE_ON_CROWDCAST: 'Clicked Manage on Crowdcast',
    // Elements render on screen
    RENDERED: 'Rendered',
    CLICKED: 'Clicked',
    ERROR: 'Error',
    SUCCESS: 'Success',
}

export function logCrowdcastEvent(subdomains, info) {
    //Events are logged by concatenating the subdomains, delimited by a ' : '
    const event = {
        domain: CROWDCAST_EVENTS.DOMAIN,
        title: subdomains.join(' : '),
    }
    if (info) {
        event.info = info
    }
    logEvent(event)
}



// WEBPACK FOOTER //
// ./app/analytics/crowdcast.js