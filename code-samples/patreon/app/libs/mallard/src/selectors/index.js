import { createSelector } from 'reselect'
import get from 'lodash/get'
import { storedSelectors } from './stored'
import { storedActionCreators } from '../actions/stored'

const selectState = state => state.mallard

export const selectValue = key =>
    createSelector(selectState, state => get(state, `${key}.value`, null))

export const selectValuesForKeys = dataKeys => {
    return state => {
        return dataKeys.reduce((memo, key) => {
            memo[key] = selectValue(key)(state)
            return memo
        }, {})
    }
}

const selectValueInitialization = key =>
    createSelector(selectState, state => {
        if (typeof state === 'undefined') {
            console.error(
                'Mallard reducer was not added to redux store.' +
                    ' You may need to specify { mallard: true }' +
                    ' in your configure-store options.',
            )
        }
        return get(state, `${key}.isInitialized`, false)
    })

/*
    Selects the data needed for the whole injected mallard object

    @param {string} dataKey - the key used to look up the relevant data in the redux store

    @returns {
        value: the main mallard value for this dataKey,
        selectors: {Object<string selectorKey, function selector>}
            the functions which transform the main value into any other computed values
        actionCreators: {Object<string actionKey, function actionCreator>}
            the action creators associated with this mallard object.
            To be used e.g. `dispatch(actionCreator(my, custom, args))`
        _isInitialized: whether or not the inner mallard state is ready for usage.
            If this is false, none of the other values in the return value should be used
    }
*/
export const selectMallard = dataKey =>
    createSelector(
        selectValue(dataKey),
        selectValueInitialization(dataKey),
        (value, isInitialized) => {
            const selectors = storedSelectors[dataKey] || {}
            const actionCreators = storedActionCreators[dataKey] || {}
            return {
                value,
                selectors,
                actionCreators,
                _isInitialized: isInitialized,
            }
        },
    )



// WEBPACK FOOTER //
// ./app/libs/mallard/src/selectors/index.js