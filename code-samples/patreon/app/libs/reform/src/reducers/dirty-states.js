/* eslint-disable guard-for-in */
import Immutable from 'seamless-immutable'
import map from 'lodash/map'

const initialState = Immutable({})

import {
    INITIALIZE_DATAKEY,
    SET_BLURRED,
    SET_FOCUSED,
    SET_MODEL,
    SET_MODEL_PROPERTY,
    RESET_DIRTY_STATE,
} from '../actions/types'

const defaultDirtyState = {
    hasBlurred: false,
    isBlurred: false,
    hasFocused: false,
    isFocused: false,
    hasTouched: false,
    hasChanged: false,
}

const generateInitialStatus = initialModel => {
    const output = {}
    map(initialModel, (value, fieldName) => {
        output[fieldName] = defaultDirtyState
    })
    return output
}

const mergeDeep = (pre, post) => Immutable.merge(pre, post, { deep: true })

const dirtyStateReducer = (state = initialState, action) => {
    const { dataKey, initialModel } = action.payload || {}
    switch (action.type) {
        case INITIALIZE_DATAKEY: {
            const status = generateInitialStatus(initialModel)
            return Immutable.setIn(state, [dataKey], status)
        }

        case SET_MODEL: {
            const { changedFields = [] } = action.payload
            for (let fieldName in state[dataKey]) {
                const hasChanged = changedFields.indexOf(fieldName) !== -1
                state = Immutable.setIn(
                    state,
                    [dataKey, fieldName, 'hasTouched'],
                    true,
                )
                state = Immutable.setIn(
                    state,
                    [dataKey, fieldName, 'hasChanged'],
                    hasChanged,
                )
            }
            return state
        }

        case SET_MODEL_PROPERTY: {
            const { hasChanged = false, name } = action.payload
            return mergeDeep(state, {
                [dataKey]: {
                    [name]: {
                        hasChanged,
                        hasTouched: true,
                    },
                },
            })
        }

        case SET_BLURRED: {
            const { name } = action.payload
            return mergeDeep(state, {
                [dataKey]: {
                    [name]: {
                        hasBlurred: true,
                        isBlurred: true,
                        isFocused: false,
                    },
                },
            })
        }

        case SET_FOCUSED: {
            const { name } = action.payload
            return mergeDeep(state, {
                [dataKey]: {
                    [name]: {
                        isBlurred: false,
                        hasFocused: true,
                        isFocused: true,
                    },
                },
            })
        }

        case RESET_DIRTY_STATE: {
            const { name } = action.payload
            return mergeDeep(state, {
                [dataKey]: {
                    [name]: defaultDirtyState,
                },
            })
        }

        default:
            return state
    }
}

export default dirtyStateReducer



// WEBPACK FOOTER //
// ./app/libs/reform/src/reducers/dirty-states.js