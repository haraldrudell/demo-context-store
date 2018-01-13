import get from 'lodash/get'
import { COMMENT_EVENTS, logEvent } from 'analytics'
import apiRequestAction from 'actions/api-request-action'
import withOptimism from 'actions/with-optimism'
import { getPostCommentCount } from 'actions/post'
import {
    cursorFromComments,
    getTopLevelCommentsOnPost,
    postIdFromCommentId,
    parentIdFromCommentId,
} from 'getters/comment'
import { getCurrentUserId, getUserIsLoggedIn } from 'getters/current-user'

import jsonApiUrl from 'utilities/json-api-url'
import redirectToLogin from 'utilities/redirect-to-login'

const analyticsLocationForFeedNameMap = {
    OVERVIEW: COMMENT_EVENTS.CREATOR_OVERVIEW_SOURCE,
    POSTS: COMMENT_EVENTS.CREATOR_PAGE_SOURCE,
    COMMUNITY: COMMENT_EVENTS.COMMUNITY_PAGE_SOURCE,
    HOME: COMMENT_EVENTS.HOME_FEED_SOURCE,
    SINGLE_POST: COMMENT_EVENTS.POST_PAGE_SOURCE,
    INSTANT_ACCESS: COMMENT_EVENTS.INSTANT_ACCESS_SOURCE,
}

const analyticsLocationForFeedName = feedName =>
    get(analyticsLocationForFeedNameMap, feedName)

const getPostFeedCommentsIncludes = [
    'recent_comments.commenter',
    'recent_comments.parent',
    'recent_comments.post',
    'recent_comments.first_reply.commenter',
    'recent_comments.first_reply.parent',
    'recent_comments.first_reply.post',
]
const getPostFeedCommentsFields = {
    comment: [
        'body',
        'created',
        'deleted_at',
        'is_by_patron',
        'is_by_creator',
        'vote_sum',
        'current_user_vote',
        'reply_count',
    ],
    post: ['comment_count'],
    user: ['image_url', 'full_name', 'url'],
}

export const GET_POST_FEED_COMMENTS = 'GET_POST_FEED_COMMENTS'

export const getPostFeedComments = (endpoint, params = {}) => {
    return (dispatch, getState) => {
        dispatch(
            apiRequestAction(
                GET_POST_FEED_COMMENTS,
                jsonApiUrl(`${endpoint}`, {
                    ...params,
                    include: getPostFeedCommentsIncludes,
                    fields: getPostFeedCommentsFields,
                    'json-api-use-default-includes': false,
                }),
            ),
        )
    }
}

const getPostCommentsIncludes = [
    'commenter',
    'parent',
    'post',
    'first_reply.commenter',
    'first_reply.parent',
    'first_reply.post',
    'exclude_replies', // hacky fix to avoid fetching all replies. api currently forces 'replies' into the includes list.
]
const getPostCommentsFields = {
    comment: [
        'body',
        'created',
        'deleted_at',
        'is_by_patron',
        'is_by_creator',
        'vote_sum',
        'current_user_vote',
        'reply_count',
    ],
    post: ['comment_count'],
    user: ['image_url', 'full_name', 'url'],
}

export const GET_POST_COMMENTS = 'GET_POST_COMMENTS'

export const getPostComments = postId => {
    return (dispatch, getState) => {
        const comments = getTopLevelCommentsOnPost(postId)(getState())
        let cursor = cursorFromComments(comments) || null

        const params = {
            'page[count]': 10,
            sort: '-created',
        }

        if (cursor) {
            params['page[cursor]'] = cursor
        }

        dispatch(
            apiRequestAction(
                `${GET_POST_COMMENTS}__${postId}`,
                jsonApiUrl(`/posts/${postId}/comments`, {
                    include: getPostCommentsIncludes,
                    fields: getPostCommentsFields,
                    ...params,
                    'json-api-use-default-includes': false,
                }),
            ),
        )
    }
}

const getCommentIncludes = null
const getCommentFields = {
    comment: [
        'body',
        'created',
        'deleted_at',
        'is_by_patron',
        'is_by_creator',
        'vote_sum',
        'current_user_vote',
        'reply_count',
    ],
}

export const GET_COMMENT = 'GET_COMMENT'

export const getComment = (postId, commentId) => {
    return (dispatch, getState) => {
        dispatch(
            apiRequestAction(
                `${GET_COMMENT}__${commentId}`,
                jsonApiUrl(`/posts/${postId}/comments/${commentId}`, {
                    include: getCommentIncludes,
                    fields: getCommentFields,
                }),
            ),
        )
    }
}

const getCommentRepliesIncludes = ['commenter', 'parent', 'post']
const getCommentRepliesFields = {
    comment: [
        'body',
        'created',
        'deleted_at',
        'is_by_patron',
        'is_by_creator',
        'vote_sum',
        'current_user_vote',
    ],
    post: ['comment_count'],
    user: ['image_url', 'full_name', 'url'],
}

export const GET_COMMENT_REPLIES = 'GET_COMMENT_REPLIES'

export const getCommentReplies = commentId => {
    return (dispatch, getState) => {
        dispatch(
            apiRequestAction(
                `${GET_COMMENT_REPLIES}__${commentId}`,
                jsonApiUrl(`/comments/${commentId}/replies`, {
                    include: getCommentRepliesIncludes,
                    fields: getCommentRepliesFields,
                    'json-api-use-default-includes': false,
                }),
            ),
        )
    }
}

