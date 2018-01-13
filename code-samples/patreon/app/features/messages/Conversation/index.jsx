import t from 'prop-types'
import React from 'react'
import { Link } from 'react-router'

import Button from 'components/Button'
import LoadingSpinner from 'components/LoadingSpinner'

import Header from 'features/messages/Conversation/components/Header'
import ConversationList from 'features/messages/ConversationList'

import ChangeButton from './components/ChangeButton'
import MessageEditor from './components/MessageEditor'
import MessageList from './components/MessageList'

import { flexContainerHorizontal } from 'styles/shared/flex-helpers.less'
import styles from './styles.less'

let prevConversationId = null
let prevLastSent = null
const scrollToBottom = (ref, conversationId, lastSent) => {
    if (!ref) return
    // if these match we're probably paging through messages  or
    // no new message is being posted so don't scroll to bottom
    if (conversationId === prevConversationId && prevLastSent === lastSent) {
        return
    }
    prevConversationId = conversationId

    // 0 delay if we're posing a new message
    const delay = prevLastSent !== lastSent ? 0 : 200
    prevLastSent = lastSent

    // @HACK for clearing dynamic loading spinner
    setTimeout(() => {
        ref.scrollTop = ref.scrollHeight
    }, delay)
}

const Conversation = props => {
    const {
        lockParticipants,
        onChangeParticipants,
        onMessageSend,
        onMoreMessages,
        conversation,
        participants,
        messages,
        childConversations,
        inboxHref,
        editorAvatar,
        lastSent,
        parentConversationId,
        isMessageSending,
        isConversationLoading,
        messagingDisallowed,
        disabled,
        queryParams,
    } = props

    let children = []
    if (childConversations) {
        children = childConversations.filter(child => child.messages.length > 0)
    }
    const hasChildren = children && children.length > 0
    let numUnreadChildren = 0
    if (hasChildren) {
        numUnreadChildren = children.filter(child => {
            return !child.read
        }).length
    }

    const backLinkEl =
        parentConversationId &&
        <Link
            to={{
                pathname: `/messages/${parentConversationId}`,
                query: queryParams,
            }}
            className={`link mb-md ${styles.backLink}`}
        >
            Back to all replies
        </Link>

    let scrollKey = null
    let refFn = () => {}
    if (conversation) {
        scrollKey = `${conversation.id}_${messages.length}_${lastSent}`
        refFn = ref => scrollToBottom(ref, conversation.id, lastSent)
    }

    return (
        <div>
            <div
                key={scrollKey}
                className={styles.scrollableContainer}
                ref={refFn}
            >
                {backLinkEl}
                <div className={`${styles.headerWrapper} pb-md`}>
                    <div className={flexContainerHorizontal}>
                        <Header participants={participants} />
                        {!lockParticipants &&
                            <ChangeButton onClick={onChangeParticipants} />}
                    </div>
                </div>
                {(isConversationLoading || onMoreMessages) &&
                    // height of 38px to prevent jumping UI (loading spiner and button have different heights)
                    <div
                        className="mt-md"
                        style={{ textAlign: 'center', height: '38px' }}
                    >
                        {isConversationLoading
                            ? <LoadingSpinner />
                            : <Button
                                  size="sm"
                                  color="blue"
                                  onClick={onMoreMessages}
                              >
                                  Load Earlier Messages
                              </Button>}
                    </div>}
                <div className={'mb-md pt-md'}>
                    {inboxHref &&
                        <div className="mb-sm">
                            <a href={inboxHref} className="link">
                                View in messages inbox
                            </a>
                        </div>}
                    {messages && <MessageList messages={messages} />}
                    {hasChildren &&
                        <div className={styles.replySection}>
                            <span className={styles.replyHeader}>
                                <strong>Replies</strong>
                                {numUnreadChildren > 0 &&
                                    <span className={styles.replyUnreadCount}>
                                        {' '}({numUnreadChildren} unread)
                                    </span>}
                            </span>
                            <div className={styles.replyList}>
                                <ConversationList
                                    queryParams={queryParams}
                                    conversations={children}
                                    linkFn={childId => {
                                        return `/messages/${conversation.id}/reply/${childId}`
                                    }}
                                />
                            </div>
                        </div>}
                </div>
            </div>
            <div className={styles.newMessageContainer}>
                <MessageEditor
                    userAvatar={editorAvatar}
                    onSend={onMessageSend}
                    key={lastSent}
                    placeholderText={
                        hasChildren ? 'Send a message to everyone…' : null
                    }
                    isLoading={isMessageSending}
                    messagingDisallowed={messagingDisallowed}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

Conversation.propTypes = {
    lockParticipants: t.bool,
    onChangeParticipants: t.func,
    onMessageSend: t.func,
    onMoreMessages: t.func,
    // @TODO: this will replace participants and messages props when I can
    //        refactor MessageModal to be state.refs.conversation aware - drk
    conversation: t.object,
    participants: t.array,
    messages: t.array,
    childConversations: t.array,
    inboxHref: t.string,
    editorAvatar: t.string,
    lastSent: t.string,
    parentConversationId: t.string,
    isMessageSending: t.bool,
    isConversationLoading: t.bool,
    messagingDisallowed: t.bool,
    disabled: t.bool,
    queryParams: t.object,
}

export default Conversation



// WEBPACK FOOTER //
// ./app/features/messages/Conversation/index.jsx