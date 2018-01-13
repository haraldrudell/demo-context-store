import { camelizeKeys } from 'humps'
import reduce from 'lodash/reduce'

/* For use with json-api-version=1.0 resources */

export default function clientize(apiResource = {}) {
    let resource = camelizeKeys(apiResource)

    if (resource.attributes) {
        resource.attributes.id = resource.id
        resource.attributes.type = resource.type
        resource.attributes.relationships = resource.relationships
        resource = resource.attributes
    }

    if (resource.relationships) {
        resource = reduce(
            resource.relationships,
            (memo, value, key) => {
                memo[key] = value.data
                return memo
            },
            resource,
        )
        delete resource.relationships
    }

    return resource
}



// WEBPACK FOOTER //
// ./app/utilities/clientize.js