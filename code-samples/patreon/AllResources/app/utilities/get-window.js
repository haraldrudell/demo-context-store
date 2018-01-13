import cloneDeep from 'lodash/cloneDeep'
import { isClient, isTest } from 'shared/environment'

export const defaultServerFixture = {
    location: {
        hostname: 'www.patreon.com',
        pathname: '',
        href: 'https://www.patreon.com/',
    },
    patreon: {
        presets: {
            navigation: {
                unreadMessagesCount: 0,
                isAdmin: false,
                isImpersonating: false,
                refererUrl: '',
                utmParams: {},
                simulatedBootstrap: {
                    isLoggedIn: false,
                    isActiveCreator: false,
                    avatarUrl: undefined,
                },
            },
        },
        apiServer: 'www.patreon.com/api',
        webServer: 'www.patreon.com',
        csrfSignature: '',
    },
}
let serverFixture = cloneDeep(defaultServerFixture)

const setTestURL = url => {
    const parser = document.createElement('a')
    parser.href = url
    ;[
        'href',
        'protocol',
        'host',
        'hostname',
        'origin',
        'port',
        'pathname',
        'search',
        'hash',
    ].forEach(prop => {
        Object.defineProperty(window.location, prop, {
            value: parser[prop],
            writable: true,
        })
    })
}

export default () => (isClient() ? window : serverFixture)

export const editWindowFixture = newFixture => {
    if (isClient() && isTest()) {
        setTestURL(newFixture.location.href)
        window.patreon = newFixture.patreon
    } else {
        serverFixture = newFixture
    }
}



// WEBPACK FOOTER //
// ./app/utilities/get-window.js