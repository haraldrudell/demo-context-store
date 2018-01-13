import forEach from 'lodash/forEach'
import set from 'lodash/set'

export const storedActionCreators = {}

export const addActionCreator = (dataKey, actionKey, actionCreator) => {
    set(storedActionCreators, [dataKey, actionKey], actionCreator)
}

// Call this method to add a dictionary of reducers by actionType to the reducers for a specific dataKey
export const addAllActionCreators = (dataKey, actionTypesAndCreators) => {
    forEach(actionTypesAndCreators, (actionTypeAndCreator, actionKey) => {
        addActionCreator(dataKey, actionKey, actionTypeAndCreator.creator)
    })
}



// WEBPACK FOOTER //
// ./app/libs/mallard/src/actions/stored.js