import { CALL_API } from 'redux-api-middleware'
import { BEGIN, REVERT } from 'redux-optimist'
import devError from 'utilities/dev-error'
import safeParseJsonApiResponse from 'utilities/parse-json-api-response'
import withOptimisticAttributes from 'utilities/with-optimistic-attributes'

let _optimistTransactionId = 0

const _isValidRequestMethod = (requestMethod) => ['POST', 'PATCH', 'DELETE'].includes(requestMethod)

const ERROR_NO_REQUEST_ACTION = 'optimisticRequestAction helper expects a valid RSAA.'
const ERROR_INVALID_METHOD = `optimisticRequestAction can only be called on 'POST', 'PATCH', or 'DELETE'.`

export default (requestAction) => {
    if (!requestAction[CALL_API]) return devError(ERROR_NO_REQUEST_ACTION)

    const {
        method,
        types: [
            requestStartBlueprint,
            requestSuccessBlueprint,
            requestFailureBlueprint
        ],
        body
    } = requestAction[CALL_API]

    if (!_isValidRequestMethod(method)) return devError(ERROR_INVALID_METHOD)

    requestStartBlueprint.type = requestStartBlueprint.type.replace('_REQUEST', '_SUCCESS')

    if (body) {
        const parsedBody = JSON.parse(body)
        parsedBody.data = withOptimisticAttributes(method, parsedBody.data)
        requestStartBlueprint.payload = safeParseJsonApiResponse(parsedBody)
    }
    requestStartBlueprint.meta = requestStartBlueprint.meta || {}
    requestStartBlueprint.meta.optimist = {
        type: BEGIN,
        id: _optimistTransactionId
    }

    requestSuccessBlueprint.meta = requestSuccessBlueprint.meta || {}
    requestSuccessBlueprint.meta.optimist = {
        type: REVERT,
        id: _optimistTransactionId
    }

    requestFailureBlueprint.meta = requestFailureBlueprint.meta || {}
    requestFailureBlueprint.meta.optimist = {
        type: REVERT,
        id: _optimistTransactionId
    }

    _optimistTransactionId++

    return requestAction
}



// WEBPACK FOOTER //
// ./app/actions/with-optimism.js