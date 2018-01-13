import { createSelector } from 'reselect'
import get from 'lodash/get'

const selectReform = state => state.reform
const selectDirtyStates = state => get(selectReform(state), 'dirtyStates')

export const selectDirtyState = key =>
    createSelector(selectDirtyStates, dirtyStates => {
        const dirtyState = get(dirtyStates, key, {})
        return dirtyState ? { ...dirtyState } : dirtyState
    })



// WEBPACK FOOTER //
// ./app/libs/reform/src/selectors/dirty-states.js