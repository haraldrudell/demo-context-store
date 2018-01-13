import React, { Component } from 'react'
import access from 'safe-access'
import cl from 'classnames'
import { withState } from 'recompose'
import get from 'lodash/get'
import moment from 'moment'
import { parse as urlparse } from 'url'
import PropTypes from 'prop-types'
import querystring from 'querystring'
import values from 'lodash/values'
import {
    INSTANT_ACCESS_EVENTS,
    POST_EVENTS,
    POST_IN_FEED_EVENTS,
    POST_PAGE_EVENTS,
    logPostEvent,
    logEvent,
    logInstantAccessEvent,
    logPostInFeedEvent,
    logPostPageEvent,
} from 'analytics'

import withRenderAsClient from 'libs/with-render-as-client'
import { withLocalStorage } from 'libs/with-local-storage'
import { withFeatureFlag } from 'libs/with-feature-flag'
import { Comment as commentShape } from 'utilities/prop-types'
import { formatDateAndTime } from 'utilities/format-date'
import formatPluralCount from 'utilities/format-plural-count'
import formatCurrencyFromCents from 'utilities/format-currency-from-cents'

import { API_POST_TYPES, POST_DISPLAY_TYPES } from 'constants/posts'
import {
    OVERVIEW,
    POSTS,
    INSTANT_ACCESS,
    SINGLE_POST,
} from 'constants/feednames'

import Block from 'components/Layout/Block'
import Card from 'components/Card'
import Collapse from 'components/Collapse'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import LinkedLabel from 'components/LinkedLabel'
import LikesDetail from 'components/LikesDetail'
import LikesCounter from 'components/LikesCounter'
import Popover from 'components/Popover'
import PopoverAlert from 'components/PopoverAlert'
import PostPollInfo from 'components/PostPollInfo'
import ShareButtons from 'components/ShareButtons'
import SafeDeleteButton from 'components/SafeDeleteButton'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import LoadingSpinner from 'components/LoadingSpinner'

import CommentThread from 'features/posts/CommentThread'
import LockedPostBanner from 'features/posts/LockedPostBanner'
import MediaHeader from 'features/posts/MediaHeader'

import AttachmentsElement from './components/AttachmentsElement'
import Header from './components/Header'
import ContentReport from 'components/ContentReport'
import { POST } from 'components/ContentReport/constants/core'

import { PostContentWrapper, PostTitle, PostActions } from './styled-components'

const COLLAPSE_POST_MINIMUM_LENGTH = 300
const commentsPropTypes = {
    comments: PropTypes.arrayOf(commentShape),
    commentsLoading: PropTypes.bool,
    repliesLoading: PropTypes.object,
    onLoadMoreComments: PropTypes.func,
    onLoadReplies: PropTypes.func,
    onLikeCommentClick: PropTypes.func,
    onPostComment: PropTypes.func,
    onEditComment: PropTypes.func,
    onDeleteComment: PropTypes.func,
}
const likesIconPropTypes = {
    currentUserHasLiked: PropTypes.bool,
    likeLoading: PropTypes.bool,
}
const postHeaderPropTypes = {
    minCentsPledgedToView: PropTypes.number,
    id: PropTypes.string,
    authorId: PropTypes.string,
    patronCount: PropTypes.number,
    publishedAt: PropTypes.string,
}
export const postPropTypes = {
    author: PropTypes.object,
    commentCount: PropTypes.number,
    content: PropTypes.string.isRequired,
    currentUser: PropTypes.object,
    currentUserCanDelete: PropTypes.bool,
    currentUserCanView: PropTypes.bool,
    feedName: PropTypes.string,
    id: PropTypes.string,
    isPaid: PropTypes.bool,
    likesOnPost: PropTypes.object,
    logTagClick: PropTypes.func,
    media: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onDeleteClick: PropTypes.func,
    onLikeClick: PropTypes.func,
    onClick: PropTypes.func,
    onTagClick: PropTypes.func,
    neverCollapse: PropTypes.bool,
    patreonUrl: PropTypes.string,
    postContextOwnerId: PropTypes.string, // on creator page, this would be the creator id.
    postDisplayType: PropTypes.oneOf(values(POST_DISPLAY_TYPES)).isRequired,
    retrieveLikes: PropTypes.func,
    shareButtons: PropTypes.array,
    title: PropTypes.string,
    upgradeUrl: PropTypes.string,
}