const postCommentIncludes = ['post.null', 'commenter.null', 'parent.null']
const postCommentFields = {
    post: ['comment_count'],
    user: ['image_url', 'full_name', 'url'],
}
export const POST_COMMENT = 'POST_COMMENT'

export const postComment = (
    commentBody,
    parentCommentId,
    postId,
    feedName = COMMENT_EVENTS.WEB_COMMENTS_V3_SOURCE,
) => {
    return (dispatch, getState) => {
        const url = jsonApiUrl('/comments', {
            include: postCommentIncludes,
            fields: postCommentFields,
        })

        const relationships = {
            post: {
                data: {
                    type: 'post',
                    id: postId,
                },
            },
            commenter: {
                data: {
                    type: 'user',
                    id: getCurrentUserId(getState()),
                },
            },
        }

        if (parentCommentId) {
            relationships.parent = {
                data: {
                    type: 'comment',
                    id: parentCommentId,
                },
            }
        }

        const body = {
            data: {
                type: 'comment',
                attributes: {
                    body: commentBody,
                },
                relationships,
            },
        }

        const requestAction = apiRequestAction(POST_COMMENT, url, { body })

        logEvent({
            domain: COMMENT_EVENTS.DOMAIN,
            title: COMMENT_EVENTS.ADD_EVENT,
            info: {
                post_id: postId,
                thread_id: parentCommentId,
                location: analyticsLocationForFeedName(feedName),
            },
        })

        dispatch(withOptimism(requestAction)).then(() => {
            dispatch(getPostCommentCount({ postId }))
            if (parentCommentId) dispatch(getComment(postId, parentCommentId))
        })
    }
}

export const PATCH_COMMENT = 'PATCH_COMMENT'

export const editComment = (
    commentBody,
    commentId,
    feedName = COMMENT_EVENTS.WEB_COMMENTS_V3_SOURCE,
) => {
    return (dispatch, getState) => {
        const url = jsonApiUrl(`/comments/${commentId}`, {
            include: null,
        })

        const body = {
            data: {
                type: 'comment',
                id: commentId,
                attributes: {
                    body: commentBody,
                },
            },
        }

        const requestAction = apiRequestAction(
            `${PATCH_COMMENT}__${commentId}`,
            url,
            { body },
        )

        logEvent({
            domain: COMMENT_EVENTS.DOMAIN,
            title: COMMENT_EVENTS.EDIT_EVENT,
            info: {
                comment_id: commentId,
                source: analyticsLocationForFeedName(feedName),
            },
        })

        dispatch(withOptimism(requestAction))
    }
}

export const DELETE_COMMENT = 'DELETE_COMMENT'

export const deleteComment = (
    commentId,
    feedName = COMMENT_EVENTS.WEB_COMMENTS_V3_SOURCE,
) => {
    return (dispatch, getState) => {
        const postId = postIdFromCommentId(getState(), commentId)
        const parentId = parentIdFromCommentId(getState(), commentId)
        // todo: use modals and stuff
        if (window.confirm('Are you sure you want to delete this comment?')) {
            const requestAction = apiRequestAction(
                `${DELETE_COMMENT}__${commentId}`,
                jsonApiUrl(`/comments/${commentId}`),
            )

            logEvent({
                domain: COMMENT_EVENTS.DOMAIN,
                title: COMMENT_EVENTS.DELETE_EVENT,
                info: {
                    comment_id: commentId,
                    location: analyticsLocationForFeedName(feedName),
                },
            })

            dispatch(withOptimism(requestAction)).then(() => {
                dispatch(getPostCommentCount({ postId }))
                if (parentId) dispatch(getComment(postId, parentId))
            })
        }
    }
}

const postCommentVoteIncludes = ['comment.null']
const postCommentVoteFields = {
    comment: ['vote_sum', 'current_user_vote'],
}

export const POST_COMMENT_VOTE = 'POST_COMMENT_VOTE'

export const toggleCommentVote = (
    commentId,
    currentUserVote,
    feedName = COMMENT_EVENTS.WEB_COMMENTS_V3_SOURCE,
) => {
    return (dispatch, getState) => {
        const state = getState()
        if (!getUserIsLoggedIn(state)) {
            return redirectToLogin({
                postLoginRedirectURI: window.location.pathname,
            })
        }

        const url = jsonApiUrl(`/comments/${commentId}/votes`, {
            include: postCommentVoteIncludes,
            fields: postCommentVoteFields,
        })

        const vote = currentUserVote > 0 ? 0 : 1
        const attributes = {
            vote,
        }

        const relationships = {
            comment: {
                data: {
                    type: 'comment',
                    id: commentId,
                },
            },
        }
        const body = {
            data: {
                type: 'comment-vote',
                attributes,
                relationships,
            },
        }

        const requestAction = apiRequestAction(
            `${POST_COMMENT_VOTE}__${commentId}`,
            url,
            { body },
        )

        logEvent({
            domain: COMMENT_EVENTS.DOMAIN,
            title: COMMENT_EVENTS.VOTE_EVENT,
            info: {
                comment_id: commentId,
                location: analyticsLocationForFeedName(feedName),
                vote,
            },
        })

        dispatch(requestAction)
    }
}



// WEBPACK FOOTER //
// ./app/actions/post-comment.js