// @TODO: LESS => styled-components, classNames => Grid components, general refactor
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import last from 'lodash/last'
import find from 'lodash/find'

import { formatDate } from 'utilities/format-date'
import formatPluralCount from 'utilities/format-plural-count'
import * as MessagePropTypes from 'utilities/prop-types'

import Avatar from 'components/Avatar'
import Badge from 'components/Badge'
import Block from 'components/Layout/Block'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Text from 'components/Text'

import allMessages from 'pages/messages/utilities/merge-all-messages'

import { flexContainerHorizontal } from 'styles/shared/flex-helpers.less'

import styles from './styles.less'

const participantsNameDisplay = (participants, participantToHighlight) => {
    const otherParticipantCount = participants.length - 1
    const participantName = participantToHighlight.fullName
    if (otherParticipantCount > 0) {
        return `${participantName} and ${formatPluralCount(
            otherParticipantCount,
            'other',
        )}`
    } else {
        return participantName
    }
}

const latestMessageNotFromCurrentUser = (messages, currentUserId) => {
    return find(messages.reverse(), message => {
        /**
         * Possible that we don't have a sender object (the user was rm from db)
         * https://app.asana.com/0/211672692333429/257651874700857
         */
        if (!message.sender) return false
        return message.sender.id !== currentUserId
    })
}

/**
 * Opposite of `latestMessageNotFromCurrentUser` used as a fallback for when a
 * conversation has no valid participants other than the current user (aka user was rm from db).
 */
const latestMessageFromCurrentUser = (messages, currentUserId) => {
    return find(messages.reverse(), message => {
        /**
         * Possible that we don't have a sender object (the user was rm from db)
         * https://app.asana.com/0/211672692333429/257651874700857
         */
        if (!message.sender) return false
        return message.sender.id === currentUserId
    })
}

export default class extends React.Component {
    static propTypes = {
        conversations: PropTypes.arrayOf(MessagePropTypes.Conversation)
            .isRequired,
        linkFn: PropTypes.func.isRequired,
        className: PropTypes.string,
        queryParams: PropTypes.object,
        onNewMessage: PropTypes.func.isRequired,
        emptyStateMessage: PropTypes.string,
    }

    static defaultProps = {
        emptyStateMessage: 'No conversations yet',
    }

    renderEmpty = () => (
        <div className={styles.emptyState}>
            <div className={styles.emptyStateMessage}>
                {this.props.emptyStateMessage}
            </div>
            <Button color="blue" size="sm" onClick={this.props.onNewMessage}>
                New Message
            </Button>
        </div>
    )

    renderConversationItem = conversation => {
        const currentUserId = window.patreon.userId
        const allConversations = [conversation].concat(
            conversation.children || [],
        )
        const numUnread = allConversations.filter(convo => {
            return !convo.read
        }).length
        const allMessagesInConversation = allMessages(conversation)
        const latestMessage = last(allMessagesInConversation)
        const messageForParticipantDisplay = latestMessageNotFromCurrentUser(
            allMessagesInConversation,
            currentUserId,
        )
        let participantToHighlight = messageForParticipantDisplay
            ? messageForParticipantDisplay.sender
            : conversation.participants[0]

        /**
         * Fallback participantToHighlight.
         * Strange stress case where if you have a conversation w/ a
         * deleted user there are no other participants to pull from,
         * which is the case if the conversation has only 1 other participant.
         *
         * This is a gross fix, but thinking we'll rethink/revisit with a coming
         * Nion port.
         */
        if (!participantToHighlight) {
            participantToHighlight = latestMessageFromCurrentUser(
                allMessagesInConversation,
                currentUserId,
            ).sender
        }

        return (
            <Link
                key={conversation.id}
                to={{
                    pathname: this.props.linkFn(conversation.id),
                    query: this.props.queryParams,
                }}
                activeClassName={styles.isSelected}
                className={classNames(
                    flexContainerHorizontal,
                    styles.conversationLink,
                )}
            >
                <Block mr={2}>
                    <Badge
                        bgColor="highlightPrimary"
                        size="md"
                        hideIfZero
                        yOffset={14}
                        target={
                            <Avatar
                                src={participantToHighlight.imageUrl}
                                size="sm"
                            />
                        }
                    >
                        {numUnread}
                    </Badge>
                </Block>
                <div className={styles.textContainer}>
                    <div className="row" style={{ alignItems: 'baseline' }}>
                        <div className="col-xs-8">
                            <Text weight="bold" el="div" size={0} ellipsis>
                                {participantsNameDisplay(
                                    conversation.participants,
                                    participantToHighlight,
                                )}
                            </Text>
                        </div>
                        <div className="col-xs-4">
                            <Text
                                color="gray3"
                                el="div"
                                align="right"
                                size={0}
                                ellipsis
                            >
                                {conversation.messages &&
                                    formatDate(latestMessage.sentAt)}
                            </Text>
                        </div>
                    </div>
                    {conversation.messages && (
                        <div className={styles.messagePreview}>
                            {latestMessage.sender.id === currentUserId && (
                                <span className={styles.replyIconContainer}>
                                    <Icon
                                        type="reply"
                                        size="xxs"
                                        color="gray3"
                                    />
                                </span>
                            )}
                            <Text size={0} ellipsis>
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: latestMessage.content,
                                    }}
                                />
                            </Text>
                        </div>
                    )}
                </div>
            </Link>
        )
    }
    renderList = () => this.props.conversations.map(this.renderConversationItem)

    render() {
        return (
            <div className={classNames(this.props.className)}>
                {this.props.conversations.length === 0
                    ? this.renderEmpty()
                    : this.renderList()}
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/messages/ConversationList/index.jsx