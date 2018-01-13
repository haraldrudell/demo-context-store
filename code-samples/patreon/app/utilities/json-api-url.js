import urlFactory from 'url-factory'
import access from 'safe-access'
import getWindow from 'utilities/get-window'

export const CURRENT_JSON_API_VERSION = '1.0'
const DEFAULT_API_DOMAIN = 'www.patreon.com/api'
const DEFAULT_WWW_DOMAIN = 'www.patreon.com'

const apiDomainGenerator = () => {
    let apiDomain =
        access(getWindow(), 'patreon.apiServer') || DEFAULT_API_DOMAIN
    if (apiDomain.startsWith('http')) {
        apiDomain = apiDomain.slice(apiDomain.indexOf('://') + 3)
    }
    return apiDomain
}
const apiDomain = apiDomainGenerator()
export const apiHost = `https://${apiDomain}`
export const apiHostGenerator = () => `https://${apiDomainGenerator()}`

export default urlFactory(apiHost, {
    'json-api-version': CURRENT_JSON_API_VERSION,
})

export const jsonApiUrlGenerator = () =>
    urlFactory(apiHostGenerator(), {
        'json-api-version': CURRENT_JSON_API_VERSION,
    })

export const urlBuilderForDefaults = defaults =>
    urlFactory(apiHostGenerator(), {
        'json-api-version': CURRENT_JSON_API_VERSION,
        ...defaults,
    })

export const wwwDomainGenerator = () =>
    access(getWindow(), 'location.hostname') || DEFAULT_WWW_DOMAIN
export const wwwDomain = wwwDomainGenerator()
export const wwwURLGenerator = () =>
    urlFactory(`https://${wwwDomainGenerator()}`)
export const wwwURL = wwwURLGenerator()



// WEBPACK FOOTER //
// ./app/utilities/json-api-url.js