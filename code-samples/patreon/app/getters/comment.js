import { createSelector } from 'reselect'

import access from 'safe-access'
import moment from 'moment'

/* helpers */
export const cursorFromComments = (items) => access(items, '[0].id')

export const postIdFromCommentId = (state, commentId) =>
    access(state, `data.comment.${commentId}.relationships.post.id`)

export const parentIdFromCommentId = (state, commentId) =>
    access(state, `data.comment.${commentId}.relationships.parent.id`)

export const filteredAndSortedComments = (comments, postId) => (
    comments.filter(c => c.post.id === postId).sort((c1, c2) => moment(c1.created).isBefore(moment(c2.created)) ? -1 : 1)
)

/* selectors */
export const getPostFeedComments = (state) => state.refs.comments || []

export const getCommentsOnPost = (postId) => createSelector(
    getPostFeedComments,
    (comments) => filteredAndSortedComments(comments, postId)
)

export const getTopLevelCommentsOnPost = (postId) => createSelector(
    getCommentsOnPost(postId),
    (comments) => comments.filter(c => !c.parent)
)



// WEBPACK FOOTER //
// ./app/getters/comment.js