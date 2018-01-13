/* eslint-disable react/no-multi-comp */
import t from 'prop-types'
import React from 'react'
import createReactClass from 'create-react-class'
import access from 'safe-access'
import pluralize from 'pluralize'
import find from 'lodash/find'

import Text from 'components/Text'
import TextButton from 'components/TextButton'
import LoadingSpinner from 'components/LoadingSpinner'

import Comment from './components/Comment'
import CommentSend from './components/CommentSend'

import {
    Comment as commentShape,
    User as userShape,
} from 'utilities/prop-types'
import withRedirect from 'utilities/with-redirect'

import { LoadReplies, Reply, ThreadHeader } from './styled-components'

export default createReactClass({
    displayName: 'CommentThread',

    propTypes: {
        currentUser: t.oneOfType([t.object, userShape]),
        postCommentCount: t.number,
        comments: t.arrayOf(commentShape).isRequired,
        noHandling: t.bool,
        onLoadMoreComments: t.func,
        onLoadReplies: t.func,
        onLikeClick: t.func,
        onPostComment: t.func,
        onEditComment: t.func,
        onDeleteComment: t.func,
        onClickUser: t.func,
        onEnterReplyMode: t.func,
        patreonUrl: t.string,
        loading: t.bool,
        showCommentSend: t.bool,
    },

    getDefaultProps: () => ({
        onLoadMoreComments: () => {},
        onLoadReplies: commentId => {},
        postCommentCount: 0,
        showCommentSend: true,
    }),

    getInitialState: () => ({
        replyParentId: null,
        editingComment: null,
    }),

    handleLoadMoreCommentsClick() {
        if (this.props.noHandling) {
            return
        }
        this.props.onLoadMoreComments()
    },

    handleReplyClick(commentId) {
        if (this.props.noHandling) {
            return
        }
        const matchingThreadHeadID = access(
            find(
                this.props.comments,
                threadHead =>
                    threadHead.id === commentId ||
                    !!find(threadHead.replies, reply => reply.id === commentId),
            ),
            'id',
        )
        this.setState({
            replyParentId: matchingThreadHeadID,
        })
        if (this.props.onEnterReplyMode) {
            this.props.onEnterReplyMode()
        }
    },

    handleCancelClick() {
        this.setState({
            replyParentId: null,
            editingComment: null,
        })
    },

    handleLoadRepliesClick(parentId) {
        if (this.props.noHandling) {
            return
        }
        this.props.onLoadReplies(parentId)
    },

    handleEditClick(comment) {
        if (this.props.noHandling) {
            return
        }
        this.setState({
            editingComment: comment,
        })
    },

    handlePostComment(commentBody, parentCommentId) {
        this.setState({
            replyParentId: null,
        })
        this.props.onPostComment(commentBody, parentCommentId)
    },

    handleEditComment(commentBody, commentId) {
        this.setState({
            editingComment: null,
        })
        this.props.onEditComment(commentBody, commentId)
    },

    renderComment(comment, i) {
        if (!comment) {
            return null
        }
        return access(this.state, 'editingComment.id') === comment.id ? (
            <div className="stackable">
                <CommentSend
                    noHandling={this.props.noHandling}
                    currentUser={this.props.currentUser}
                    onEditComment={this.handleEditComment}
                    onCancelClick={this.handleCancelClick}
                    editingComment={this.state.editingComment}
                />
            </div>
        ) : (
            <div key={i} className="stackable">
                <Comment
                    currentUserId={access(this.props, 'currentUser.id')}
                    comment={comment}
                    onReplyClick={this.handleReplyClick}
                    onLikeClick={this.props.onLikeClick}
                    onEditClick={this.handleEditClick}
                    onDeleteClick={this.props.onDeleteComment}
                    onClickUser={this.props.onClickUser}
                />
            </div>
        )
    },

    renderTopLevelComment(comment, i) {
        const numRepliesToLoad = comment.replyCount - comment.replies.length

        const loading = access(this.props, `repliesLoading[${comment.id}]`)

        const loadReplies = (
            <LoadReplies>
                {loading ? (
                    <LoadingSpinner size="md" color="light" />
                ) : (
                    <TextButton
                        scale="0"
                        weight="bold"
                        href={
                            this.props.noHandling
                                ? withRedirect('/login', this.props.patreonurl)
                                : undefined
                        }
                        onClick={() => this.handleLoadRepliesClick(comment.id)}
                    >
                        {`Load ${numRepliesToLoad} ${pluralize(
                            'reply',
                            numRepliesToLoad,
                        )}`}
                    </TextButton>
                )}
            </LoadReplies>
        )

        return (
            <div key={i}>
                {this.renderComment(comment, i)}
                <Reply>
                    {comment.replies.length > 0
                        ? comment.replies.map(this.renderComment)
                        : null}
                    {numRepliesToLoad > 0 ? loadReplies : null}
                    {!!this.state.replyParentId &&
                    comment.id === this.state.replyParentId ? (
                        <div className="stackable">
                            <CommentSend
                                noHandling={this.props.noHandling}
                                currentUser={this.props.currentUser}
                                onPostComment={this.handlePostComment}
                                onCancelClick={this.handleCancelClick}
                                parentCommentId={this.state.replyParentId}
                            />
                        </div>
                    ) : null}
                </Reply>
            </div>
        )
    },

    renderPlaceholderComment: (data, i) => {
        return (
            <div key={i} className="stackable">
                <Comment placeholder />
            </div>
        )
    },

    render() {
        const {
            postCommentCount,
            comments,
            loading,
            showCommentSend,
        } = this.props
        const topLevelComments = comments
        const allComments = topLevelComments.reduce(
            (memo, c) => memo.concat(c.replies),
            [...topLevelComments],
        )
        const numRepliesToLoad = topLevelComments.reduce((memo, c) => {
            // The comment has more replies than the replyCount in various legacy scenarios, so round up to 0
            return !c.replyCount
                ? memo
                : memo + Math.max(c.replyCount - c.replies.length, 0)
        }, 0)
        const hasTopLevelCommentsToLoad =
            allComments.length + numRepliesToLoad < postCommentCount
        const loadMoreComments = (
            <ThreadHeader>
                {loading ? (
                    <LoadingSpinner size="md" color="light" />
                ) : (
                    <TextButton
                        color="dark"
                        size={0}
                        href={
                            this.props.noHandling
                                ? withRedirect('/login', this.props.patreonUrl)
                                : undefined
                        }
                        onClick={this.handleLoadMoreCommentsClick}
                    >
                        Load more comments
                    </TextButton>
                )}
                {postCommentCount && (
                    <Text color="gray3" size={0}>
                        {`${allComments.length} of ${postCommentCount}`}
                    </Text>
                )}
            </ThreadHeader>
        )
        const placeholderComments = Array.apply(null, {
            length: Math.min(2, postCommentCount),
        }).map(this.renderPlaceholderComment)

        const initialLoad =
            allComments.length === 0 && postCommentCount > 0 && loading
        const renderedTopLevelComments = topLevelComments.map((comment, i) => {
            return this.renderTopLevelComment(comment, i)
        })

        return (
            <div>
                {hasTopLevelCommentsToLoad ? loadMoreComments : null}
                {initialLoad ? placeholderComments : renderedTopLevelComments}
                {showCommentSend && (
                    <CommentSend
                        noHandling={this.props.noHandling}
                        currentUser={this.props.currentUser}
                        onPostComment={this.handlePostComment}
                        onCancelClick={this.handleCancelClick}
                    />
                )}
            </div>
        )
    },
})



// WEBPACK FOOTER //
// ./app/features/posts/CommentThread/index.jsx