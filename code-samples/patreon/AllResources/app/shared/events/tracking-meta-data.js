import { decamelizeKeys } from 'humps'
import parseDomain from 'parse-domain'
import compact from 'utilities/compact'
import {
    getSessionItem,
    removeSessionItem,
    setSessionItem,
} from 'utilities/session-storage'

const getExpirationDate = () => {
    let now = new Date()

    // Returns a date that is exactly 24 hours after current date
    return now.setHours(now.getHours() + 24)
}

const getParsedMetaData = requestMetaData => {
    // The misspelling of 'referer' originates from the HTTP specification
    const { refererUrl, utmParams } = requestMetaData
    const parsedUrl = parseDomain(refererUrl) || {}
    const notReferredFromPatreon = parsedUrl.domain !== 'patreon'
    const subdomain =
        parsedUrl.subdomain && parsedUrl.subdomain.replace(/^www(\.){0,1}/, '')
    const hostname = compact([subdomain, parsedUrl.domain]).join('.')

    return {
        referrer_url: refererUrl && notReferredFromPatreon ? refererUrl : null,
        referrer_domain: notReferredFromPatreon ? hostname : null,
        ...decamelizeKeys(utmParams),
    }
}

const removeExpiredMetaData = () => {
    const expirationDate = JSON.parse(
        getSessionItem('metaDataExpiration') || '{}',
    )
    const now = new Date()

    if (now.getTime() > expirationDate) {
        removeSessionItem('expirationDate')
        removeSessionItem('trackingMetaData')
    }
}

export const setTrackingMetaData = requestMetaData => {
    removeExpiredMetaData()

    const sessionData =
        JSON.parse(getSessionItem('trackingMetaData') || '{}') || {}
    const sessionDataExists = Object.keys(sessionData).length > 0
    const newData = getParsedMetaData(requestMetaData)
    const isValidNewData = !!newData.referrer_url
    const isNewReferrer = sessionData.referrer_url !== newData.referrer_url

    // Update the tracking data if:
    // - There is no existing tracking data
    // - OR User arrived from a new non-Patreon HTTP referer
    if (!sessionDataExists || (isValidNewData && isNewReferrer)) {
        setSessionItem('trackingMetaData', JSON.stringify(newData))
        setSessionItem(
            'metaDataExpiration',
            JSON.stringify(getExpirationDate()),
        )
    }
}

export const getTrackingMetaData = () => {
    return JSON.parse(getSessionItem('trackingMetaData') || '{}')
}



// WEBPACK FOOTER //
// ./app/shared/events/tracking-meta-data.js