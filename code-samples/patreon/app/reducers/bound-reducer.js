import isPlainObject from 'is-plain-object'
import values from 'lodash/values'
import devError from 'utilities/dev-error'

const ERROR_INVALID =
    'first argument to boundReducer must be a ' +
    'plain object with action types as keys and reducer functions as values.'

const _isValid = actionReducerMap =>
    isPlainObject(actionReducerMap) &&
    values(actionReducerMap).every(v => typeof v === 'function')

export default function(actionReducerMap, initialState) {
    if (!_isValid(actionReducerMap)) return devError(ERROR_INVALID)

    return (state = initialState, action) =>
        actionReducerMap[action.type]
            ? actionReducerMap[action.type](state, action)
            : state
}



// WEBPACK FOOTER //
// ./app/reducers/bound-reducer.js