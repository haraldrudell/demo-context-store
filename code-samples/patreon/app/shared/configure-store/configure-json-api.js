import prepareJsonApiResponseMiddleware from 'shared/middleware/prepare-json-api-response'
import extendApiErrorsMiddleware from 'shared/middleware/extend-api-errors'
import dataReducer from 'reducers/data'

export default () => {
    return {
        middleware: [
            extendApiErrorsMiddleware,
            prepareJsonApiResponseMiddleware
        ],
        reducer: dataReducer
    }
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-json-api.js