@withFeatureFlag('canReportContent')
@withState('moreActionsPopoverOpen', 'setMoreActionsPopoverOpen', false)
@withState('contentReportModalOpen', 'setContentReportModalOpen', false)
@withState('reportStateHistory', 'setReportStateHistory', null)
@withLocalStorage(({ id }) => `YOUTUBE_POPOVER_${id}`)
@withRenderAsClient
export default class Post extends Component {
    static propTypes = {
        ...postPropTypes,
        ...postHeaderPropTypes,
        ...likesIconPropTypes,
        ...commentsPropTypes,
        canReportContent: PropTypes.bool,
        forcePostHeader: PropTypes.bool,
        renderAsClient: PropTypes.bool,

        //withLocalStorage
        setLocalStorage: PropTypes.func,
        isLocalStorageSet: PropTypes.bool,
    }

    constructor(props) {
        super(props)

        this.state = {
            contentUncollapsed: false,
            isShareButtonsPopoverOpen: false,
            locallySelectedPollOption: null,
            locallyUnselectedPollOption: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            !nextProps.pollResponsesLoading &&
            !access(nextProps, 'unvotePollResponses.unvotePending')
        ) {
            this.setState({
                locallySelectedPollOption: null,
                locallyUnselectedPollOption: null,
            })
        }
    }

    getLikesCounterProps = () => {
        return {
            likeCount: this.props.likeCount,
            loading: this.props.likeLoading,
            currentUserHasLiked: !!this.props.currentUserHasLiked,
        }
    }

    getUpgradeUrlWithRedirect = () => {
        const { patreonUrl, upgradeUrl } = this.props
        return `${upgradeUrl}&redirect_uri=${patreonUrl}`
    }

    getUrl = () => {
        const { currentUserCanView, patreonUrl } = this.props
        return currentUserCanView
            ? patreonUrl
            : this.getUpgradeUrlWithRedirect()
    }

    handleLikeClick = () => {
        this.props.onLikeClick({ postId: this.props.id })

        const isUnlike = this.props.currentUserHasLiked
        if (this.props.feedName === INSTANT_ACCESS) {
            logInstantAccessEvent({
                title: INSTANT_ACCESS_EVENTS.CLICKED_EDITED_LIKE,
                info: {
                    post_id: this.props.id,
                    is_unlike: isUnlike,
                },
            })
        } else if (this.props.feedName === SINGLE_POST) {
            logPostPageEvent({
                title: POST_PAGE_EVENTS.EDITED_LIKE,
                info: {
                    post_id: this.props.id,
                    creator_id: this.props.author.id,
                    is_owner:
                        this.props.author.id === this.props.currentUser.id,
                    is_patron:
                        get(
                            this.props,
                            'post.campaign.currentUserPledge.amountCents',
                            0,
                        ) > 0,
                    like: !isUnlike,
                },
            })
        } else {
            logPostInFeedEvent({
                title: isUnlike
                    ? POST_IN_FEED_EVENTS.UNLIKE
                    : POST_IN_FEED_EVENTS.LIKE,
                info: {
                    post_id: this.props.id,
                },
            })
        }
    }

    handleDeleteClick = () => {
        this.props.onDeleteClick({ postId: this.props.id })
    }

    handleTagClick = (tag, tagUrl) => {
        return () => {
            this.props.logTagClick(tag)
            if (this.props.onTagClick) {
                this.props.onTagClick(this.props.author.id, tagUrl)
            }
        }
    }

    toggleShareButtonsPopover = () => {
        this.setState({
            isShareButtonsPopoverOpen: !this.state.isShareButtonsPopoverOpen,
        })
    }

    openShareButtonsPopover = () => {
        this.setState({
            isShareButtonsPopoverOpen: true,
        })
    }

