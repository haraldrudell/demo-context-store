import { combineReducers } from 'redux'

import modal from './modal'
export * from './modal'
export * from './blockStatus'

export default combineReducers({
    modal
})



// WEBPACK FOOTER //
// ./app/modules/BlockUserModal/core/index.js