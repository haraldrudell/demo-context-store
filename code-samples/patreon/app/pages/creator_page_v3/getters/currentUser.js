import { createSelector } from 'reselect'
import access from 'safe-access'
import { getPageUserId, getCurrentUserPledgeId } from 'getters/current-user'
import exists from 'utilities/exists'


/* in the future maybe only id will exist on state
export const getCurrentUserId = (state) => state.currentUserId
*/
export const getCurrentUserId = (state) => access(state, 'currentUser.id')
export const getCurrentUser = (state) => state.currentUser
export const getCurrentUserIsPatron = (state) => !!access(state, `entities.pledge.${getCurrentUserPledgeId(state)}`)
export const getCurrentUserIsCreator = (state) => !!access(state, 'currentUser.campaign.publishedAt')

export const getCurrentUserIsPageOwner = createSelector(
    [getPageUserId, getCurrentUserId],
    (pageUserId, currentUserId) => {
        return exists(currentUserId) && currentUserId === pageUserId
    }
)



// WEBPACK FOOTER //
// ./app/pages/creator_page_v3/getters/currentUser.js