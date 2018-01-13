import t from 'prop-types'
import React, { Component } from 'react'
import TimeAgo from 'react-timeago'
import access from 'safe-access'
import get from 'lodash/get'

import {
    Wrapper,
    AvatarPlaceholder,
    TextPlaceholder,
    CommentBody,
    CommentAction,
} from './styled-components'
import Avatar from 'components/Avatar'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import Badge from 'components/Badge'
import LikesCounter from 'components/LikesCounter'
import LoadingSpinner from 'components/LoadingSpinner'
import PatronPopover from 'components/PatronPopover'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

import isOptimisticId from 'utilities/is-optimistic-id'

import { formatTimeAgo } from 'utilities/format-date'
import { Comment as commentShape } from 'utilities/prop-types'
import randomIntInclusive from 'utilities/random-int-inclusive'

class Comment extends Component {
    static propTypes = {
        currentUserId: t.string,
        comment: t.oneOfType([
            commentShape,
            t.shape({}), // When the comment is a placeholder, an empty object is supplied
        ]),
        onClickUser: t.func,
        onDeleteClick: t.func,
        onEditClick: t.func,
        onLikeClick: t.func,
        onReplyClick: t.func,
        placeholder: t.bool,
    }

    static defaultProps = {
        comment: {},
        onReplyClick: (commentId, parentId) => {},
        onLikeClick: (commentId, currentUserVote) => {},
        onEditClick: comment => {},
        onDeleteClick: commentId => {},
    }

    state = {
        actionsExpanded: false,
        placeholderNameWidth: '35%',
        placeholderBodyWidth: '75%',
    }

    componentWillMount() {
        this.setState({
            placeholderNameWidth: `${randomIntInclusive(20, 50)}%`,
            placeholderBodyWidth: `${randomIntInclusive(60, 90)}%`,
        })
    }

    handleReplyClick = () => {
        this.props.onReplyClick(
            this.props.comment.id,
            access(this.props.comment, 'parent.id'),
        )
    }

    handleLikeClick = () => {
        this.props.onLikeClick(
            this.props.comment.id,
            this.props.comment.currentUserVote,
        )
    }

    handleEditClick = () => {
        this.props.onEditClick(this.props.comment)
    }

    handleDeleteClick = () => {
        this.props.onDeleteClick(this.props.comment.id)
    }

    onClickUser = () => {
        if (this.props.onClickUser) {
            this.props.onClickUser(this.props.comment.commenter.id)
        }
    }

    handleMoreActionsClick = () => {
        this.setState({
            actionsExpanded: true,
        })
    }

    renderCommentAction = ({ onClick, type }) =>
        <CommentAction>
            <Icon type={type} size="xxs" color="gray3" onClick={onClick} />
        </CommentAction>

    renderLikeAction = ({ likeCount, currentUserHasLiked, onLikeClick }) =>
        <CommentAction>
            <LikesCounter
                likeCount={likeCount}
                currentUserHasLiked={currentUserHasLiked}
                size="xxs"
                loading={false}
                onLikeClick={onLikeClick}
            />
        </CommentAction>

    renderCommentActions = (comment, commenter) => {
        const isDeleted = !!comment.deletedAt
        const isCommentAuthor =
            !!this.props.currentUserId &&
            commenter.id === this.props.currentUserId
        const isPostAuthor =
            !!this.props.currentUserId &&
            get(comment, 'post.user.id') === this.props.currentUserId
        const canDelete = !isDeleted && (isCommentAuthor || isPostAuthor)
        const canEdit = !isDeleted && isCommentAuthor

        return (
            <Flexy alignItems="center">
                {this.renderCommentAction({
                    type: 'reply',
                    onClick: this.handleReplyClick,
                })}
                {this.renderLikeAction({
                    likeCount: comment.voteSum,
                    currentUserHasLiked: !!comment.currentUserVote,
                    onLikeClick: this.handleLikeClick,
                })}
                {(canEdit || canDelete) && !this.state.actionsExpanded
                    ? this.renderCommentAction({
                          type: 'ellipsis',
                          onClick: this.handleMoreActionsClick,
                      })
                    : null}
                {canEdit && this.state.actionsExpanded
                    ? this.renderCommentAction({
                          type: 'edit',
                          onClick: this.handleEditClick,
                      })
                    : null}
                {canDelete && this.state.actionsExpanded
                    ? this.renderCommentAction({
                          type: 'delete',
                          onClick: this.handleDeleteClick,
                      })
                    : null}
            </Flexy>
        )
    }

