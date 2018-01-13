import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import get from 'lodash/get'

import Post from 'features/posts/Post'
import {
    GET_POST_FEED_COMMENTS,
    GET_POST_COMMENTS,
    GET_COMMENT_REPLIES,
    getPostComments,
    getCommentReplies,
    postComment,
    editComment,
    deleteComment,
    toggleCommentVote,
} from 'actions/post-comment'
import {
    getPostLikes,
    toggleLike,
    POST_LIKE,
    DELETE_LIKE,
} from 'actions/post-like'
import { GET_POST_LIKE_COUNT } from 'actions/post'
import { POST_POLL_RESPONSE } from 'actions/poll'
import { deletePost } from 'actions/post-delete'
import { getPageUserId } from 'getters/page-user'
import loadingGetter from 'getters/loading-getter'
import getDisplayProps from 'features/posts/Post/get-display-props'
import { createFromParsedPost } from 'components/ShareButtons/create-buttons'
import { getCurrentUser } from 'getters/current-user'
import { getLikesOnPost } from 'getters/like'
import redirectToLogin from 'utilities/redirect-to-login'
import {
    postPollResponse,
    startUnvotingAllResponses,
    finishUnvotingAllResponses,
} from 'actions/poll'
import { getPollForPost } from 'getters/poll'
import { getPost } from 'actions/make-post'
import { getCommentsOnPost } from 'getters/comment'

const postSelector = (state, ownProps) => ownProps.post
const postIdSelector = (state, ownProps) => ownProps.post.id
const pollIdSelector = (state, ownProps) =>
    get(ownProps, 'post.relationships.poll.id')

const mapStatetoProps = createSelector(
    postSelector,
    getPageUserId,
    getCurrentUser,
    loadingGetter(
        [POST_LIKE, DELETE_LIKE, GET_POST_LIKE_COUNT],
        postIdSelector,
    ),
    (state, ownProps) => getLikesOnPost(state, ownProps.post.id),
    (state, ownProps) => getCommentsOnPost(ownProps.post.id)(state),
    (state, ownProps) => ownProps.post.recentComments,
    loadingGetter(GET_POST_FEED_COMMENTS),
    loadingGetter(GET_POST_COMMENTS, postIdSelector),
    state => get(state.requests, GET_COMMENT_REPLIES),
    (state, ownProps) => getPollForPost(state, ownProps.post),
    loadingGetter(POST_POLL_RESPONSE, pollIdSelector),
    state => state,
    state => state.unvotePollResponses,
    (
        post,
        postContextOwnerId,
        currentUser,
        likeLoading,
        likesOnPost,
        comments,
        recentCommentsHack,
        feedCommentsLoading,
        postCommentsLoading,
        commentRepliesRequest,
        poll,
        pollResponsesLoading,
        state,
        unvotePollResponses,
    ) => {
        const {
            changeVisibilityAt,
            id,
            user,
            title,
            isPaid,
            publishedAt,
            campaign,
            commentCount,
            currentUserHasLiked,
            likeCount,
            minCentsPledgedToView,
            patronCount,
            patreonUrl,
            currentUserCanView,
            currentUserCanDelete,
            upgradeUrl,
        } = post
        const earningsVisibility = get(campaign, 'earningsVisibility')
        const currentUserPledgeAmount = get(
            campaign,
            'currentUserPledge.amountCents',
            0,
        )
        return {
            author: user,
            changeVisibilityAt,
            commentCount,
            comments: comments.length ? comments : recentCommentsHack,
            commentsLoading: feedCommentsLoading || postCommentsLoading,
            currentUser,
            currentUserCanView,
            currentUserCanDelete,
            currentUserHasLiked,
            currentUserPledgeAmount,
            earningsVisibility,
            id,
            isPaid,
            likeCount,
            likeLoading,
            likesOnPost,
            minCentsPledgedToView,
            patronCount,
            patreonUrl,
            shareButtons: createFromParsedPost(post),
            upgradeUrl,
            poll,
            pollResponsesLoading,
            postContextOwnerId,
            publishedAt,
            repliesLoading:
                commentRepliesRequest &&
                Object.keys(commentRepliesRequest).reduce((memo, key) => {
                    memo[key] = !!commentRepliesRequest[key].pending
                    return memo
                }, {}),
            title,
            unvotePollResponses,
            ...getDisplayProps(post),
        }
    },
)

const mapDispatchToProps = (dispatch, ownProps) => ({
    onLoadMoreComments: () => dispatch(getPostComments(ownProps.post.id)),
    onLoadReplies: commentId => dispatch(getCommentReplies(commentId)),
    onLikeClick: data => dispatch(toggleLike(data)),
    onLikeCommentClick: (commentId, currentUserVote) =>
        dispatch(
            toggleCommentVote(commentId, currentUserVote, ownProps.feedName),
        ),
    onPostComment: (commentBody, parentCommentId) =>
        dispatch(
            postComment(
                commentBody,
                parentCommentId,
                ownProps.post.id,
                ownProps.feedName,
            ),
        ),
    onEditComment: (commentBody, commentId) =>
        dispatch(editComment(commentBody, commentId, ownProps.feedName)),
    onDeleteClick: data => dispatch(deletePost(data)),
    onDeleteComment: commentId =>
        dispatch(deleteComment(commentId, ownProps.feedName)),
    retrieveLikes: nextUrl =>
        dispatch(getPostLikes({ postId: ownProps.post.id, nextUrl: nextUrl })),
    postPollResponse: (pollId, pollChoices, feedName, isVoting, postId) => {
        if (pollChoices && pollChoices.length > 0) {
            dispatch(
                postPollResponse(
                    pollId,
                    pollChoices,
                    feedName,
                    isVoting,
                    postId,
                ),
            )
        } else {
            dispatch(startUnvotingAllResponses()).then(() =>
                dispatch(
                    postPollResponse(
                        pollId,
                        pollChoices,
                        feedName,
                        isVoting,
                        postId,
                    ),
                ).then(() =>
                    dispatch(getPost(ownProps.post.id)).then(() =>
                        dispatch(finishUnvotingAllResponses()),
                    ),
                ),
            )
        }
    },
})

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    let alteredDispatchProps = dispatchProps

    if (ownProps.isLoggedOut) {
        // Give ourselves a few ms to send the analytics events.
        const redirect = url => {
            setTimeout(() => {
                redirectToLogin({ postLoginRedirectURI: url }), 20
            })
        }

        // This removes all of the actions because, hey, we don't actually want
        // any of them to fire. And in fact, they should redirect.
        alteredDispatchProps = {}
        const keys = Object.keys(dispatchProps)
        for (let i = 0; i < keys.length; i++) {
            // retrieveLikes is actually chill.
            if (keys[i] === 'retrieveLikes') {
                alteredDispatchProps[keys[i]] = dispatchProps[keys[i]]
            } else {
                alteredDispatchProps[keys[i]] = redirect.bind(
                    window,
                    ownProps.post.patreonUrl,
                )
            }
        }
    }
    return {
        ...stateProps,
        ...alteredDispatchProps,
        ...ownProps,
    }
}

export default connect(mapStatetoProps, mapDispatchToProps, mergeProps)(Post)



// WEBPACK FOOTER //
// ./app/containers/single-post.js