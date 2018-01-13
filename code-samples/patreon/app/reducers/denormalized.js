import mapOrCall from 'utilities/map-or-call'
import { isTest } from 'shared/environment'

const denormalizeRelationships = (memo, { relationships, type, id }) => {
    if (!relationships) return memo
    Object.keys(relationships).forEach(key => {
        if (typeof relationships[key] === 'undefined') return
        if (relationships[key] === null) {
            return (memo[type][id][key] = null)
        }
        memo[type][id][key] = mapOrCall(
            relationships[key],
            modelRef => (memo[modelRef.type] || {})[modelRef.id],
        )
    })
    return memo
}

const extendModelsCb = state => (memo, resource) => {
    const { type, id, relationships } = resource
    memo[type] = memo[type] || { ...state[type] }
    const oldModel = memo[type][id]
    const oldRelationships = oldModel ? oldModel.relationships : null

    memo[type][id] = {
        ...oldModel,
        ...resource,
        relationships: {
            ...oldRelationships,
            ...relationships,
        },
    }
    return memo
}

export default (state, action) => {
    let { data, included, _fetchedAt } = action.meta.rawPayload
    let resources = Array.isArray(data) ? data : [data]
    if (included) resources = resources.concat(included)
    if (process.env.NODE_ENV !== 'production' && !isTest()) {
        const reportModelDiffs = require('utilities/report-model-diffs').default
        reportModelDiffs(resources, state)
    }

    const newState = {
        ...state,
        _fetchedAt,
    }
    resources.reduce(extendModelsCb(state), newState)
    resources.reduce(denormalizeRelationships, newState)

    return newState
}



// WEBPACK FOOTER //
// ./app/reducers/denormalized.js