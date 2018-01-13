import { CREATOR_NAV_EVENTS } from 'analytics'
import getWindow from 'utilities/get-window'

import getSettingsPageLinks from 'pages/settings/subnavigation-links'

export const isPatronManager = () => {
    const windowOrFixture = getWindow()
    const currentPage = windowOrFixture.location.pathname
    return (
        currentPage === '/manageRewards' ||
        currentPage === '/manageRewardsList' ||
        currentPage === '/members' ||
        currentPage === '/patron-exit-survey'
    )
}

export const getPatronManagerLinks = (rewardManagerEnabled = false) => {
    let links = [
        {
            url: '/manageRewards',
            name: 'Manager',
            noMobile: true,
            domain: CREATOR_NAV_EVENTS.DOMAIN,
            event: CREATOR_NAV_EVENTS.PATRONS_PATRON_MANAGER,
        },
        {
            url: '/members',
            name: 'Relationship Manager',
            badge: 'BETA',
            domain: CREATOR_NAV_EVENTS.DOMAIN,
            event: CREATOR_NAV_EVENTS.PATRONS_PRM,
        },
        {
            url: '/dashboard/exit-surveys',
            name: 'Exit Surveys',
            domain: CREATOR_NAV_EVENTS.DOMAIN,
            event: CREATOR_NAV_EVENTS.PATRONS_EXIT_SURVEYS,
        },
    ]
    if (rewardManagerEnabled) {
        const rewardsLink = {
            url: '/items-fulfillment-manager',
            name: 'Items Fulfillment Manager',
            badge: 'BETA',
            domain: CREATOR_NAV_EVENTS.DOMAIN,
            event: CREATOR_NAV_EVENTS.PATRONS_PRM,
        }

        links = [...links.slice(0, 2), rewardsLink, ...links.slice(2)]
    }

    return links
}

export const isSettingsPage = () => {
    const windowOrFixture = getWindow()
    const currentPage = windowOrFixture.location.pathname
    return (
        currentPage === '/settings/profile' ||
        currentPage === '/settings/account' ||
        currentPage === '/settings/payment' ||
        currentPage === '/settings/payout' ||
        currentPage === '/settings/email'
    )
}

export default function getSubNavigation(rewardManagerEnabled = false) {
    if (isPatronManager()) {
        return getPatronManagerLinks(rewardManagerEnabled)
    } else if (isSettingsPage()) {
        return getSettingsPageLinks()
    }
    return undefined
}



// WEBPACK FOOTER //
// ./app/pages/legacy_wrapper/get-subnavigation.js