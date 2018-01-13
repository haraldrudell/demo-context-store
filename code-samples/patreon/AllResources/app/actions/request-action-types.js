import { getJSON } from 'redux-api-middleware'

import parseJsonApiResponse from 'utilities/parse-json-api-response'

import memoize from 'lodash/memoize'

const REQUEST_START_SUFFIX = '_REQUEST'
export const REQUEST_SUCCESS_SUFFIX = '_SUCCESS'
const REQUEST_FAILURE_SUFFIX = '_FAILURE'

export const isRequestStart = requestActionType =>
    requestActionType.endsWith &&
    requestActionType.endsWith(REQUEST_START_SUFFIX)
export const isRequestSuccess = requestActionType =>
    requestActionType.endsWith &&
    requestActionType.endsWith(REQUEST_SUCCESS_SUFFIX)

const requestActionTypes = memoize(actionType => [
    `${actionType}${REQUEST_START_SUFFIX}`,
    `${actionType}${REQUEST_SUCCESS_SUFFIX}`,
    `${actionType}${REQUEST_FAILURE_SUFFIX}`,
])
export default requestActionTypes

export const requestActionHandlers = (
    actionType,
    actionKey,
    transformSuccess,
) => {
    const builtRequestActionTypes = requestActionTypes(actionType)

    const payload = transformSuccess
        ? (action, state, res) =>
              getJSON(res)
                  .then(json => json && parseJsonApiResponse(json))
                  .then(parsedJson =>
                      transformSuccess(action, state, parsedJson),
                  )
        : (action, state, res) =>
              getJSON(res).then(json => json && parseJsonApiResponse(json))

    const descriptors = [
        {
            type: builtRequestActionTypes[0],
        },
        {
            type: builtRequestActionTypes[1],
            payload,
        },
        {
            type: builtRequestActionTypes[2],
        },
    ]

    return actionKey
        ? descriptors.map(descriptor => ({
              ...descriptor,
              meta: {
                  ...descriptor.meta,
                  actionKey,
              },
          }))
        : descriptors
}



// WEBPACK FOOTER //
// ./app/actions/request-action-types.js