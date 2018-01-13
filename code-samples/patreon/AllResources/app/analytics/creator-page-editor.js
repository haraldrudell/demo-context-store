import { makeLogger } from './logger'

export const CREATOR_PAGE_EDITOR_EVENTS = {
    DOMAIN: 'Campaign : Edit',

    LANDED: 'Landed',

    PROFILE_PHOTO_SUBMITTED: 'Profile Photo : Submitted',
    PROFILE_PHOTO_ERROR: 'Profile Photo : Error',
    PROFILE_PHOTO_SUCCESS: 'Profile Photo : Success',

    COVER_PHOTO_SUBMITTED: 'Cover Photo : Submitted',
    COVER_PHOTO_ERROR: 'Cover Photo : Error',
    COVER_PHOTO_SUCCESS: 'Cover Photo : Success',

    THANK_YOU_LANDED: 'Thank You : Landed',
    THANK_YOU_SUBMITTED: 'Thank You : Submitted',
    THANK_YOU_ERROR: 'Thank You : Error',
    THANK_YOU_SUCCESS: 'Thank You : Success',

    GOALS_CLICKED: 'Goals : Clicked',
    GOALS_LANDED: 'Goals : Landed',
    GOALS_SUBMITTED: 'Goals : Submitted',
    GOALS_ERROR: 'Goals : Error',
    GOALS_SUCCESS: 'Goals : Success',

    REWARDS_CLICKED: 'Rewards : Clicked',
    REWARDS_LANDED: 'Rewards : Landed',
    REWARDS_SUBMITTED: 'Rewards : Submitted',
    REWARDS_ERROR: 'Rewards : Error',
    REWARDS_SUCCESS: 'Rewards : Success',

    REWARDS_CLICKED_EXIT_TO_EDITOR: 'Rewards : Clicked "Exit to Editor"',
    REWARDS_CLICKED_DELETE: 'Rewards : Clicked Delete',
    REWARDS_CLICKED_UNPUBLISH: 'Rewards : Clicked "Unpublish reward tier"',
    REWARDS_CLICKED_TOGGLE_PUBLISHED:
        'Rewards : Clicked "Toggle reward tier published state"',
    REWARDS_CLICKED_ADD_NEW_REWARD: 'Rewards : Clicked "Add a new reward tier"',
    REWARDS_CLICKED_CUSTOMIZE_REWARD:
        'Rewards : Clicked "Customize reward tier"',
    REWARDS_CLICKED_CREATE_CUSTOM_REWARD:
        'Rewards : Clicked "Create a custom reward tier"',

    ITEMS_ERROR: 'Items : Error',
    ITEMS_SUCCESS: 'Items : Success',
    ITEMS_SUBMITTED: 'Items : Submitted',
    ITEMS_CLICKED_DELETE: 'Items : Clicked Delete',

    PAGE_SETTINGS_LANDED: 'Settings : Landed',
    PAGE_SETTINGS_SUBMITTED: 'Settings : Submitted',
    PAGE_SETTINGS_ERROR: 'Settings : Error',
    PAGE_SETTINGS_SUCCESS: 'Settings : Success',

    PAYMENT_SETTINGS_LANDED: 'Payments : Landed',
    PAYMENT_SETTINGS_SUBMITTED: 'Payments : Submitted',
    PAYMENT_SETTINGS_ERROR: 'Payments : Error',
    PAYMENT_SETTINGS_SUCCESS: 'Payments : Success',

    DETAILS_LANDED: 'Details : Landed',
    DETAILS_SUBMITTED: 'Details : Submitted',
    DETAILS_ERROR: 'Details : Error',
    DETAILS_SUCCESS: 'Details : Success',

    LINKS_LANDED: 'Links : Landed',
    LINKS_SUBMITTED: 'Links : Submitted',
    LINKS_ERROR: 'Links : Error',
    LINKS_SUCCESS: 'Links : Success',

    DESCRIPTION_CLICKED: 'Description : Clicked',
    DESCRIPTION_LANDED: 'Description : Landed',
    DESCRIPTION_SUBMITTED: 'Description : Submitted',
    DESCRIPTION_ERROR: 'Description : Error',
    DESCRIPTION_SUCCESS: 'Description : Success',

    PREFERENCES_PHOTOS_LANDED: 'Preferences and Photos : Landed',
    PREFERENCES_PHOTOS_SUBMITTED: 'Preferences and Photos : Submitted',
    PREFERENCES_PHOTOS_ERROR: 'Preferences and Photos : Error',
    PREFERENCES_PHOTOS_SUCCESS: 'Preferences and Photos : Success',

    PREVIEW_LINK_CLICKED: 'Preview Link : Clicked',
    PREVIEW_LINK_COPIED: 'Preview Link : Copied',

    PREVIEW_LINK_GENERATE_SUBMITTED: 'Preview Link : Generate : Submitted',
    PREVIEW_LINK_GENERATE_ERROR: 'Preview Link : Generate : Error',
    PREVIEW_LINK_GENERATE_SUCCESS: 'Preview Link : Generate : Success',

    PREVIEW_LINK_DESTROY_SUBMITTED: 'Preview Link : Destroy : Submitted',
    PREVIEW_LINK_DESTROY_ERROR: 'Preview Link : Destroy : Error',
    PREVIEW_LINK_DESTROY_SUCCESS: 'Preview Link : Destroy : Success',

    LAUNCH_SUBMITTED: 'Launch : Submitted',

    CHARGE_UPFRONT_ENABLE_CLICKED: 'Charge Up Front : Clicked',
    CHARGE_UPFRONT_PHONE_NUMBER_ADDED: 'Charge Up Front : Phone Number Added',
    CHARGE_UPFRONT_PHONE_NUMBER_VERIFIED:
        'Charge Up Front : Phone Number Verified',
}

