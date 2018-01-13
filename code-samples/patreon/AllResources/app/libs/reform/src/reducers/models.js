import Immutable from 'seamless-immutable'
import mapValues from 'lodash/mapValues'
const initialState = Immutable({})

import {
    INITIALIZE_DATAKEY,
    SET_MODEL,
    SET_MODEL_PROPERTY,
} from '../actions/types'

// We want all null or undefined values to become the empty string,
// as React treats null or undefined values as uncontrolled inputs,
// which we never want in a reformed context
const coerceNonControllingValue = value =>
    typeof value === 'undefined' || value === null ? '' : value
const coerceNonControllingValues = inputModel =>
    mapValues(inputModel, coerceNonControllingValue)

const modelsReducer = (state = initialState, action) => {
    const { dataKey, model, initialModel, name, value } = action.payload || {}

    switch (action.type) {
        case INITIALIZE_DATAKEY:
            return Immutable.setIn(
                state,
                [dataKey],
                coerceNonControllingValues(initialModel),
            )

        case SET_MODEL:
            return Immutable.setIn(
                state,
                [dataKey],
                coerceNonControllingValues(model),
            )

        case SET_MODEL_PROPERTY:
            return Immutable.setIn(
                state,
                [dataKey, name],
                coerceNonControllingValue(value),
            )

        default:
            return state
    }
}

export default modelsReducer



// WEBPACK FOOTER //
// ./app/libs/reform/src/reducers/models.js