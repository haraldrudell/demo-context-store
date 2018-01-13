import localStorage from 'local-storage'
import getWindow from 'utilities/get-window'
import { isClient, isTest } from 'shared/environment'

function indexOfFirstMatch(arr, key) {
    const regEx = new RegExp(key)
    for (let i = 0; i < arr.length; i++) {
        if (regEx.test(arr[i])) return i
    }
    return -1
}

function getUTMData() {
    const url = getWindow().location.href
    if (!url) {
        return
    }

    const utmData = {}

    function addIfNotNull(key) {
        const regEx = new RegExp(key + '=')
        if (regEx.test(url)) {
            const params = url.split('=')
            const index = indexOfFirstMatch(params, key)
            const value = params[index + 1].split('&')[0]
            if (value !== undefined) {
                utmData[key] = value
            }
        }
    }

    addIfNotNull('utm_source')
    addIfNotNull('utm_medium')
    addIfNotNull('utm_campaign')
    addIfNotNull('utm_term')
    addIfNotNull('utm_content')

    return utmData
}

export class PatreonTrackerClient {
    isImpersonating = getWindow()['amplitude'] === 'impersonating'
    localStorageEventKey = 'patreon-tracking'
    unsentEvents = []

    // Millisecond batching period
    batchPeriod = 3000

    trackingEndpoint = null
    timeoutToken = null

    hasUploadScheduled = false
    isSending = false

    init = () => {
        const storedEvents = localStorage.get(this.localStorageEventKey)
        if (Array.isArray(storedEvents)) {
            this.unsentEvents = storedEvents
        }

        if (getWindow().patreon && getWindow().patreon.apiServer) {
            this.trackingEndpoint =
                'https://' + getWindow().patreon.apiServer + '/tracking'
        } else {
            this.trackingEndpoint = 'https://api.patreon.com/tracking'
        }
    }

    logEvent = (name, info, opts) => {
        const eventPayload = {
            time: new Date().getTime(),
            event_type: name,
            event_properties: info || {},
            user_properties: getUTMData(),
        }

        this.unsentEvents.push(eventPayload)
        this.saveEvents()
        this.sendEvents()
    }

    saveEvents = () => {
        localStorage.set(this.localStorageEventKey, this.unsentEvents)
    }

    sendEvents = () => {
        if (this.hasUploadScheduled) {
            return
        }

        this.hasUploadScheduled = true
        setTimeout(() => {
            this.hasUploadScheduled = false
            this._sendEvents()
        }, this.batchPeriod)
    }

    _sendEvents = () => {
        if (this.isSending) {
            return
        }

        const events = this.unsentEvents
        if (events.length === 0) {
            return
        }

        this.isSending = true

        if (this.isImpersonating || !isClient() || isTest()) {
            console.log('Tracking events: ', events)
        } else {
            const xmlhttp = new XMLHttpRequest()
            xmlhttp.open('POST', this.trackingEndpoint)
            /* Required for sending cookies */
            xmlhttp.withCredentials = true
            xmlhttp.setRequestHeader(
                'Content-Type',
                'application/json;charset=UTF-8',
            )
            xmlhttp.send(JSON.stringify(events))
        }

        this.unsentEvents = []
        this.saveEvents()
        this.isSending = false
    }
}

const patreonTrackerClient = new PatreonTrackerClient()
patreonTrackerClient.init()

export default patreonTrackerClient



// WEBPACK FOOTER //
// ./app/analytics/logger/patreon-tracker-client.js