import {
    makeRefsCollectionReducer,
    getModelsFromRef,
    refreshModelsReducer,
} from 'reducers/make-refs-reducer'

import compact from 'utilities/compact'
import moment from 'moment'
import uniqBy from 'lodash/uniqBy'

const getPostFeedCommentsResponseReducer = (state, action) => {
    const comments = getModelsFromRef(
        action.meta.nextDataState,
        action.payload,
    ).reduce(
        (arr, p) => (p.recentComments ? arr.concat(p.recentComments) : arr),
        [],
    )
    return uniqBy(
        [...state, ...comments, ...compact(comments.map(c => c.firstReply))],
        c => c.id,
    )
}

const getPostCommentsResponseReducer = (state, action) => {
    const comments = getModelsFromRef(action.meta.nextDataState, action.payload)
    return uniqBy(
        [...state, ...comments, ...compact(comments.map(c => c.firstReply))],
        c => c.id,
    )
}

const getCommentRepliesResponseReducer = (state, action) =>
    uniqBy(
        [
            ...state,
            ...getModelsFromRef(action.meta.nextDataState, action.payload),
        ],
        c => c.id,
    )

export const postCommentResponseReducer = (state, action) => [
    ...state,
    getModelsFromRef(action.meta.nextDataState, action.payload),
]

const deleteCommentSuccessReducer = (state, action) => {
    return state.reduce((arr, c) => {
        if (c.id !== action.meta.actionKey) {
            arr.push(c)
        } else if (c.replyCount > 0) {
            arr.push({
                ...c,
                body: '',
                deletedAt: moment().utc().format(),
            })
        }

        return arr
    }, [])
}

const postCommentVoteSuccessReducer = (state, action) => {
    const vote = getModelsFromRef(action.meta.nextDataState, action.payload)
        .vote
    return state.reduce((arr, c) => {
        const comment = { ...c }
        if (comment.id === action.meta.actionKey) {
            comment.voteSum += vote > 0 ? 1 : -1
            comment.currentUserVote = vote
        }
        arr.push(comment)
        return arr
    }, [])
}

export const getCommentSuccessReducer = refreshModelsReducer

export default makeRefsCollectionReducer('comment', {
    GET_POST_FEED_COMMENTS_SUCCESS: getPostFeedCommentsResponseReducer,
    GET_POST_COMMENTS_SUCCESS: getPostCommentsResponseReducer,
    GET_COMMENT_REPLIES_SUCCESS: getCommentRepliesResponseReducer,
    POST_COMMENT_SUCCESS: postCommentResponseReducer,
    PATCH_COMMENT_SUCCESS: refreshModelsReducer,
    DELETE_COMMENT_SUCCESS: deleteCommentSuccessReducer,
    POST_COMMENT_VOTE_SUCCESS: postCommentVoteSuccessReducer,
    GET_COMMENT_SUCCESS: getCommentSuccessReducer,
})



// WEBPACK FOOTER //
// ./app/reducers/comment.js