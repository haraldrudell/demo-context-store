import { logEvent } from './logger'

export const MAKE_A_POST_V2_EVENTS = {
    DOMAIN:                             'Make a Post',

    //Major subdomains
    //Drafts : Delete Post
    //Drafts : Edit Post
    //etc...
    DRAFTS:                             'Drafts',
    SCHEDULED:                          'Scheduled',
    PUBLISHED:                          'Published',
    EDITOR:                             'Editor',
    ADD_ATTACHMENT:                     'Add Attachment',
    TAGS:                               'Tags',
    SET_AUDIENCE:                       'Set Audience',
    UNSCHEDULED:                        'Unscheduled',
    SAVE_DRAFT:                         'Save Draft',
    EMBED:                              'Embed',
    UPLOAD_THUMBNAIL:                   'Upload Thumbnail',
    UPLOAD_POST_FILE:                   'Upload Post File',

    //Keys:
    CLICKED_POST_TYPE:                  'Clicked Post Type',
    CLICKED_DELETE:                     'Clicked Delete',
    CLICKED_EDIT:                       'Clicked Edit',
    CLICKED_MAKE_A_POST:                'Clicked Make A Post',
    CLICKED_DISMISS:                    'Clicked Dismiss',
    CANCELLED:                          'Cancelled',
    LANDED:                             'Landed',
    CLICKED:                            'Clicked',
    SUBMITTED:                          'Submitted',
    ERROR:                              'Error',
    SUCCESS:                            'Success',
    INVALID:                            'Invalid',
    ADD:                                'Add',
    DELETE:                             'Delete',

    //Keys: (under Editor subdomain)
    INSERT_INLINE_IMAGE_CLICKED:        'Insert Inline Image : Clicked',
    INSERT_INLINE_IMAGE_PREVIEWED:      'Insert Inline Image : Previewed',
    INSERT_INLINE_IMAGE_SUCCESS:        'Insert Inline Image : Success',

    RENDERED_EARLY_ACCESS:              'Rendered Early Access Popover',
}

export function logMakeAPostV2Event(subdomains, info) {
    //Events are logged by concatenating the subdomains, delimited by a ' : '
    const event = {
        domain: MAKE_A_POST_V2_EVENTS.DOMAIN,
        title: subdomains.join(' : ')
    }
    if (info) {
        event.info = info
    }
    logEvent(event)
}



// WEBPACK FOOTER //
// ./app/analytics/make-a-post-v2.js