    render() {
        const { comment, placeholder } = this.props

        /* TODO: better fix in data layer so that this model is always available */
        const commenter = comment.commenter || {}
        const commenterNameColor = comment.isByCreator ? 'orange' : 'dark'

        const loadingSpinner = (
            <Block ml={2}>
                <LoadingSpinner size="md" color="dark" />
            </Block>
        )

        const timestamp = comment.created
            ? <Text color="gray3" size={0}>
                  <TimeAgo date={comment.created} formatter={formatTimeAgo} />
              </Text>
            : null

        const namePlaceholder = (
            <TextPlaceholder width={this.state.placeholderNameWidth}>
                &nbsp;
            </TextPlaceholder>
        )

        const bodyPlaceholder = (
            <TextPlaceholder width={this.state.placeholderBodyWidth}>
                &nbsp;
            </TextPlaceholder>
        )

        const isOptimistic = isOptimisticId(comment.id)

        return (
            <Wrapper data-test-tag="comment-row" isOptimistic={isOptimistic}>
                <Flexy justifyContent="flex-start">
                    {placeholder
                        ? <AvatarPlaceholder />
                        : <PatronPopover
                              patronId={commenter.id}
                              avatar={commenter.imageUrl}
                              fullName={commenter.fullName}
                          >
                              <Block mr={2}>
                                  <a
                                      href={`/user?u=${commenter.id}`}
                                      onClick={this.onClickUser}
                                  >
                                      <Badge
                                          bgColor="highlightPrimary"
                                          dot
                                          outline
                                          hideIfZero
                                          xOffset={9}
                                          yOffset={9}
                                          target={
                                              <Avatar
                                                  src={commenter.imageUrl}
                                                  size="xs"
                                              />
                                          }
                                      >
                                          {comment.isUnread ? 1 : 0}
                                      </Badge>
                                  </a>
                              </Block>
                          </PatronPopover>}
                    <div style={{ width: '100%' }}>
                        {placeholder
                            ? namePlaceholder
                            : <Flexy
                                  justifyContent="flex-start"
                                  alignItems="center"
                              >
                                  <PatronPopover
                                      patronId={commenter.id}
                                      avatar={commenter.imageUrl}
                                      fullName={commenter.fullName}
                                  >
                                      <TextButton
                                          href={`/user?u=${commenter.id}`}
                                          onClick={this.onClickUser}
                                          size={0}
                                          color={commenterNameColor}
                                      >
                                          {commenter.fullName}
                                      </TextButton>
                                  </PatronPopover>
                              </Flexy>}
                        {placeholder
                            ? bodyPlaceholder
                            : <CommentBody
                                  data-test-tag="comment-body"
                                  deleted={!!comment.deletedAt}
                              >
                                  {!!comment.deletedAt
                                      ? 'deleted'
                                      : <span
                                            dangerouslySetInnerHTML={{
                                                __html: comment.body,
                                            }}
                                        />}
                              </CommentBody>}
                        {!placeholder &&
                            !isOptimistic &&
                            this.renderCommentActions(comment, commenter)}
                    </div>
                </Flexy>
                {!placeholder &&
                    <Block style={{ flex: '0 0 auto' }}>
                        {isOptimistic ? loadingSpinner : timestamp}
                    </Block>}
            </Wrapper>
        )
    }
}

export default Comment



// WEBPACK FOOTER //
// ./app/features/posts/CommentThread/components/Comment/index.jsx