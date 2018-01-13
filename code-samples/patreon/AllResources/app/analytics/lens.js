import { makeLogger } from './logger'

export const CLIP_EVENTS = {
    DOMAIN: 'Clip',

    ENTERED: 'Entered',
    SKIPPED: 'Skipped',
}

export const END_CARD_EVENTS = {
    DOMAIN: 'End Card',

    LANDED: 'Landed',
    DISMISSED: 'Dismissed',
    CLICKED_REPLAY: 'Clicked Replay Lens',
    CLICKED_BECOME_A_PATRON: 'Clicked Become a Patron',
}

export const LENS_LIGHTBOX_EVENTS = {
    DOMAIN: 'Lens Lightbox',

    OPENED: 'Opened',
    CLICKED_TEXT_APP: 'Clicked Text App',
}

export const MOBILE_WEB_EVENTS = {
    DOMAIN: 'Mobile Web',

    LANDED: 'Landed',
    CLICKED_OPEN_APP: 'Clicked Open App',
    CLICKED_GET_APP: 'Clicked Get App',
}

export const PHOTO_EVENTS = {
    DOMAIN: 'Photo',

    STARTED_LOADING: 'Started Loading',
    FINISHED_LOADING: 'Finished Loading',
}

export const STORY_EVENTS = {
    DOMAIN: 'Story',

    PLAYED: 'Played',
    DISMISSED: 'Dismissed',
}

export const VIDEO_EVENTS = {
    DOMAIN: 'Video',

    STARTED_BUFFERING: 'Started Buffering',
    FINISHED_BUFFERING: 'Finished Buffering',
}

export const logLensClipEvent = makeLogger(CLIP_EVENTS.DOMAIN)
export const logLensEndCardEvent = makeLogger(END_CARD_EVENTS.DOMAIN)
export const logLensLightboxEvent = makeLogger(LENS_LIGHTBOX_EVENTS.DOMAIN)
export const logLensMobileWebEvent = makeLogger(MOBILE_WEB_EVENTS.DOMAIN)
export const logLensPhotoEvent = makeLogger(PHOTO_EVENTS.DOMAIN)
export const logLensStoryEvent = makeLogger(STORY_EVENTS.DOMAIN)
export const logLensVideoEvent = makeLogger(VIDEO_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/lens.js