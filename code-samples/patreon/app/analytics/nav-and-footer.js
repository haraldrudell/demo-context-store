import { makeLogger } from './logger'

// pre-america navigation
export const NAVBAR_EVENTS = {
    DOMAIN: 'NavBar',

    // New React events
    CLICKED_EXPLORE: 'Clicked Explore',
    CLICKED_SIGN_UP: 'Clicked Sign Up',
    CLICKED_LOG_IN: 'Clicked Log in',

    // Old angular Events
    SELECTED_DISCOVERY: 'Selected Discovery',
    SIGN_UP: 'Click Sign Up',
    LOG_IN: 'Click Log in',
    RENDERED_INVITE_FRIEND: 'Rendered Invite a Friend',
    RENDERED_BECOME_CREATOR: 'Rendered Become a Creator',
    RENDERED_VISIBILITY_POPOVER: 'Rendered Earnings Visibility Popover',

    // Shared by both
    CLICKED_INVITE_FRIEND: 'Clicked Invite a Friend',
    CLICKED_BECOME_CREATOR: 'Clicked Become a Creator',
    CLICKED_EDIT_VISIBILITY: 'Clicked Edit Number Visibility',
}

export const logNavBarEvent = makeLogger(NAVBAR_EVENTS.DOMAIN)

export const HEADER_EVENTS = {
    DOMAIN: 'Header Nav',

    // existing react events
    CLICKED_SIGN_UP: 'Clicked Sign Up',
    CLICKED_LOG_IN: 'Clicked Log in',

    // new with America
    CLICKED_CREATE_ON_PATREON: 'Clicked Create on Patreon',
    CLICKED_LOGO: 'Clicked Patreon Logo',
    CLICKED_HOME: 'Clicked Home Icon',
    CLICKED_MESSAGES: 'Clicked Messages Icon',
    CLICKED_FINISH_PAGE: 'Clicked Finish Page',
    CLICKED_EXPLORE_CREATORS: 'Clicked Expore Creators',
    CLICKED_YOUR_PROFILE: 'Clicked Your Profile',
    CLICKED_YOUR_PLEDGES: 'Clicked Your Pledges',
    CLICKED_INVITE_CREATORS: 'Clicked Invite Creators',
    CLICKED_SETTINGS: 'Clicked Settings',
    CLICKED_HELP_CENTER: 'Clicked Help Center',
    CLICKED_LOGOUT: 'Clicked Logout',

    RENDERED_INVITE_CREATORS: 'Rendered Invite Creators',
}

export const logHeaderNavEvent = makeLogger(HEADER_EVENTS.DOMAIN)

export const CREATOR_NAV_EVENTS = {
    DOMAIN: 'Creator Nav',

    CLICKED_AVATAR: 'Clicked Avatar',
    CLICKED_POST: 'Clicked Post',
    CLICKED_PATRONS: 'Clicked Patrons',
    CLICKED_DASHBOARD: 'Clicked Dashboard',
    CLICKED_NOTIFICATIONS: 'Clicked Notifications',
    CLICKED_MESSAGES: 'Clicked Messages',
    CLICKED_SETTINGS: 'Clicked Settings',
    CLICKED_INVITE_CREATORS: 'Clicked Invite Creators',

    // post subdomain
    POST_NEW: 'Post : Clicked New',
    POST_PUBLISHED: 'Post : Clicked Published',
    POST_SCHEDULED: 'Post : Clicked Scheduled',
    POST_DRAFTS: 'Post : Clicked Drafts',

    // patrons subdomain
    PATRONS_PATRON_MANAGER: 'Patrons : Clicked Manager',
    PATRONS_PRM: 'Patrons : Clicked Relationship Manager',
    PATRONS_EXIT_SURVEYS: 'Patrons : Clicked Exit Surveys',
    PATRONS_PAID_POSTS: 'Patrons : Clicked Paid Posts',
    PATRONS_REWARDS_MANAGER: 'Patrons : Clicked Rewards Manager',

    // dashboard subdomain - this event has a property to delinate each page
    DASHBOARD_CLICKED_SUBPAGE: 'Dashboard : Clicked Subpage',

    RENDERED_INVITE_CREATORS: 'Rendered Invite Creators',
}

export const logCreatorNavEvent = makeLogger(CREATOR_NAV_EVENTS.DOMAIN)

export const FOOTER_EVENTS = {
    DOMAIN: 'Footer',

    CLICK_ANDROID_LINK: 'Click Android Link',
    CLICK_IOS_LINK: 'Click iOS Link',
}

export const logFooterEvent = makeLogger(FOOTER_EVENTS.DOMAIN)



// WEBPACK FOOTER //
// ./app/analytics/nav-and-footer.js