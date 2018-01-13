import { createSelector } from 'reselect'
import access from 'safe-access'

/* In the future, maybe only pageUserId will exist on state
export const getPageUserId = state => access(state, 'pageUserId')
*/
export const getPageUserId = state => access(state, 'creator.creator.id')

export const getPageUser = state => access(state, `entities.user.${getPageUserId(state)}`)


export const getPageUserFullname = createSelector(
    getPageUser,
    (pageUser) => access(pageUser, 'attributes.fullName')
)

export const getPageOwnerIsPatronOfCurrentUser = createSelector(
    getPageUser,
    (pageUser) => !!access(pageUser, `relationships.pledgeToCurrentUser.data`)
)



// WEBPACK FOOTER //
// ./app/pages/creator_page_v3/getters/pageUser.js