import loadingGetter from 'getters/loading-getter'
import { getExclusiveStreamFilterPostType } from 'getters/post-feed'
import { getPostFeedComments } from 'actions/post-comment'
import { generatePostAggregationPrefixes } from 'actions/post-aggregation-prefixes'
import apiRequestAction from 'actions/api-request-action'
import { COMMUNITY } from 'constants/feednames'
import jsonApiUrl from 'utilities/json-api-url'
import {
    cursorFromFeed,
    getStreamId,
    getFilteredStreamPosts,
    getPostFeedCanLoadMore,
    getStreamFilterShowPostAggregations,
    getStreamFilterShowExclusivePosts
} from 'getters/post-feed'
import {
    getCurrentPostTag
} from 'getters/post-tags'
import {
    HOME_STREAM_START_POSITION,
    HOME_STREAM_DISPLAY_ITERATION,
    CREATOR_STREAM_START_POSITION,
    CREATOR_STREAM_DISPLAY_ITERATION
} from 'constants/promotions'
import {
    PAID_FOR_BY_PATRONS_TAG_TYPE,
    PUBLIC_TAG_TYPE,
    PATRON_ONLY_TAG_TYPE,
    YEAR_MONTH_TAG_TYPE,
    REWARD_TIER_TAG_TYPE,
    USER_DEFINED_TAG_TYPE
} from 'constants/post-tags'
import moment from 'moment'
import momenttz from 'moment-timezone'


export const GET_POST_FEED = 'GET_POST_FEED'
export const GET_POST_FEED_AND_REPLACE = 'GET_POST_FEED_AND_REPLACE'
export const POST_FEED_ERROR_TYPES = {
    NO_MORE_POSTS: 'NO_MORE_POSTS'
}

const getStreamIncludes = [
    'user',
    'attachments',
    'user_defined_tags',
    'campaign',
    'poll.choices',
    'poll.current_user_responses.user',
    'poll.current_user_responses.choice',
    'poll.current_user_responses.poll',
]
const getStreamFields = {
    'post': [
        'change_visibility_at',
        'comment_count',
        'content',
        'current_user_can_delete',
        'current_user_can_view',
        'current_user_has_liked',
        'early_access_min_cents',
        'embed',
        'image',
        'is_paid',
        'like_count',
        'min_cents_pledged_to_view',
        'post_file',
        'published_at',
        'patron_count',
        'patreon_url',
        'post_type',
        'pledge_url',
        'thumbnail_url',
        'title',
        'upgrade_url',
        'url',
    ],
    'user': [
        'image_url',
        'full_name',
        'url'
    ],
    'campaign': [
        'earnings_visibility'
    ]
}

const fixCursor = (cursor) => {
    /**
     Server returns anything <= to cursor, so it duplicates
     the last post of the previous page unless we do this.
     If there are multiple posts with the exact same timestamp,
     this might skip some of them. Ideal way to fix would be for server
     to accept a cursor and also a 'fallback' cursor. -gb
     */

    return moment(cursor).subtract(1, 'ms').utc().format()
}

const getStreamCursorFromFeed = (stream) => {
    let cursor = cursorFromFeed(stream) || null
    if (cursor) cursor = fixCursor(cursor)
    return cursor
}

const fetchStream = (streamId, streamParams, streamName = '', postAggregationConfig, resetFeed) => {
    return (dispatch, getState) => {
        const state = getState()
        const filterId = getExclusiveStreamFilterPostType(state)
        const exclusivePostsEnabled = getStreamFilterShowExclusivePosts(state)
        if (!!filterId) streamParams = { ...streamParams, 'filter[is_exclusive]': filterId }
        /**
         * If caller hasn't specified `contains_exclusive_posts` we'll set
         * based on `exclusivePostsEnabled` alone otherwise respect what
         * the caller wants and if `exclusivePostsEnabled` is true.
         */

        if (
            !!exclusivePostsEnabled &&
            typeof streamParams['filter[contains_exclusive_posts]'] === 'undefined'
        ) {
            streamParams = { ...streamParams, 'filter[contains_exclusive_posts]': true }
        }

        const actionTypeAndKey = resetFeed ? `${GET_POST_FEED_AND_REPLACE}__${streamId}${streamName}` : `${GET_POST_FEED}__${streamId}${streamName}`

        dispatch(apiRequestAction(actionTypeAndKey,
        jsonApiUrl(
            '/stream',
            {
                include: getStreamIncludes,
                fields: getStreamFields,
                ...streamParams,
                'json-api-use-default-includes': false,
            }
        ))).then(() => {
            const showPostAggregations = getStreamFilterShowPostAggregations(getState())
            if (showPostAggregations && postAggregationConfig) {
                const streamPosts = getFilteredStreamPosts(getState())
                dispatch(generatePostAggregationPrefixes(streamPosts, postAggregationConfig))
            }
        })
        .then(() => {
            dispatch(getPostFeedComments('/stream', streamParams))
        })
    }
}

export const getStream = () => {
    return (dispatch, getState) => {
        const state = getState()
        const streamId = getStreamId(state)
        const stream = getFilteredStreamPosts(state)

        let streamParams = {
            'page[cursor]': getStreamCursorFromFeed(stream),
            'filter[is_following]': true
        }

        const postAggregationConfig = {
            displayEveryNthPost: HOME_STREAM_DISPLAY_ITERATION,
            startIndex: HOME_STREAM_START_POSITION
        }

        dispatch(fetchStream(streamId, streamParams, '', postAggregationConfig))
    }
}

