import { optimisticId } from 'utilities/get-sequential-id'
import apiTimestamp from 'utilities/api-timestamp'

/* This isn't really doing that much, it's just a generic way to handle properties like
'createdAt' that the server supplies on resource creation / deletion but we need to mock
for optimistic updates (or maybe for tests).  We wouldn't even need blueprints except for
the fact that comments (and maybe others) use 'created' intead of 'createdAt', so we need
to specify how each resource should handle this type of problem. - gb */


const blueprints = {
    'POST': {
        'comment': {
            created: apiTimestamp
        }
    },
    'PATCH': {},
    'DELETE': {
        'comment': {
            deletedAt: apiTimestamp
        }
    }

}

export default (requestMethod, resource) => {
    const optimisticResource = requestMethod === 'POST' ? {
        ...resource,
        id: optimisticId()
    } : resource

    const blueprint = blueprints[requestMethod][resource.type]
    if (!blueprint) return optimisticResource

    return Object.keys(blueprint).reduce((memo, key) => {
        memo.attributes[key] = blueprint[key]()
        return memo
    }, optimisticResource)
}



// WEBPACK FOOTER //
// ./app/utilities/with-optimistic-attributes.js