    onShareButtonsOuterAction = () => {
        this.setState({
            isShareButtonsPopoverOpen: false,
        })
    }

    toggleMoreActionsPopover = () => {
        this.props.setMoreActionsPopoverOpen(!this.props.moreActionsPopoverOpen)
    }

    /* This fires whenever any of the share buttons in the menu are clicked */
    onShareClick = () => {
        let event = {
            domain: POST_IN_FEED_EVENTS.DOMAIN,
            title: POST_IN_FEED_EVENTS.SHARE,
        }
        if (this.props.feedName === INSTANT_ACCESS) {
            event = {
                domain: INSTANT_ACCESS_EVENTS.DOMAIN,
                title: INSTANT_ACCESS_EVENTS.CLICKED_SHARE,
            }
        } else if (this.props.feedName === SINGLE_POST) {
            event = {
                domain: POST_PAGE_EVENTS.DOMAIN,
                title: POST_PAGE_EVENTS.CLICKED_SHARE,
            }
        }
        logEvent({
            ...event,
            info: {
                post_id: this.props.id,
            },
        })
    }

    uncollapse = () => {
        this.setState({ contentUncollapsed: true })
    }

    renderTag = (tag, i, tags) => {
        let params = {}
        const authorPathName = urlparse(this.props.author.url).pathname
        const authorParams = querystring.parse(
            urlparse(this.props.author.url).query,
        )
        if (authorParams.u) {
            params = { ...params, u: authorParams.u }
        }

        params = { ...params, tag: tag }

        const tagUrl = `${authorPathName}/posts?${querystring.stringify(
            params,
        )}`

        return (
            <Block display="inline-block" mr={0.5} key={tagUrl}>
                <TextButton
                    key={tagUrl}
                    onClick={this.handleTagClick(tag, tagUrl)}
                    href={
                        [OVERVIEW, POSTS].includes(this.props.feedName)
                            ? null
                            : tagUrl
                    }
                    color="subdued"
                    size={0}
                    weight="bold"
                >
                    {tag}
                    {tags[i + 1] ? ', ' : ''}
                </TextButton>
            </Block>
        )
    }

    renderTags = tags => {
        return (
            <Block mt={2} data-tag="post-tags">
                <Flexy>
                    <Block mr={1} display="inline">
                        <Icon type="tag" size="xxs" color="gray4" />
                    </Block>
                    <div>
                        {tags.map((tag, i) => this.renderTag(tag, i, tags))}
                    </div>
                </Flexy>
            </Block>
        )
    }

    renderPostDetails = () => {
        if (!this.props.renderAsClient) {
            return null
        }

        const {
            commentCount,
            currentUserCanView,
            likesOnPost,
            id,
            retrieveLikes,
        } = this.props

        const { likeCount } = this.props
        const hasLikes = !!likeCount
        const hasComments = !!commentCount
        const url = this.getUrl()
        return (
            <Block pv={2}>
                <Flexy justifyContent="space-between">
                    <Flexy>
                        {hasComments &&
                            !currentUserCanView && (
                                <Block mr={2}>
                                    <TextButton
                                        onClick={this.onClickTitle}
                                        href={url}
                                        size={0}
                                        color="subdued"
                                    >
                                        {formatPluralCount(
                                            commentCount,
                                            'Comments',
                                        )}
                                    </TextButton>
                                </Block>
                            )}
                        {hasLikes && (
                            <LikesDetail
                                currentUserHasLiked={false}
                                likes={likesOnPost[id].likes}
                                likesLoading={likesOnPost[id].isLoading}
                                nextLikesUrl={likesOnPost[id].nextUrl}
                                likeCount={likeCount}
                                retrieveLikes={retrieveLikes}
                            />
                        )}
                    </Flexy>
                    {currentUserCanView && this.renderPostActions()}
                </Flexy>
            </Block>
        )
    }

    getTargetMediaType() {
        const { postDisplayType } = this.props
        if (postDisplayType.includes('AUDIO')) {
            return 'audio'
        }
        if (postDisplayType.includes('VIDEO')) {
            return 'video'
        }
        return null
    }

