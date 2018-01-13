import { makeLogger } from './logger'

export const MAKE_POST_EVENTS = {
    DOMAIN: 'Make a Post',

    CLICKED_PUBLISH_ERROR:              'Clicked Publish: Error',
    CLICKED_PUBLISH_SUCCESS:            'Clicked Publish: Success',
    CLICKED_EDIT:                       'Clicked Edit',
    CLICKED_DELETE:                     'Clicked Delete',
    LANDED:                             'Landed',

    ADDED_EMBED:                        'Added Embed',

    DRAFTS_LOADED_DRAFT:                'Drafts : Loaded Draft',

    CLICKED_SAVE_DRAFT:                 'Clicked Save Draft',
    LOADED_POST:                        'Loaded Post',

    CLICKED_DISCARD_DRAFT:              'Clicked Discard Draft',

    DRAFTS_LANDED:                      'Drafts : Landed',

    FOCUSED_TAG_FIELD:                  'Tags : Focused Tag Field'
}

export const logMakeAPostEvent = makeLogger(MAKE_POST_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/make-a-post.js