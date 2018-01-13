import Immutable from 'seamless-immutable'
import forEach from 'lodash/forEach'
import values from './values'

export const dynamicReducers = {}

export const reducers = (state, action) => {
    if (dynamicReducers[action.type]) {
        return dynamicReducers[action.type](state, action)
    }
    return values(state, action)
}

const addReducer = (dataKey, actionType, reducer) => {
    dynamicReducers[actionType] = (state, action) => {
        const newValue = reducer(state[dataKey].value, action)
        return Immutable.setIn(state, [dataKey, 'value'], newValue)
    }
}

// Call this method to add a dictionary of reducers by actionType to the reducers for a specific dataKey
export const addAllReducers = (dataKey, innerReducers) => {
    forEach(innerReducers, (reducer, actionType) => {
        addReducer(dataKey, actionType, reducer)
    })
}



// WEBPACK FOOTER //
// ./app/libs/mallard/src/reducers/index.js