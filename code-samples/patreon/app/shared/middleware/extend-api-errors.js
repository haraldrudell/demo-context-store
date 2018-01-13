import { ApiError } from 'redux-api-middleware'
import extendApiError from 'utilities/extend-api-error'

export default store => next => action => {
    if (action.error && (action.payload instanceof ApiError)) {
        const e = extendApiError(action.payload)
        action = {
            ...action,
            payload: e
        }
    }

    return next(action)
}



// WEBPACK FOOTER //
// ./app/shared/middleware/extend-api-errors.js