import map from 'lodash.map'
import { camelizeKeys } from 'humps'

export default class PatreonApiError extends Error {
    constructor(status, statusText, response) {
        super()
        this.name = 'PatreonApiError'
        this.status = status
        this.statusText = statusText
        this.response = response
        this.message = `${status} - ${statusText}`
        this.errors = map(response.errors, e => camelizeKeys(e))
    }
}



// WEBPACK FOOTER //
// ./app/libs/nion-modules/generic-patreon-api/error/index.js