    renderPostActions = () => {
        const { patreonUrl, shareButtons } = this.props

        const currentUserId = access(this.props, 'currentUser.id')
        const authorId = access(this.props, 'author.id')
        const currentUserCanEdit = currentUserId && currentUserId === authorId
        const currentUserCanDelete = this.props.currentUserCanDelete
        const currentUserCanReport =
            this.props.canReportContent &&
            currentUserId !== authorId &&
            this.props.currentUserCanView

        const likesCounterProps = this.getLikesCounterProps()

        const reportThisContentButton = (
            <Block p={1}>
                <TextButton
                    color="subdued"
                    onClick={e => {
                        e.preventDefault()
                        this.props.setContentReportModalOpen(true)
                    }}
                >
                    Report this content
                </TextButton>
            </Block>
        )

        return (
            <PostActions>
                {currentUserCanReport && (
                    <div>
                        <Popover
                            preferPlace="below"
                            body={reportThisContentButton}
                            isOpen={this.props.moreActionsPopoverOpen}
                            onOuterAction={() =>
                                this.props.setMoreActionsPopoverOpen(false)}
                        >
                            <Icon
                                type="ellipsis"
                                color="gray3"
                                labelBold
                                onClick={this.toggleMoreActionsPopover}
                            />
                        </Popover>
                        {this.props.contentReportModalOpen && (
                            <ContentReport
                                useModal
                                modalIsOpen={this.props.contentReportModalOpen}
                                targetType={POST}
                                targetId={this.props.id}
                                targetMediaType={this.getTargetMediaType()}
                                reportStateHistory={
                                    this.props.reportStateHistory
                                }
                                onReportClose={({ stateHistory }) => {
                                    this.props.setReportStateHistory(
                                        stateHistory,
                                    )
                                    this.props.setContentReportModalOpen(false)
                                }}
                            />
                        )}
                    </div>
                )}
                {currentUserCanDelete && (
                    <SafeDeleteButton
                        entity="Post"
                        confirmAction={this.handleDeleteClick}
                    >
                        <Icon type="delete" color="gray3" labelBold />
                    </SafeDeleteButton>
                )}
                {currentUserCanEdit && (
                    <a href={`${patreonUrl}/edit`} data-tag="editPost">
                        <Icon type="edit" color="gray3" labelBold />
                    </a>
                )}
                <ShareButtons
                    buttons={shareButtons || []}
                    card={false}
                    popover
                    onShareClick={this.onShareClick}
                    isPopoverOpen={this.state.isShareButtonsPopoverOpen}
                    togglePopover={this.toggleShareButtonsPopover}
                    onOuterAction={this.onShareButtonsOuterAction}
                >
                    <Icon type="share" color="gray3" labelBold />
                </ShareButtons>
                <LikesCounter
                    {...likesCounterProps}
                    onLikeClick={this.handleLikeClick}
                />
            </PostActions>
        )
    }

    getFlattenedCommentThread = () => {
        return this.props.comments.filter(c => !c.parent).map(c => {
            // We do this to get around some shortcomings in our optimism code:
            // while a reply is posting, it's not yet on its parent as in c.replies
            // so we have to go find it in the provided flat array of comments.
            c.replies = this.props.comments
                .filter(r => {
                    // Some legacy comments are replies to replies.
                    // We want to flatten them down.
                    let ancestor = access(r, 'parent')
                    while (access(ancestor, 'parent')) {
                        ancestor = access(ancestor, 'parent')
                    }
                    return access(ancestor, 'id') === c.id
                })
                .sort(
                    (r1, r2) =>
                        moment(r1.created).isBefore(moment(r2.created))
                            ? -1
                            : 1,
                )
            return c
        })
    }

