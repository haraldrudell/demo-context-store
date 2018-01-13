import { createSelector } from 'reselect'
import compact from 'utilities/compact'
import access from 'safe-access'
import difference from 'lodash/difference'
import differenceBy from 'lodash/differenceBy'
import find from 'lodash/find'

export const getCurrentUser = state => access(state, 'refs.currentUser')

export const getCurrentUserId = state => access(getCurrentUser(state), 'id')

//While logged out, The current user ref is an object with no id.
export const getUserIsLoggedIn = state => !!getCurrentUserId(state)

export const getCurrentUserPledgingOrFollowing = createSelector(
    getCurrentUser,
    currentUser => {
        const pledges = currentUser.pledges
            ? currentUser.pledges.map(pledge => pledge.creator)
            : []
        const follows = currentUser.follows
            ? currentUser.follows.map(follow => follow.followed)
            : []
        const union = pledges
            .concat(follows)
            .filter(creator => creator !== undefined)
        return union.length === 0 ? null : union
    },
)

export const getCurrentUserPledging = createSelector(
    getCurrentUser,
    currentUser =>
        currentUser.pledges
            ? compact(currentUser.pledges.map(pledge => pledge.creator))
            : null,
)

export const getCurrentUserIsCreator = createSelector(
    getCurrentUser,
    currentUser => (currentUser.campaign ? true : false),
)

export const getCurrentUserCampaignId = createSelector(
    getCurrentUser,
    currentUser => access(currentUser, 'campaign.id'),
)

export const getCurrentUserCampaign = createSelector(
    getCurrentUser,
    currentUser => currentUser.campaign,
)

export const getCurrentUserPledgingCampaignIds = createSelector(
    getCurrentUser,
    currentUser =>
        currentUser.pledges
            ? compact(
                  currentUser.pledges.map(pledge => pledge.creator.campaign.id),
              )
            : null,
)

export const getCurrentUserPledgingAsPledge = createSelector(
    getCurrentUser,
    currentUser =>
        currentUser.pledges
            ? compact(currentUser.pledges.map(pledge => pledge))
            : null,
)

export const getCurrentUserFollowing = createSelector(
    getCurrentUserPledgingOrFollowing,
    getCurrentUserPledging,
    (currentUserPledgingAndFollowing, supporting) =>
        difference(currentUserPledgingAndFollowing, supporting),
)

const getSuggestedCreatorsUnfiltered = createSelector(
    state => state.refs.suggestedCreators,
    suggestedCampaigns => suggestedCampaigns.map(campaign => campaign.creator),
)

export const getCurrentUserSuggested = createSelector(
    getCurrentUserPledgingOrFollowing,
    getSuggestedCreatorsUnfiltered,
    (currentUserPledgingAndFollowing, suggestedCreatorsUnfiltered) =>
        differenceBy(
            suggestedCreatorsUnfiltered,
            currentUserPledgingAndFollowing,
            'id',
        ),
)

export const getPageUserId = state => access(state, 'creator.creator.id')

export const getPageUser = state =>
    access(state, `entities.user.${getPageUserId(state)}`)

export const currentUserPledgesAreHiddenSelector = createSelector(
    getCurrentUser,
    currentUser => currentUser.hidePledges,
)

export const getPageCampaignId = createSelector(getPageUser, pageUser =>
    access(pageUser, 'relationships.campaign.data.id'),
)

export const getPageCampaign = state =>
    access(state, `entities.campaign.${getPageCampaignId(state)}`)

export const getPageCampaignPhoneNumber = createSelector(
    getCurrentUser,
    currentUser => access(currentUser, 'phoneNumber'),
)

export const getCurrentUserPledgeId = createSelector(
    getPageCampaign,
    pageCampaign => {
        return (
            access(pageCampaign, 'relationships.currentUserPledge.data.id') ||
            null
        )
    },
)

export const getCurrentUserIsPatron = state =>
    !!access(state, `entities.pledge.${getCurrentUserPledgeId(state)}`)

export const getCurrentUserIsFollowing = createSelector(
    getCurrentUser,
    getPageUserId,
    (currentUser, pageUserId) => {
        const followId = `${currentUser.id}-${pageUserId}`

        return (
            typeof find(access(currentUser, 'follows'), { id: followId }) !==
            'undefined'
        )
    },
)

export const getCurrentCreatorHasLaunched = state =>
    !!access(state.refs, 'currentUser.campaign.publishedAt.length')

// NOTE: I'm adding this and following the patterns set above, but in general we
// want to avoid accessing info from refs like this.  I'll sync with people
// about where we are on that quest, but for now I'm doing a quick addition and
// just following the patterns of the file.
export const getCurrentUserCampaignPublishedAt = state =>
    access(state.refs, 'currentUser.campaign.publishedAt')



// WEBPACK FOOTER //
// ./app/getters/current-user.js