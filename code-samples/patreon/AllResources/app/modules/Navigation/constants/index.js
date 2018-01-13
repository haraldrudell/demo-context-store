import { CREATOR_NAV_EVENTS, HEADER_EVENTS } from 'analytics/nav-and-footer'

import { getLinks as getDashboardLinks } from 'pages/stats/subnavigation-links'
import { getLinks as getMakeAPostLinks } from 'pages/make_a_post/subnavigation-links'
import { getPatronManagerLinks } from 'pages/legacy_wrapper/get-subnavigation'
import getSettingsPageLinks from 'pages/settings/subnavigation-links'

import { getCurrentPath, getRoot } from '../utils'

const isFinalMarketingPage = () => {
    const currentPath = getCurrentPath()
    if (
        currentPath === '/create-on-patreon' ||
        currentPath === '/' ||
        getRoot(currentPath) === '/c'
    ) {
        return true
    }
    return false
}

const isAuthPage = () => {
    const currentPath = getCurrentPath()
    if (currentPath === '/login' || currentPath === '/signup') {
        return true
    }
    return false
}

const primaryCreatorCtaText = () => {
    if (isFinalMarketingPage()) {
        return 'START MY PAGE'
    }
    return 'CREATE ON PATREON'
}

const primaryCreatorCtaUrl = () => {
    if (isFinalMarketingPage()) {
        return '/create?continue=true'
    }
    return '/create-on-patreon'
}

export const getBecomeCreatorItems = () => ({
    FINISH: {
        key: 'FINISH',
        href: '/edit',
        event: HEADER_EVENTS.CLICKED_FINISH_PAGE,
        title: 'FINISH PAGE',
        color: 'highlightPrimary',
    },
    CREATE_ON_PATREON: {
        key: 'CREATE_ON_PATREON',
        href: primaryCreatorCtaUrl(),
        event: HEADER_EVENTS.CLICKED_CREATE_ON_PATREON,
        title: primaryCreatorCtaText(),
    },
})

export const AUTH_ITEMS = {
    SIGNUP: {
        key: 'SIGNUP',
        href: '/signup',
        event: HEADER_EVENTS.CLICKED_SIGN_UP,
        title: 'SIGN UP',
    },
    LOGIN: {
        key: 'LOGIN',
        href: '/login',
        event: HEADER_EVENTS.CLICKED_LOG_IN,
        title: 'LOG IN',
    },
    LOGOUT: {
        key: 'LOGOUT',
        href: '/logout',
        event: HEADER_EVENTS.CLICKED_LOGOUT,
        title: 'LOG OUT',
    },
}

export const getLoggedOutMenuItems = () => {
    let items = [
        {
            key: 'EXPLORE',
            href: '/explore',
            title: 'EXPLORE CREATORS',
            event: HEADER_EVENTS.CLICKED_EXPLORE_CREATORS,
        },
        {
            ...AUTH_ITEMS.SIGNUP,
        },
        {
            ...AUTH_ITEMS.LOGIN,
        },
    ]

    if (!isAuthPage()) {
        return [getBecomeCreatorItems().CREATE_ON_PATREON, ...items]
    } else {
        return items
    }
}

export const USER_MENU_ITEMS = [
    {
        key: 'EXPLORE',
        href: '/explore',
        title: 'EXPLORE CREATORS',
        event: HEADER_EVENTS.CLICKED_EXPLORE_CREATORS,
    },
    {
        key: 'PROFILE',
        href: '/user',
        title: 'YOUR PROFILE',
        patronOnly: true,
        event: HEADER_EVENTS.CLICKED_YOUR_PROFILE,
    },
    {
        key: 'PLEDGES',
        href: '/pledges',
        title: 'YOUR PLEDGES',
        event: HEADER_EVENTS.CLICKED_YOUR_PLEDGES,
    },
    {
        key: 'MESSAGES',
        href: '/messages',
        title: 'MESSAGES',
        counterKey: 'unreadMessagesCount',
        event: HEADER_EVENTS.CLICKED_MESSAGES,
        mobileOnly: true,
        patronOnly: true,
    },
    {
        key: 'SETTINGS',
        href: '/settings',
        title: 'SETTINGS',
        patronOnly: true,
        subNavigationLinks: getSettingsPageLinks(),
        event: HEADER_EVENTS.CLICKED_SETTINGS,
    },
    {
        key: 'SUPPORT',
        href: 'https://support.patreon.com',
        title: 'HELP CENTER',
        event: HEADER_EVENTS.CLICKED_HELP_CENTER,
    },
    {
        ...AUTH_ITEMS.LOGOUT,
    },
]

export const CREATOR_MENU_ITEMS = [
    {
        key: 'CREATOR',
        href: '/user',
        title: 'YOUR PAGE',
        iconType: null,
        event: CREATOR_NAV_EVENTS.CLICKED_AVATAR,
    },
    {
        key: 'POST',
        href: '/post',
        title: 'POST',
        iconType: 'post',
        subNavigationLinks: getMakeAPostLinks(),
        event: CREATOR_NAV_EVENTS.CLICKED_POST,
    },
    {
        key: 'PATRONS',
        href: '/manageRewards',
        title: 'PATRONS',
        iconType: 'patrons',
        subNavigationLinks: getPatronManagerLinks(),
        event: CREATOR_NAV_EVENTS.CLICKED_PATRONS,
    },
    {
        key: 'DASHBOARD',
        href: '/dashboard',
        title: 'DASHBOARD',
        iconType: 'analytics',
        subNavigationLinks: getDashboardLinks(),
        event: CREATOR_NAV_EVENTS.CLICKED_DASHBOARD,
    },
    {
        key: 'NOTIFICATIONS',
        href: '/notifications',
        title: 'NOTIFICATIONS',
        iconType: 'notifications',
        counterKey: 'unreadNotificationsCount',
        event: CREATOR_NAV_EVENTS.CLICKED_NOTIFICATIONS,
    },
    {
        key: 'MESSAGES',
        href: '/messages',
        title: 'MESSAGES',
        iconType: 'messages',
        counterKey: 'unreadMessagesCount',
        event: CREATOR_NAV_EVENTS.CLICKED_MESSAGES,
    },
    {
        key: 'INVITE',
        href: '/invite',
        title: 'INVITE CREATORS',
        iconType: 'invite',
        event: CREATOR_NAV_EVENTS.CLICKED_INVITE_CREATORS,
        renderEvent: CREATOR_NAV_EVENTS.RENDERED_INVITE_CREATORS,
    },
    {
        key: 'SETTINGS',
        href: '/settings',
        title: 'SETTINGS',
        iconType: 'gear',
        subNavigationLinks: getSettingsPageLinks(),
        event: CREATOR_NAV_EVENTS.CLICKED_SETTINGS,
    },
]



// WEBPACK FOOTER //
// ./app/modules/Navigation/constants/index.js