    renderCommentThread = () => {
        if (!this.props.renderAsClient) {
            return (
                <Block bt mv={2} mh={-2} p={2}>
                    <LoadingSpinner size="sm" color="gray2" />
                </Block>
            )
        }

        const { currentUserCanView, post: { embed, postType } } = this.props

        const livestreamRec = (
            <Block mt={1} mb={2}>
                <Text color="gray3" size={1}>
                    We recommend joining the live conversation on&nbsp;
                    <TextButton
                        color="default"
                        size={1}
                        href={get(embed, 'url')}
                        target="_blank"
                    >
                        Crowdcast
                    </TextButton>
                    .
                </Text>
            </Block>
        )

        return (
            currentUserCanView && (
                <Block bt mv={2} mh={-2} p={2} className="stackable">
                    {postType === API_POST_TYPES.LIVESTREAM_CROWDCAST &&
                        livestreamRec}
                    <CommentThread
                        noHandling={this.props.noHandling}
                        patreonUrl={this.props.post.patreonUrl}
                        currentUser={this.props.currentUser}
                        postCommentCount={this.props.commentCount}
                        comments={this.getFlattenedCommentThread()}
                        loading={this.props.commentsLoading}
                        repliesLoading={this.props.repliesLoading}
                        onLoadMoreComments={this.props.onLoadMoreComments}
                        onLoadReplies={this.props.onLoadReplies}
                        onLikeClick={this.props.onLikeCommentClick}
                        onPostComment={this.props.onPostComment}
                        onEditComment={this.props.onEditComment}
                        onDeleteComment={this.props.onDeleteComment}
                    />
                </Block>
            )
        )
    }

    renderContent = () => {
        return (
            <PostContentWrapper
                dangerouslySetInnerHTML={{ __html: this.props.content }}
                data-tag="post-content"
            />
        )
    }

    renderCollapse = () => {
        const content = (
            <PostContentWrapper
                dangerouslySetInnerHTML={{ __html: this.props.content }}
            />
        )
        const continueReadingButtonComponent = (
            <TextButton color="subdued" weight="bold" onClick={this.uncollapse}>
                Continue reading
            </TextButton>
        )
        const continueReadingButton = this.state.contentUncollapsed
            ? null
            : continueReadingButtonComponent

        const clickStyle = this.state.contentUncollapsed
            ? { cursor: 'auto' }
            : { cursor: 'pointer' }

        return (
            <div
                onClick={this.uncollapse}
                style={clickStyle}
                data-tag="post-content-collapse"
            >
                <Collapse
                    isOpened={this.state.contentUncollapsed}
                    collapsedHeight={100}
                    fadeOutBottom={!this.state.contentUncollapsed}
                    backgroundColor="white"
                >
                    {content}
                </Collapse>
                {continueReadingButton}
            </div>
        )
    }

    selectPollChoice = (
        id,
        pollId,
        multipleChoice,
        userSelectedChoiceIds,
        isSelected,
    ) => {
        if (this.props.pollResponsesLoading) {
            return
        }
        let isVoting = false
        if (multipleChoice) {
            let allSelectedChoices
            if (isSelected) {
                allSelectedChoices = [...userSelectedChoiceIds, id]
                this.setState({
                    locallySelectedPollOption: id,
                })
                isVoting = true
            } else {
                allSelectedChoices = userSelectedChoiceIds.filter(
                    cid => cid !== id,
                )
                this.setState({
                    locallyUnselectedPollOption: id,
                })
                isVoting = false
            }
            // make sure unique
            allSelectedChoices = [...new Set(allSelectedChoices)]
            this.props.postPollResponse(
                pollId,
                allSelectedChoices,
                this.props.feedName,
                isVoting,
                this.props.id,
            )
        } else {
            if (
                userSelectedChoiceIds.length > 0 &&
                id === userSelectedChoiceIds[0]
            ) {
                // uncheck
                isVoting = false
                this.props.postPollResponse(
                    pollId,
                    [],
                    this.props.feedName,
                    isVoting,
                    this.props.id,
                )
                this.setState({
                    locallyUnselectedPollOption: id,
                })
            } else {
                isVoting = true
                this.props.postPollResponse(
                    pollId,
                    [id],
                    this.props.feedName,
                    isVoting,
                    this.props.id,
                )
                let oldSelectedId
                if (userSelectedChoiceIds.length > 0) {
                    oldSelectedId = userSelectedChoiceIds[0]
                }
                this.setState({
                    locallySelectedPollOption: id,
                    locallyUnselectedPollOption: oldSelectedId,
                })
            }
        }
    }

