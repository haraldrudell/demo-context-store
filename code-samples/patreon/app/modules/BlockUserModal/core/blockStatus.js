import get from 'lodash/get'
import { createSelector } from 'reselect'
import { selectData } from 'nion'

// Selectors
export const getIsUserBlocked = userId =>
    createSelector(selectData(`modules:blockUser:${userId}`), block => {
        return !!get(block, 'blockAction.id')
    })



// WEBPACK FOOTER //
// ./app/modules/BlockUserModal/core/blockStatus.js