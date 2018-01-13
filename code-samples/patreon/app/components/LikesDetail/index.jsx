import t from 'prop-types'
import React from 'react'
import debounce from 'lodash/debounce'

import Icon from 'components/Icon'
import LoadingSpinner from 'components/LoadingSpinner'
import Modal from 'components/Modal'
import Popover from 'components/Popover'
import TextButton from 'components/TextButton'
import UserList from 'components/UserList/UserWithFullName'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'

import formatPluralCount from 'utilities/format-plural-count'

import {
    LikesLoadingSpinnerContainer,
    IconContainer,
    ScrollContainer,
} from './styled-components'

const POPOVER_DELAY = 250

export default class extends React.Component {
    static propTypes = {
        likes: t.array,
        likeCount: t.number,
        likesLoading: t.bool,
        maxLikesInSummary: t.number,
        nextLikesUrl: t.string,
        retrieveLikes: t.func.isRequired,
    }

    static defaultProps = {
        maxLikesInSummary: 5,
    }

    state = {
        showPopover: false,
        showModal: false,
    }

    openPopoverDebounced = null

    componentDidMount() {
        this.openPopoverDebounced = debounce(this.openPopover, POPOVER_DELAY)
    }

    componentWillReceiveProps(nextProps) {
        /*
            This prevents a rare bug:
            If you like or unlike a post while the popover is still open
            (which happens if the onMouseOut event doesn't get fired)
            and then hover over Likes again, the popover component will throw an error.
            The error is "Failed to execute 'removeChild' on 'Node'..."
            @TODO: Figure out how to make the popover element always close onMouseOut
        */
        if (this.props.likeCount !== nextProps.likeCount) {
            this.setState({ showPopover: false })
        }
    }

    closeModal = () => {
        this.setState({
            showModal: false,
            showPopover: false,
        })
    }

    renderSpinner = () => {
        const { likesLoading, likes } = this.props
        if (likesLoading) {
            return (
                <LikesLoadingSpinnerContainer
                    initialLoading={likes.length === 0}
                >
                    <LoadingSpinner size="md" color="subduedGray" />
                </LikesLoadingSpinnerContainer>
            )
        }
        return <div />
    }

    showDetailedLikes = () => {
        const { likes } = this.props
        const LikesFormattedForUserList = likes.map(like => {
            return {
                imageUrl: like.thumbUrl,
                fullName: like.fullName,
                url: like.url,
            }
        })

        return (
            <div>
                <UserList items={LikesFormattedForUserList} />
                {this.renderSpinner()}
            </div>
        )
    }

    showSummaryLikes = () => {
        const { likes, likeCount, maxLikesInSummary, likesLoading } = this.props
        if (likesLoading) {
            return <LoadingSpinner size="md" color="lightGray" />
        }
        let MoreLikes
        if (likeCount > maxLikesInSummary) {
            MoreLikes = (
                <div>
                    and {`${likeCount - maxLikesInSummary} more...`}
                </div>
            )
        }
        const likesListing = likes.slice(0, maxLikesInSummary).map(like => {
            return (
                <div key={like.id}>
                    {like.fullName}
                </div>
            )
        })
        return (
            <div>
                {likesListing} {MoreLikes}
            </div>
        )
    }

    closePopover = () => {
        this.openPopoverDebounced.cancel()
        this.setState({ showPopover: false })
    }

    openPopover = () => {
        const { likeCount, likes, likesLoading, retrieveLikes } = this.props
        this.setState({ showPopover: true })
        if (!likesLoading && likeCount > 0 && likes.length === 0) {
            retrieveLikes()
        }
    }

    listenToModalScroll = e => {
        const { nextLikesUrl, likesLoading, retrieveLikes } = this.props
        const { scrollHeight, clientHeight, scrollTop } = this.scrollable
        const distanceToBottom = scrollHeight - (clientHeight + scrollTop)
        if (distanceToBottom < 300 && !!nextLikesUrl && !likesLoading) {
            retrieveLikes(nextLikesUrl)
        }
    }

    calculatePopoverHeight = (lineHeight, likeCount, maxLikesInSummary) => {
        /*
            This sets the height of the popover to what it will be when populated.
            We need to do this because our popover component glitches
            when content is resized.
        */
        let minHeight =
            likeCount <= maxLikesInSummary
                ? lineHeight * likeCount
                : lineHeight * (maxLikesInSummary + 1)
        return {
            minHeight: `${minHeight}px`,
            lineHeight: `${lineHeight}px`,
            display: 'flex',
            alignItems: 'center',
        }
    }

    render() {
        const { likeCount, maxLikesInSummary } = this.props
        const { showPopover, showModal } = this.state
        const likesText = formatPluralCount(likeCount, 'Like')
        const header = (
            <Block backgroundColor="gray6" p={2}>
                <Flexy>
                    <strong>
                        {likesText}
                    </strong>
                    <IconContainer>
                        <Icon
                            onClick={this.closeModal}
                            type="cancel"
                            size="xs"
                            color="gray2"
                        />
                    </IconContainer>
                </Flexy>
            </Block>
        )

        return (
            <div>
                <Popover
                    isOpen={showPopover && !showModal}
                    body={
                        <Block
                            p={1}
                            style={this.calculatePopoverHeight(
                                20,
                                likeCount,
                                maxLikesInSummary,
                            )}
                        >
                            {this.showSummaryLikes()}
                        </Block>
                    }
                    color="dark"
                    minWidth={100}
                >
                    <span
                        onMouseOver={this.openPopoverDebounced}
                        onMouseOut={this.closePopover}
                        onClick={() => {
                            this.setState({ showModal: true })
                        }}
                    >
                        <TextButton color="subdued" size={0}>
                            {likesText}
                        </TextButton>
                    </span>
                </Popover>

                <Modal
                    noBodyPadding
                    close={this.closeModal}
                    header={header}
                    maxWidth={'400px'}
                    show={showModal}
                >
                    <ScrollContainer
                        innerRef={ref => (this.scrollable = ref)}
                        onScroll={this.listenToModalScroll}
                    >
                        {this.showDetailedLikes()}
                    </ScrollContainer>
                </Modal>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/LikesDetail/index.jsx