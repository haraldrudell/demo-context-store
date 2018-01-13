import { CALL_API } from 'redux-api-middleware'
import { requestActionHandlers } from 'actions/request-action-types'
import bailoutIfPendingFn from 'actions/bailout-if-pending-fn'


export default (actionTypeAndKey, endpoint, options) => {
    let [actionType, actionKey] = actionTypeAndKey.split('__')

    // TODO: deprecate this magic if actions aren't relying on it.
    if (!actionKey) {
        const idInRoute = endpoint.match(/(\/)([0-9]+)/)
        actionKey = idInRoute ? idInRoute[2] : null
    }

    const optionsWithHeaders = {
        ...options,
        headers: { 'Content-Type': 'application/json' }
    }

    /* see https://github.com/agraboso/redux-api-middleware#usage */
    let request = {
        endpoint,
        method: actionType.split('_')[0],
        credentials: 'include',
        types: requestActionHandlers(actionType, actionKey),
        bailout: bailoutIfPendingFn(actionType, actionKey)
    }

    request = {...request, ...optionsWithHeaders}

    if (request.body) request.body = JSON.stringify(request.body)

    return {
        [CALL_API]: request
    }
}



// WEBPACK FOOTER //
// ./app/actions/api-request-action.js