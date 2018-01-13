import Immutable from 'seamless-immutable'
const initialState = Immutable({})

import { INITIALIZE_DATAKEY } from '../actions/types'

export default (state = initialState, action) => {
    const { dataKey, initialValue } = action.payload || {}
    switch (action.type) {
        // Initialize a new dataKey from a ref passed to a child component
        case INITIALIZE_DATAKEY:
            let nextState = Immutable.setIn(
                state,
                [dataKey, 'value'],
                initialValue,
            )
            nextState = Immutable.setIn(
                nextState,
                [dataKey, 'isInitialized'],
                true,
            )
            return nextState
        default:
            return state
    }
}



// WEBPACK FOOTER //
// ./app/libs/mallard/src/reducers/values.js