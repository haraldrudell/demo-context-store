import { combineReducers } from 'redux-seamless-immutable'

import models from './models'
import dirtyStates from './dirty-states'

export const reducers = combineReducers({
    dirtyStates,
    models,
})



// WEBPACK FOOTER //
// ./app/libs/reform/src/reducers/index.js