    renderDownloadLink = () => {
        if (
            this.props.post.postFile &&
            this.props.post.postType === API_POST_TYPES.AUDIO_FILE
        ) {
            return (
                <div className="stackable">
                    <TextButton
                        href={this.props.post.postFile.url}
                        data-tag="post-file-download"
                    >
                        {this.props.post.postFile.name}
                    </TextButton>
                </div>
            )
        }
    }

    renderPoll = () => {
        const {
            author: { id: authorId },
            currentUser: { id: currentUserId },
            poll: {
                choices: pollChoices,
                closesAt: pollClosesAt,
                id: pollId,
                questionType: pollQuestionType,
                currentUserResponses: userResponses,
            },
            feedName,
            id: postId,
            isLoggedOut,
        } = this.props

        const {
            locallySelectedPollOption,
            locallyUnselectedPollOption,
        } = this.state
        const currentUserIsAuthor = currentUserId && currentUserId === authorId
        const multipleChoice = pollQuestionType !== 'single_choice'
        const pollHasClosed =
            pollClosesAt && moment(pollClosesAt).isBefore(moment())
        const userSelectedChoiceIds =
            userResponses && userResponses.map(r => r.choice.id)

        const choiceIsSelected = id => {
            // not selected if not logged in
            if (currentUserId && !isLoggedOut) {
                return (
                    (userSelectedChoiceIds.indexOf(id) > -1 ||
                        this.state.locallySelectedPollOption === id) &&
                    this.state.locallyUnselectedPollOption !== id
                )
            }
            return false
        }

        const getVotes = c => {
            // not selected if not logged in
            let votes = c.numResponses
            if (currentUserId && !isLoggedOut) {
                if (locallySelectedPollOption === c.id) {
                    votes = votes + 1
                } else if (locallyUnselectedPollOption === c.id) {
                    votes = votes - 1
                }
            }
            return votes
        }

        const choices = pollChoices.map(c => {
            return {
                text: c.textContent,
                selected: userSelectedChoiceIds && choiceIsSelected(c.id),
                votes: getVotes(c),
                onChange: isSelected =>
                    this.selectPollChoice(
                        c.id,
                        pollId,
                        multipleChoice,
                        userSelectedChoiceIds,
                        isSelected,
                    ),
                position: c.position,
            }
        })

        return (
            <Block position="relative" mt={2}>
                <PostPollInfo
                    pollId={pollId}
                    postId={postId}
                    multipleChoice={multipleChoice}
                    choices={choices}
                    isPollAuthor={currentUserIsAuthor}
                    pollHasClosed={pollHasClosed}
                    pollEndDateString={pollClosesAt}
                    feedName={feedName}
                />
            </Block>
        )
    }

    renderMediaHeader = () => {
        const {
            author,
            currentUser,
            currentUserCanView,
            media,
            postDisplayType,
            post: {
                changeVisibilityAt,
                postType,
                publishedAt,
                user: { id: creatorId },
            },
            isLocalStorageSet,
            setLocalStorage,
        } = this.props

        const ONE_HOUR = 60 * 60 * 1000
        const timeFromPublish = new Date() - new Date(publishedAt)

        const currentUserIsAuthor = currentUser && currentUser.id === creatorId
        const isYoutubeLivestream =
            postType === API_POST_TYPES.LIVESTREAM_YOUTUBE

        const showPopover =
            isYoutubeLivestream &&
            timeFromPublish < ONE_HOUR &&
            currentUserIsAuthor &&
            !isLocalStorageSet

        const popoverBody = (
            <div>
                <Text color="white">
                    Don't see your broadcast? Click "Start broadcast" in
                    Youtube's stream window.{' '}
                </Text>
                <TextButton color="white" underline>
                    Learn More
                </TextButton>
            </div>
        )

        return (
            <PopoverAlert
                isOpen={showPopover}
                onClose={() => setLocalStorage()}
                preferPlace="below"
                body={popoverBody}
            >
                <MediaHeader
                    authorImagerUrl={author.imageUrl}
                    changeVisibilityAt={changeVisibilityAt}
                    currentUserCanView={currentUserCanView}
                    handleClick={this.handleClick}
                    handleClickTitle={this.onClickTitle}
                    media={media}
                    postDisplayType={postDisplayType}
                    url={this.getUrl()}
                />
            </PopoverAlert>
        )
    }

