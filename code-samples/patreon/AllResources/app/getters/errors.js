import { createSelector } from 'reselect'
import { ApiError } from 'redux-api-middleware'
import ensureArray from 'utilities/ensure-array'
import compact from 'utilities/compact'
import access from 'safe-access'


/**
 *
 * HELPERS
 *
 */

const _namespacedErrorIteratee = (state, ownProps, getNamespace) =>
    getNamespace ?
        (actionType) => access(state, `requests.${actionType}.${getNamespace(state, ownProps)}.error`) :
        (actionType) => access(state, `requests.${actionType}.error`)

const anyIsError = (errors) => !!errors.length

const everyIsError = (errors, actionTypeArr) => !!(errors.length && errors.length === actionTypeArr.length) // eslint-disable-line no-unused-vars

const anyIsApiError = (errors) => errors.findIndex(error => error instanceof ApiError) > -1

const anyIs400sError = (errors) => errors.findIndex(error =>
    error instanceof ApiError && error.status > 399 && error.status < 500
) > -1

const anyIs500sError = (errors) => errors.findIndex(error =>
    error instanceof ApiError && error.status > 499 && error.status < 600
) > -1


/**
 *
 * BASE GETTERS
 *
 */

/*
ARGS:
- actionTypeArr (string[]|string) the request namespace.
- [getNamespace] (func) derive more specific namespace from state or ownProps
RETURNS:
- (state, ownProps) => [errorObject1, errorObject2, errorObject3] | null
*/
export const errorsGetter = (actionTypeArr, getNamespace = null) =>
    createSelector(
        (state) => state,
        (state, ownProps) => ownProps,
        (state, ownProps) => {
            const iteratee = _namespacedErrorIteratee(state, ownProps, getNamespace)
            return compact(ensureArray(actionTypeArr).map(iteratee))
        }
    )

/*
ARGS:
- actionTypeArr (string[]|string) the request namespace.
- [getNamespace] (func) derive more specific namespace from state or ownProps
- [checker=anyIsError] (func) if array of action types, how do you want to determine 'hasError'?
RETURNS:
(state, ownProps) => true | false
*/
export const hasErrorsGetter = (actionTypeArr, getNamespace, checker = anyIsError) =>
    createSelector(
        errorsGetter(actionTypeArr, getNamespace),
        (errors) => checker(errors, actionTypeArr)
    )


/**
 *
 * MOAR ERROR GETTERS
 * ApiError has shape {name: 'ApiError', message: '...', status: 404, statusText: 'Not Found', response: {}, errorCodes: [ ... ]}.
 *
 */

/* get all api errors, or empty array */
export const apiErrorsGetter = (actionTypeArr, getNamespace) =>
    createSelector(
        errorsGetter(actionTypeArr, getNamespace),
        (errors) => errors.filter(error => error instanceof ApiError)
    )

/* get ALL error codes on any of the api errors, or empty array */
export const jsonApiErrorsGetter = (actionTypeArr, getNamespace) =>
    createSelector(
        apiErrorsGetter(actionTypeArr, getNamespace),
        (apiErrors) =>
            apiErrors.reduce((memo, apiError) => apiError.jsonApiErrors ? memo.concat(apiError.jsonApiErrors) : memo, [])
    )

/* find one instance of a JSON:API error that has the given code and return it, otherwise null */
export const jsonApiErrorGetter = (actionTypeArr, getNamespace, code) =>
    createSelector(
        jsonApiErrorsGetter(actionTypeArr, getNamespace),
        (jsonApiErrors) =>
            jsonApiErrors.find(jsonApiError => jsonApiError.code === code) || null
    )

/* bool from jsonApiErrorGetter */
export const hasJsonApiErrorGetter = (actionTypeArr, getNamespace, code) =>
    createSelector(
        jsonApiErrorGetter(actionTypeArr, getNamespace, code),
        (jsonApiError) => !!jsonApiError
    )

export const hasApiErrorGetter = (actionTypeArr, getNamespace) =>
    hasErrorsGetter(actionTypeArr, getNamespace, anyIsApiError)

export const has400sErrorGetter = (actionTypeArr, getNamespace) =>
    hasErrorsGetter(actionTypeArr, getNamespace, anyIs400sError)

export const has500sErrorGetter = (actionTypeArr, getNamespace) =>
    hasErrorsGetter(actionTypeArr, getNamespace, anyIs500sError)



// WEBPACK FOOTER //
// ./app/getters/errors.js