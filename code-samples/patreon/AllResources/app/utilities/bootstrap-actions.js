import requestActionTypes from 'actions/request-action-types'
import parseJsonApiResponse from 'utilities/parse-json-api-response'
import getWindow from 'utilities/get-window'

import { camelize } from 'humps'
import access from 'safe-access'

/* Convention: 'GET_CURRENT_USER' -> patreon.bootstrap['currentUser']  -gb */
const getDataKeyFromActionType = actionType => {
    return camelize(actionType.split('_').slice(1).join('_').toLowerCase())
}

/* evaluation func treats any data that has been defined
   as success in getting the data (even if value is falsy or null). -gb */
const evaluationFunc = dataToEvaluate => typeof dataToEvaluate !== 'undefined'

/**
 * Gets stuff from window.patreon.bootstrap, returns actions, and cleans up dom element
 */
const bootstrapActions = (...actionTypes) => {
    const bootstrapData = access(getWindow(), 'patreon.bootstrap') || {}
    const actions = actionTypes.map((actionType, i) => {
        const builtActionTypes = requestActionTypes(actionType)
        try {
            /* Convention: 'GET_CURRENT_USER' -> patreon.bootstrap['currentUser']  -gb */
            const key = getDataKeyFromActionType(actionType)
            const bootstrappedJson = bootstrapData[key]
            return evaluationFunc(bootstrappedJson)
                ? {
                      type: builtActionTypes[1],
                      payload: parseJsonApiResponse(bootstrappedJson),
                  }
                : {
                      type: builtActionTypes[2],
                      payload: bootstrappedJson,
                  }
        } catch (err) {
            return {
                type: builtActionTypes[0],
                payload: err,
                error: true,
            }
        }
    })

    return actions
}

/**
 * Use this if you're not sure what patreon.bootstrap will contain. It only
 * fires actions for keys that actually exist.
 */
export const bootstrapAvailableData = (...actionTypes) => {
    const dataKeys = actionTypes.filter(actionType => {
        const key = getDataKeyFromActionType(actionType)
        return access(getWindow(), `patreon.bootstrap.${key}`)
    })
    return bootstrapActions(...dataKeys)
}

export default bootstrapActions



// WEBPACK FOOTER //
// ./app/utilities/bootstrap-actions.js