    renderLockedPostBanner = () => {
        const {
            currentUserCanView,
            feedName,
            media,
            minCentsPledgedToView,
            postDisplayType,
            post: { id, user: { id: creatorId } },
            title,
        } = this.props
        return (
            <LockedPostBanner
                creatorId={creatorId}
                currentUserCanView={currentUserCanView}
                id={id}
                pageSource={feedName}
                media={media}
                minCentsPledgedToView={minCentsPledgedToView}
                postDisplayType={postDisplayType}
                title={title}
                url={this.getUrl()}
            />
        )
    }

    renderEarlyAccess = () => {
        const {
            currentUser,
            currentUserCanView,
            currentUserPledgeAmount,
            feedName,
            post: {
                changeVisibilityAt,
                earlyAccessMinCents,
                id,
                publishedAt,
                user: { id: creatorId, fullName: authorFullName },
            },
        } = this.props

        if (currentUserCanView && changeVisibilityAt) {
            let ctaLink
            let eaText

            const diffDays = Math.round(
                (new Date(changeVisibilityAt) - new Date(publishedAt)) /
                    (1000 * 60 * 60 * 24),
            )
            if (diffDays <= 0) {
                // Don't show EA days in an erroneous state
                return
            }
            const hasTier = earlyAccessMinCents > 1
            const currentUserIsAuthor =
                currentUser && currentUser.id === creatorId
            const daysEarly = formatPluralCount(diffDays, 'day')

            if (
                currentUserIsAuthor ||
                currentUserPledgeAmount >= earlyAccessMinCents
            ) {
                eaText = `You got access to this post ${daysEarly} before the rest of the world.`
            } else {
                const capitalizedAuthorName =
                    authorFullName.charAt(0).toUpperCase() +
                    authorFullName.slice(1)
                const formattedTierAmount = hasTier
                    ? `${formatCurrencyFromCents(earlyAccessMinCents)} `
                    : ''

                eaText = `${capitalizedAuthorName} released this post ${daysEarly} early for ${formattedTierAmount}patrons.`
                ctaLink = (
                    <TextButton
                        onClick={() => {
                            logPostEvent(POST_EVENTS.CLICKED_UNLOCKED_EA_POST, {
                                creator_id: creatorId,
                                post_id: id,
                                earlyAccessMinCents: earlyAccessMinCents,
                                source: feedName,
                            })
                        }}
                        href={this.getUpgradeUrlWithRedirect()}
                        color="gray"
                        size={0}
                        weight="normal"
                        underline
                    >
                        Become a {formattedTierAmount}patron
                    </TextButton>
                )
            }

            return (
                <div className="stackable">
                    <hr className="stackable" />
                    <Flexy alignItems="center">
                        <Block display="inline-block" mr={1}>
                            <Icon type="clock" size="xs" color="gray3" />
                        </Block>
                        <Text color="gray2" size={0}>
                            {eaText} &nbsp; {ctaLink}
                        </Text>
                    </Flexy>
                </div>
            )
        }
    }

