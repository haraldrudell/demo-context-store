import get from 'lodash/get'
import getWindow from 'utilities/get-window'
import { isTest } from 'shared/environment'

const getCsrfSignature = () => get(getWindow(), 'patreon.csrfSignature', null)

export const setCsrfSignature = signature => {
    const windowOrFixture = getWindow()
    let patreonObj = get(windowOrFixture, 'patreon', null)
    if (patreonObj) {
        patreonObj['csrfSignature'] = signature
    }
}

export const getCsrfHeaders = () => {
    const csrfSignature = getCsrfSignature()
    if (!csrfSignature && !isTest()) {
        console.error('Invalid CSRF signature')
    }
    return {
        'X-CSRF-Signature': getCsrfSignature(),
    }
}

export const getCsrfHeadersWithPromise = () => Promise.resolve(getCsrfHeaders())

export default getCsrfHeadersWithPromise



// WEBPACK FOOTER //
// ./app/utilities/csrf.js