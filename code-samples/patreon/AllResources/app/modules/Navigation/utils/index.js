import { browserHistory } from 'react-router'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import some from 'lodash/some'
import getWindow from 'utilities/get-window'
import withRedirectBackHere from 'utilities/with-redirect-back-here'

import { logSubNavEvent } from '../events'

export const getCurrentPath = () => {
    return getWindow().location.pathname
}

const isNotEmpty = str => str.length
export const getRoot = url => {
    const pieces = url.split('/').filter(isNotEmpty)
    if (pieces.length === 1) {
        return `/${pieces[0]}`
    }
    return `/${pieces.slice(0, pieces.length - 1).join('/')}`
}

export const areEqualPaths = (path1, path2) => {
    return isEqual(
        path1.split('/').filter(isNotEmpty),
        path2.split('/').filter(isNotEmpty),
    )
}

export const getAbsoluteUrl = relUrl => {
    // We need to use the absolute url for the root-level subnav links, because an href to
    // "/patronManager" from "/posts/edit" will resolve to "posts/patronManager"
    const webRoot = get(getWindow(), 'patreon.webServer', '')
    return `https://${webRoot}${relUrl.indexOf('/') === 0 ? '' : '/'}${relUrl}`
}

export const doesRootMatchAny = (path, list) => {
    const rootName = getRoot(path)
    return some(list, item => item === rootName)
}

export const makeSubNavOnClickHandler = (
    link,
    closeMenuCallback = () => {},
) => {
    const { domain, event, url } = link
    const urlRoot = getRoot(url)

    // Kind of a hacky way to handle the fact that we can land on the /post page, but we want to
    // ensure the subnav uses browser history (react-router) instead of an absolute link
    const aliases = []
    if (urlRoot === '/posts') {
        aliases.push('/post')
    }

    const href = getAbsoluteUrl(url)

    return e => {
        logSubNavEvent(domain, event, { page: link.url })

        const currentPath = getCurrentPath()
        const isSameRoot = doesRootMatchAny(currentPath, [urlRoot, ...aliases])

        const shouldUseBrowserHistory = isSameRoot && urlRoot !== '/'

        if (shouldUseBrowserHistory) {
            e.preventDefault()
            closeMenuCallback()
            browserHistory.push(url)
        } else {
            // We need to delay the link navigation in order to avoid strange css transition states
            // in closing the menu
            e.preventDefault()
            setTimeout(() => {
                window.location = href
            }, 100)
        }
    }
}

// This is a bit of a tricky operation, since the subpages represented by the creator menu links
// can have many different actual urls. Really not too happy about this but it'll work for the
// time being
export const getSelectedPage = (links, userUrl, vanity) => {
    const currentPath = getCurrentPath()
    let selectedIndex = null

    links.forEach((link, index) => {
        const { key, href } = link

        if (currentPath === 'href') {
            selectedIndex = href
        }

        if (key === 'CREATOR') {
            // Check the current user vanity url
            if (vanity && currentPath === `/${vanity}`) {
                selectedIndex = index
            } else if (userUrl && getWindow().location.href === userUrl) {
                selectedIndex = index
            } else if (doesRootMatchAny(currentPath, ['/user'])) {
                selectedIndex = index
            }
        } else if (key === 'POST') {
            if (doesRootMatchAny(currentPath, ['/post', '/posts'])) {
                selectedIndex = index
            }
        } else if (key === 'PATRONS') {
            if (
                doesRootMatchAny(currentPath, [
                    '/manageRewardsList',
                    '/members',
                    '/manageRewards',
                ])
            ) {
                selectedIndex = index
            }
        } else if (key === 'DASHBOARD') {
            if (doesRootMatchAny(currentPath, ['/dashboard'])) {
                selectedIndex = index
            }
        } else if (key === 'NOTIFICATIONS') {
            if (doesRootMatchAny(currentPath, ['/notifications'])) {
                selectedIndex = index
            }
        } else if (key === 'MESSAGES') {
            if (doesRootMatchAny(currentPath, ['/messages'])) {
                selectedIndex = index
            }
        } else if (key === 'SETTINGS') {
            if (doesRootMatchAny(currentPath, ['/settings'])) {
                selectedIndex = index
            }
        }
    })

    return selectedIndex
}

export const onAuthLinkClick = href => {
    const windowOrFixture = getWindow()
    windowOrFixture.location.href = withRedirectBackHere(href)
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/utils/index.js