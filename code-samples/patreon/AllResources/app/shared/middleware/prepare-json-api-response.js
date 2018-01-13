import { isRequestSuccess } from 'actions/request-action-types'
import denormalizedReducer from 'reducers/denormalized'
import devError from 'utilities/dev-error'
import mapOrCall from 'utilities/map-or-call'
import access from 'safe-access'

export const isJSONAPIPayload = (payload) => Boolean(access(payload, 'data'))

const _makeRef = (model) => ({
    id: model.id,
    type: model.type
})

const _validateFetchedAt = (got, set, actionType) => {
    if (got === set) return
    devError(console.error, `Race condition in data syncing between middleware and reducer at action ${actionType}!`)
}

let _lastFetchedAt = null

export default store => next => action => {
    action.meta = action.meta || {}
    action.optimist = action.meta.optimist
    const dataState = store.getState().data
    const hasApiResources = isRequestSuccess(action.type) && isJSONAPIPayload(action.payload)
    if (!hasApiResources) {
        action.meta.nextDataState = dataState
        return next(action)
    }

    _validateFetchedAt(dataState._fetchedAt, _lastFetchedAt, action.type)

    action.meta.rawPayload = action.payload
    const { meta, links, data, _fetchedAt } = action.meta.rawPayload

    action.payload = mapOrCall(data, _makeRef)
    action.payload.meta = meta
    action.payload.links = links
    /* setting action.payload._fetchedAt puts the property either on the single ref,
       or on the array holding multiple refs. */
    action.payload._fetchedAt = _fetchedAt

    _lastFetchedAt = _fetchedAt
    /* Do this reducer work early so other reducers have access to the full dataset and
    can call getters on it. */
    action.meta.nextDataState = denormalizedReducer(dataState, action)

    return next(action)
}



// WEBPACK FOOTER //
// ./app/shared/middleware/prepare-json-api-response.js