export const getStreamWithPaginationParams = (streamParams) => {
    return (dispatch, getState) => {
        const state = getState()
        const streamId = getStreamId(state)
        const stream = getFilteredStreamPosts(state)

        if (!!streamParams['page[cursor]']) {
            streamParams['page[cursor]'] = getStreamCursorFromFeed(stream)
        }

        const postAggregationConfig = {
            displayEveryNthPost: HOME_STREAM_DISPLAY_ITERATION,
            startIndex: HOME_STREAM_START_POSITION
        }

        dispatch(fetchStream(streamId, streamParams, '', postAggregationConfig))
    }
}

export const getStreamIfEmpty = () => {
    return (dispatch, getState) => {
        const state = getState()
        const stream = getFilteredStreamPosts(state)
        const canLoadMore = getPostFeedCanLoadMore(state)
        const loading = loadingGetter(GET_POST_FEED, getStreamId)(state)

        if (stream.length === 0 && canLoadMore && !loading) dispatch(getStream())
    }
}

export const getStreamForCreator = (creatorId, byCreator, feedName, resetFeed = false) => {
    return (dispatch, getState) => {
        const state = getState()
        const stream = getFilteredStreamPosts(state)
        const currentPostTag = getCurrentPostTag(state)

        let streamParams = {
            'page[cursor]': resetFeed ? null : getStreamCursorFromFeed(stream),
            'filter[is_by_creator]': byCreator,
            'filter[is_following]': false
        }

        if (feedName === COMMUNITY) streamParams = { ...streamParams, 'filter[contains_exclusive_posts]': false }
        if (!!creatorId) streamParams = { ...streamParams, 'filter[creator_id]': creatorId }
        if (!!currentPostTag) {
            switch(currentPostTag.filterType) {
                case PAID_FOR_BY_PATRONS_TAG_TYPE:
                    if (currentPostTag.value === 'Paid for by Patrons') {
                        streamParams = { ...streamParams, 'filter[paid_for_by_patrons_tags]': 'true'}
                    }
                    break
                case USER_DEFINED_TAG_TYPE:
                    streamParams = { ...streamParams, 'filter[user_defined_tags]': encodeURIComponent(currentPostTag.value)}
                    break
                case PUBLIC_TAG_TYPE:
                    if (currentPostTag.value === 'Public') {
                        streamParams = { ...streamParams, 'filter[public_post_tags]': 'true'}
                    }
                    break
                case PATRON_ONLY_TAG_TYPE:
                    if (currentPostTag.value === 'Patron Only') {
                        streamParams = { ...streamParams, 'filter[patron_only_tags]': 'true'}
                    }
                    break
                case REWARD_TIER_TAG_TYPE:
                    streamParams = { ...streamParams, 'filter[reward_tier_tags]': encodeURIComponent(currentPostTag.value)}
                    break
                case YEAR_MONTH_TAG_TYPE:
                    streamParams = {
                        ...streamParams,
                        'filter[year_month_tags]': encodeURIComponent(currentPostTag.value),
                        'timezone': momenttz.tz.guess()
                    }
                    break
                default:
                    break
            }
        }

        const postAggregationConfig = {
            displayEveryNthPost: CREATOR_STREAM_DISPLAY_ITERATION,
            startIndex: CREATOR_STREAM_START_POSITION
        }

        dispatch(fetchStream(creatorId, streamParams, feedName, postAggregationConfig, resetFeed))
    }
}

export const getStreamForCreatorWithPaginationParams = (creatorId, streamParams, feedName) => {
    return (dispatch, getState) => {
        const state = getState()
        const stream = getFilteredStreamPosts(state)

        const postAggregationConfig = {
            displayEveryNthPost: CREATOR_STREAM_DISPLAY_ITERATION,
            startIndex: CREATOR_STREAM_START_POSITION
        }

        if (!!streamParams['page[cursor]']) {
            streamParams['page[cursor]'] = getStreamCursorFromFeed(stream)
        }

        dispatch(fetchStream(creatorId, streamParams, feedName, postAggregationConfig, false))
    }
}

export const getStreamForCreatorIfEmpty = (creatorId, byCreator, feedName) => {
    return (dispatch, getState) => {
        const state = getState()
        const stream = getFilteredStreamPosts(state)
        const canLoadMore = getPostFeedCanLoadMore(state)
        const loading = loadingGetter(GET_POST_FEED, getStreamId)(state)
        if (stream.length === 0 && canLoadMore && !loading) {
            dispatch(
                getStreamForCreator(creatorId, byCreator, feedName)
            )
        }
    }
}

export const resetStreamForCreator = (creatorId, byCreator, feedName) => {
    return (dispatch, getState) => {
        const state = getState()
        const loading = loadingGetter(GET_POST_FEED_AND_REPLACE, getStreamId)(state)
        if (!loading) {
            dispatch(getStreamForCreator(creatorId, byCreator, feedName, true))
        }
    }
}



// WEBPACK FOOTER //
// ./app/actions/post-feed.js