    render() {
        const {
            content,
            currentUserCanView,
            feedName,
            poll,
            post: {
                attachments,
                changeVisibilityAt,
                earlyAccessMinCents,
                id,
                minCentsPledgedToView,
                publishedAt,
                userDefinedTags,
                user: { id: creatorId },
            },
            renderAsClient,
            title,
        } = this.props
        const author = this.props.author.attributes
            ? {
                  ...this.props.author.attributes,
                  id: this.props.author.id,
              }
            : this.props.author

        const isNotOwner =
            this.props.postContextOwnerId !== this.props.author.id
        const linkHeaderToProfile = !this.props.postContextOwnerId || isNotOwner
        const url = this.getUrl()
        const isPostPage = feedName === SINGLE_POST

        // Considered a long post if content is longer than 300 characters.
        const showCollapsed =
            content.length > COLLAPSE_POST_MINIMUM_LENGTH &&
            !this.props.neverCollapse
        const tagsLabels = userDefinedTags.map(tagObj => {
            return tagObj.value
        })
        const showPostHeader = !isPostPage || this.props.forcePostHeader
        const mainTitleIsLink = !isPostPage || !this.props.currentUserCanView

        // prettier-ignore
        const pledgeDollarsString = minCentsPledgedToView === 1
            ? 'Patrons only'
            : `${formatCurrencyFromCents(minCentsPledgedToView)}+ patrons`

        const onClickPost = eventName => {
            logPostEvent(eventName, {
                creator_id: creatorId,
                post_id: id,
                early_access_min_cents: earlyAccessMinCents,
                is_blurred: !currentUserCanView,
                is_early_access_post: !!changeVisibilityAt,
                min_cents_pledged_to_view: minCentsPledgedToView,
                source: feedName,
            })
        }

        return (
            <div data-test-tag="post-card">
                <Card noPadding>
                    {showPostHeader && (
                        <Header
                            authorAvatarUrl={author.imageUrl}
                            authorId={creatorId}
                            authorUrl={author.url}
                            changeVisibilityAt={changeVisibilityAt}
                            currentUserCanView={currentUserCanView}
                            earningsVisibility={this.props.earningsVisibility}
                            feedName={feedName}
                            fullName={author.fullName}
                            id={id}
                            isPaidForByPatrons={this.props.isPaid}
                            linkToProfile={linkHeaderToProfile}
                            minCentsPledgedToView={minCentsPledgedToView}
                            patronCount={this.props.patronCount}
                            patreonUrl={url}
                            publishedAt={publishedAt}
                        />
                    )}
                    {currentUserCanView && this.renderMediaHeader()}
                    {!currentUserCanView && this.renderLockedPostBanner()}
                    <Block m={0} mt={2} pv={0} ph={2}>
                        <div
                            className={cl({
                                stackable: true,
                                'mb-xs': !showPostHeader,
                            })}
                        >
                            {title && (
                                <Flexy justifyContent="space-between">
                                    <PostTitle data-tag="post-title">
                                        {mainTitleIsLink ? (
                                            <a
                                                href={url}
                                                onClick={() =>
                                                    onClickPost(
                                                        POST_EVENTS.CLICKED_TITLE,
                                                    )}
                                            >
                                                {title}
                                            </a>
                                        ) : (
                                            title
                                        )}
                                    </PostTitle>
                                    {isPostPage &&
                                        Boolean(minCentsPledgedToView) && (
                                            <LinkedLabel
                                                icon={
                                                    currentUserCanView
                                                        ? 'unlocked'
                                                        : 'lock'
                                                }
                                                minWidth={12}
                                                iconColor="subdued"
                                                text={pledgeDollarsString}
                                                size="xxxs"
                                                data-tag="post-min-cents"
                                            />
                                        )}
                                </Flexy>
                            )}
                        </div>
                        {!showPostHeader && (
                            <div className="stackable">
                                <Text
                                    size={0}
                                    color="gray3"
                                    el="span"
                                    data-tag="post-published-at"
                                >
                                    {renderAsClient
                                        ? formatDateAndTime(
                                              this.props.publishedAt,
                                          )
                                        : '\u00A0'}
                                </Text>
                            </div>
                        )}
                        {this.renderDownloadLink()}
                        {showCollapsed
                            ? this.renderCollapse()
                            : this.renderContent()}
                        {poll && currentUserCanView && this.renderPoll()}
                        <AttachmentsElement
                            noHandling={this.props.noHandling}
                            attachments={attachments}
                        />
                        {tagsLabels.length > 0 && this.renderTags(tagsLabels)}
                        {this.renderPostDetails()}
                        {this.renderEarlyAccess()}
                        {this.renderCommentThread()}
                    </Block>
                </Card>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/posts/Post/index.jsx