import { createSelector } from 'reselect'
import get from 'lodash/get'

const selectReform = state => state.reform
const selectModels = state => get(selectReform(state), 'models')

export const selectModel = key =>
    createSelector(selectModels, models => {
        const model = get(models, key, {})
        return model ? { ...model } : model
    })



// WEBPACK FOOTER //
// ./app/libs/reform/src/selectors/models.js