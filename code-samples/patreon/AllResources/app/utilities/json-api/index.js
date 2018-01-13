// import urlFactory from 'url-factory'
import { urlBuilderForDefaults } from 'utilities/json-api-url'

// We need to run the urlBuilderForDefaults function each time the function is run, since we need
// to invoke apiHostGenerator() on each invocation in order to stub out the window object properly
// on SSR and in tests
const defaults = { include: [] }
export const buildUrl = (...args) => urlBuilderForDefaults(defaults)(...args)

export class JsonApiPayload {
    constructor(type, attributes) {
        this.attributes = { ...attributes }
        this.relationships = {}
        this.meta = {}
        this.type = type
        this.included = []
    }

    addAttribute(key, val) {
        this.attributes[key] = val
    }

    // Relationship can either be a { type, id } object or [{ type, id }] array of objects - or, if
    // 'idOrData' is a string, then we can assume that we're passing in arguments of (type, id) and
    // the  relationship is simple
    addRelationship(relationship, idOrData) {
        let data
        if (typeof idOrData === 'string') {
            data = { type: relationship, id: idOrData }
        } else {
            data = idOrData
        }
        this.relationships[relationship] = { data }
    }

    addMetaAttribute(key, val) {
        this.meta[key] = val
    }

    addInclude(type, id, attributes) {
        this.addRelationship(type, id)
        this.included.push({
            type,
            id,
            attributes: { ...attributes },
        })
    }

    toRequest() {
        let request = {}
        request['data'] = {
            type: this.type,
            attributes: { ...this.attributes },
            relationships: { ...this.relationships },
        }

        if (Object.keys(this.meta).length) {
            request['meta'] = { ...this.meta }
        }

        if (this.included.length) {
            request['included'] = [...this.included]
        }
        return request
    }
}



// WEBPACK FOOTER //
// ./app/utilities/json-api/index.js