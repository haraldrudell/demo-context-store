import { createSelector } from 'reselect'
import last from 'lodash/last'
import access from 'safe-access'

import { getCurrentPostTag } from 'getters/post-tags'
import { GET_POST_FEED } from 'actions/post-feed'
import { POST_FILTERS } from 'constants/posts'
import { POST_DISPLAY_TYPES } from 'constants/posts'
import {
    getPostAggregationConfig,
    getPostAggregationPrefixes,
    getAllPostAggregationCreatorsRandomized,
} from 'getters/post-aggregation'
import { POSTS, OVERVIEW } from 'constants/feednames'

/* Helpers */
export const cursorFromFeed = items => {
    return access(last(items), 'publishedAt')
}

/* Stream */
export const getUnfilteredStreamPosts = state =>
    access(state.refs, 'streams.all_creators') || []
export const getStreamFilterCreatorId = state =>
    access(state, 'streamFilter.creatorId')
export const getStreamFilterFeedName = state =>
    access(state, 'streamFilter.feedName') || ''
export const getStreamFilterShowExclusivePosts = state =>
    access(state, 'streamFilter.options.includeExclusivePosts')
export const getStreamFilterShowPostAggregations = state =>
    access(state, 'streamFilter.options.includePostAggregations')
export const getExclusiveStreamFilterPostType = (state, ownProps) =>
    Number(access(ownProps, 'location.query.patrononly'))
export const getUserFollows = state =>
    access(state.refs, 'currentUser.follows') || []
export const getUserPledges = state =>
    access(state.refs, 'currentUser.pledges') || []

export const getStreamId = createSelector(
    [getStreamFilterCreatorId, getStreamFilterFeedName],
    (creatorId, feedName) => {
        if (!creatorId) return 'all_creators'
        return `${creatorId}${feedName}`
    },
)

const getExclusiveStreamPosts = posts =>
    posts.filter(p => p.minCentsPledgedToView > 0)

const streamPostsWithAggregations = (
    streamPosts,
    postAggregationCreators,
    postAggregationConfig,
    aggregationPrefixes,
) => {
    let currentPostAggregation = 0
    let iterationDisplayCount = postAggregationConfig.startIndex
    return streamPosts.reduce((posts, p, i) => {
        if (postAggregationCreators.length > 0 && i === iterationDisplayCount) {
            posts.push({
                postType: POST_DISPLAY_TYPES.PROMOTION,
                hookPrefix: aggregationPrefixes[currentPostAggregation],
                ...postAggregationCreators[
                    currentPostAggregation % postAggregationCreators.length
                ],
            })
            currentPostAggregation += 1
            iterationDisplayCount += postAggregationConfig.displayEveryNthPost
        }
        posts.push(p)
        return posts
    }, [])
}

export const getFilteredStreamPosts = createSelector(
    [
        state => state.refs.streams,
        getStreamId,
        getAllPostAggregationCreatorsRandomized,
        getPostAggregationPrefixes,
        getPostAggregationConfig,
        getExclusiveStreamFilterPostType,
        getStreamFilterShowPostAggregations,
        getStreamFilterFeedName,
        getCurrentPostTag,
    ],
    (
        streams,
        streamId,
        postAggregationCreators,
        aggregationPrefixes,
        postAggregationConfig,
        postType,
        showAggregationCards,
        feedName,
        postTag,
    ) => {
        const streamPosts = streams[`${streamId}`] || []
        if (postType === POST_FILTERS.EXCLUSIVE) {
            return getExclusiveStreamPosts(streamPosts)
        }

        const aggregationEnabledFeeds =
            feedName === POSTS || feedName === OVERVIEW
        if (
            !showAggregationCards ||
            !postAggregationConfig ||
            !aggregationEnabledFeeds ||
            !!postTag
        ) {
            return streamPosts
        }

        return streamPostsWithAggregations(
            streamPosts,
            postAggregationCreators,
            postAggregationConfig,
            aggregationPrefixes,
        )
    },
)

export const getFilteredStreamRequest = createSelector(
    state => state.requests[GET_POST_FEED],
    getStreamId,
    (postFeedRequests, streamId) => postFeedRequests[streamId],
)

/* PostFeed */
/* TODO: If api response comply, this can be reused for anything feed-like. Could live somewhere else.
Same goes for cursor, etc. etc. */
export const getPostFeedCanLoadMore = createSelector(
    getFilteredStreamRequest,
    request => {
        if (!request) return true
        if (request.pending) return false
        if (request.error) return true
        return true
        // todo: error message logic
        // !(error && error === POST_FEED_ERROR_TYPES.NO_MORE_POSTS)
    },
)



// WEBPACK FOOTER //
// ./app/getters/post-feed.js