import access from 'safe-access'
import shuffle from 'lodash/shuffle'
import { createSelector } from 'reselect'
import {
    getCurrentCreatorUserId,
    getCurrentCreator,
    getCreatorPostAggregation,
    getCreatorEntity,
} from 'getters/creator'
import {
    getCurrentUserPledging,
    getCurrentUserFollowing,
    getCurrentUserIsPatron,
    getCurrentUserId,
} from 'getters/current-user'

const makePostAggregation = (
    postAggregationMetaData,
    creator,
    isPatron,
    isFollowing,
) => ({
    ...postAggregationMetaData,
    isPatron,
    isFollowing,
    author: {
        id: creator.id,
        fullName: creator.fullName,
    },
})

export const getPostAggregationConfig = (state, ownProps) =>
    access(ownProps, 'postAggregationConfig') || null
export const getPostAggregationPrefixes = state =>
    access(state.refs, 'postAggregationPrefixes') || []
export const getCreatorPostAggregationId = state =>
    access(getCurrentCreator(state), 'postAggregation.id')

export const getCurrentCreatorPostAggregation = createSelector(
    [
        getCurrentCreatorUserId,
        getCreatorEntity,
        getCreatorPostAggregationId,
        getCreatorPostAggregation,
        getCurrentUserIsPatron,
        getCurrentUserId,
        state => state,
    ],
    (
        creatorId,
        creator,
        postAggregationId,
        postAggregation,
        isPatron,
        currentUserId,
        state,
    ) => {
        const creatorData = {
            fullName: access(creator, `${creatorId}.attributes.fullName`),
            id: creatorId,
        }
        const postAggregationMetaData = access(
            postAggregation,
            `${postAggregationId}.attributes`,
        )
        if (
            !postAggregationMetaData ||
            !creator ||
            !!isPatron ||
            currentUserId === creatorId
        ) {
            return []
        }
        const isFollowing = !isPatron
        return [
            makePostAggregation(
                postAggregationMetaData,
                creatorData,
                isPatron,
                isFollowing,
            ),
        ]
    },
)

export const getUserFollowPostAggregations = createSelector(
    [getCurrentUserFollowing],
    follows => {
        if (!follows) return []
        return follows.reduce((a, creator) => {
            const postAggregation = access(creator, 'campaign.postAggregation')
            if (postAggregation && postAggregation.nextInaccessiblePostsCount) {
                a.push(
                    makePostAggregation(postAggregation, creator, false, true),
                )
            }
            return a
        }, [])
    },
)

export const getUserPledgePostAggregations = createSelector(
    [getCurrentUserPledging],
    pledges => {
        if (!pledges) return []
        return pledges.reduce((a, creator) => {
            const postAggregation = access(creator, 'campaign.postAggregation')
            if (postAggregation && postAggregation.nextInaccessiblePostsCount) {
                a.push(
                    makePostAggregation(postAggregation, creator, true, false),
                )
            }
            return a
        }, [])
    },
)

let shuffled = false
let aggregations = []
export const getAllPostAggregationCreatorsRandomized = createSelector(
    [
        getUserFollowPostAggregations,
        getUserPledgePostAggregations,
        getCurrentCreatorPostAggregation,
    ],
    (
        followPostAggregations,
        pledgePostAggregations,
        currentCreatorPostAggregation,
    ) => {
        if (!shuffled || aggregations.length === 0) {
            aggregations = shuffle([
                ...followPostAggregations,
                ...pledgePostAggregations,
                ...currentCreatorPostAggregation,
            ])
            shuffled = true
            return aggregations
        } else {
            return aggregations
        }
    },
)



// WEBPACK FOOTER //
// ./app/getters/post-aggregation.js