export const logCreatorPageEditorEvent = makeLogger(
    CREATOR_PAGE_EDITOR_EVENTS.DOMAIN,
)

export const POST_LAUNCH_EVENTS = {
    DOMAIN: 'Post-Launch Tips',

    // This event triggers once per page load whenever the email field in the
    // send invite form is modified for the first time.
    CHANGED_EMAIL_FIELD: 'Changed Email Field',
    SEND_INVITE: 'Send Patron Email',
    IMPORT_CONTACTS: 'Import Contacts',
    EMAIL_INVALID: 'Email Validation Error',

    POST_LAUNCH_SOCIAL_LANDED: 'Social : Landed',
    POST_LAUNCH_SOCIAL_COPY_LINK: 'Social : Copy Link',
    POST_LAUNCH_SOCIAL_CLICKED_SHOW_MORE: 'Social : Clicked Show More',
    POST_LAUNCH_SOCIAL_SHARE: 'Social : Share',
    POST_LAUNCH_SOCIAL_CLICKED_BACK: 'Social : Clicked Back',

    POST_LAUNCH_LINK_LANDED: 'Links : Landed',
    POST_LAUNCH_LINK_COPY_LINK: 'Links : Copy Link',
    POST_LAUNCH_LINK_CLICKED_BACK: 'Link : Clicked Back',

    POST_LAUNCH_EMAIL_LANDED: 'Email : Landed',
    POST_LAUNCH_EMAIL_CLICKED_BACK: 'Email : Clicked Back',

    POST_LAUNCH_RESOURCES_LANDED: 'Resources : Landed',
    POST_LAUNCH_RESOURCES_CLICKED: 'Resources : Clicked',
    POST_LAUNCH_RESOURCES_CLICKED_BACK: 'Resources : Clicked Back',

    POST_LAUNCH_SUBMIT_VANITY: 'Vanity : Submit Vanity',
    POST_LAUNCH_VANITY_URL_LANDED: 'Vanity : Landed',
    POST_LAUNCH_VANITY_URL_CLICKED_BACK: 'Vanity : Clicked Back',

    POST_LAUNCH_CLOSE_MODAL: 'Close Modal',

    /**
     * These were created for the post launch social experiment.
     * Attempted using existing LANDED and SHARE events, but think it's
     * causing issues w/ our funnel building in amplitude. Might be good to
     * always provide explicit events for experiments. - @drk
     */
    POST_LAUNCH_SOCIAL_LANDED_FACEBOOK: 'Social : Landed Facebook',
    POST_LAUNCH_SOCIAL_SHARE_FACEBOOK: 'Social : Share Facebook',
    POST_LAUNCH_SOCIAL_LANDED_TWITTER: 'Social : Landed Twitter',
    POST_LAUNCH_SOCIAL_SHARE_TWITTER: 'Social : Share Twitter',
}

export const logPostLaunchEvent = makeLogger(POST_LAUNCH_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/creator-page-editor.js