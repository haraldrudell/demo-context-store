import windowOrFixture from 'utilities/get-window'

const windowObj = windowOrFixture()
const sessionStorage = windowObj.sessionStorage || null

let canWriteToSessionStorage = false

const canAccessSessionStorage = () => {
    if (canWriteToSessionStorage) {
        return true
    }

    try {
        if (!sessionStorage) {
            canWriteToSessionStorage = false
        }

        sessionStorage.setItem('patreon-session-access', 'patreon')
        sessionStorage.removeItem('patreon-session-access')
        canWriteToSessionStorage = true
        return true
    } catch (exception) {
        canWriteToSessionStorage = false
        return false
    }
}

export const getSessionStorage = () =>
    canAccessSessionStorage() && sessionStorage

export const removeSessionItem = key => {
    const ss = getSessionStorage()
    if (ss) {
        return ss.removeItem(key)
    }
}

export const getSessionItem = key => {
    const ss = getSessionStorage()
    if (ss) {
        return ss.getItem(key)
    }
}

export const setSessionItem = (key, val) => {
    const ss = getSessionStorage()
    if (ss) {
        return ss.setItem(key, val)
    }
}

export default getSessionStorage



// WEBPACK FOOTER //
// ./app/utilities/session-storage.js