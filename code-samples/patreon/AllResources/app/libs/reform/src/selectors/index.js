import { createSelector } from 'reselect'
import { selectModel } from './models'
import { selectDirtyState } from './dirty-states'
import { selectValidation } from './validations'

export { selectModel } from './models'
export { selectDirtyState } from './dirty-states'
export { selectValidation } from './validations'

// Selects the model plus all relevant data from the store
export const selectResourceForKey = dataKey =>
    createSelector(
        selectModel(dataKey),
        selectDirtyState(dataKey),
        selectValidation(dataKey),
        (model, dirtyState, validation) => ({
            model,
            dirtyState,
            validation,
        }),
    )

// Selects a keyed map of { model, dirtyState, validation } resources from the store taking an
// array of dataKeys
export const selectResourcesForKeys = dataKeys => {
    return state => {
        return dataKeys.reduce((memo, dataKey) => {
            memo[dataKey] = selectResourceForKey(dataKey)(state)
            return memo
        }, {})
    }
}



// WEBPACK FOOTER //
// ./app/libs/reform/src/selectors/index.js