import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import access from 'safe-access'
import find from 'lodash/find'
import { hasJsonApiErrorGetter } from 'getters/errors'
import { CANNOT_CONVERSE_WITH_RECIPIENTS } from 'constants/patreon-error-codes'
import loadingGetter from 'getters/loading-getter'
import { getCurrentUser } from 'getters/current-user'
import { setParticipants } from './MessageSelectParticipants/actions'
import { postNewMessage, clearConversation } from './actions'
import { POST_MESSAGE } from 'actions/messages'
import { formatDateRelative } from 'utilities/format-date'
import Analytics, { MESSAGES_EVENTS } from 'analytics'

const getParticipants = (state, ownProps) => {
    const participants = access(state, 'refs.selectedParticipants')

    if (!participants) {
        return console.error(
            `Couldn't find selectedParticipants in state.refs. `,
            `Make sure your store includes the MessageSelectParticipants/reducers on the refs object.`,
        )
    }

    return participants.map(participant => {
        const result = {
            id: participant.id,
            fullName: participant.fullName,
            imageUrl: participant.imageUrl,
        }
        if (participant.pledgeToCurrentUser) {
            result.isYourPatron = true
            result.patronSince = formatDateRelative(
                access(participant, 'pledgeToCurrentUser.createdAt'),
            )
        } else if (
            participant.campaign &&
            participant.campaign.currentUserPledge
        ) {
            result.isYourPatron = false
            result.patronSince = formatDateRelative(
                access(participant, 'campaign.currentUserPledge.createdAt'),
            )
        }
        return result
    })
}

// @TODO: mode sane way of doing these getters
const getMessages = state => {
    return access(state, 'refs.messageModalMessages') || []
}

const getConversationId = state => {
    return access(state, 'refs.messageModalConversation.id')
}

const getLockParticipants = (state, ownProps) => {
    return access(ownProps, 'detailProps.lockParticipants')
}

const getPostMessageLoading = state => {
    const conversationId = getConversationId(state)
    return createSelector(
        loadingGetter('POST_CONVERSATION_MESSAGE_MODAL'),
        loadingGetter('POST_MESSAGE_MESSAGE_MODAL', () => conversationId),
        (...args) => {
            return find(args, arg => arg)
        },
    )(state)
}

const mapStateToProps = createSelector(
    getCurrentUser,
    getParticipants,
    getConversationId,
    getMessages,
    getLockParticipants,
    getPostMessageLoading,
    hasJsonApiErrorGetter(
        ['POST_CONVERSATION_MESSAGE_MODAL'],
        null,
        CANNOT_CONVERSE_WITH_RECIPIENTS,
    ),
    hasJsonApiErrorGetter(
        ['POST_MESSAGE_MESSAGE_MODAL', 'POST_MESSAGE'],
        (state, ownProps) => getConversationId(state),
        CANNOT_CONVERSE_WITH_RECIPIENTS,
    ),
    loadingGetter(`${POST_MESSAGE}_MESSAGE_MODAL`, getConversationId),
    (
        currentUser,
        participants,
        conversationId,
        messages,
        lockParticipants,
        isLoading,
        conversationDisallowed,
        messagingDisallowed,
        isMessageSending,
    ) => {
        const showDetail = participants.length > 0

        return {
            participants, // used to pass in to post message action
            showDetail,
            title:
                showDetail && participants[0]
                    ? `New message to ${participants[0].fullName}`
                    : 'New Message',
            detailProps: {
                lockParticipants,
                participants: participants,
                messages: messages,
                inboxHref: conversationId
                    ? `/messages/${conversationId}`
                    : null,
                editorAvatar: currentUser.imageUrl,
                lastSent: access(messages[messages.length - 1], 'id'),
                isLoading,
                isMessageSending,
                messagingDisallowed:
                    conversationDisallowed || messagingDisallowed,
            },
        }
    },
)

const mapDispatchToProps = dispatch => {
    return {
        onChangeParticipants: () => {
            dispatch(setParticipants([])) // clear out the selectedParticipants
            dispatch(clearConversation())
        },
        makeOnMessageSendFn: participants => {
            return content => {
                Analytics.logEvent({
                    domain: MESSAGES_EVENTS.DOMAIN,
                    title: MESSAGES_EVENTS.CREATED_CONVERSATION,
                    info: {
                        num_recipients: participants.length,
                    },
                })
                Analytics.logEvent({
                    domain: MESSAGES_EVENTS.DOMAIN,
                    title: MESSAGES_EVENTS.SENT_MESSAGE,
                    info: {
                        has_parent: false,
                        is_owner: true,
                        num_recipients: participants.length,
                    },
                })
                dispatch(postNewMessage(content, participants.map(r => r.id)))
            }
        },
    }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
        onMessageSend: dispatchProps.makeOnMessageSendFn(
            stateProps.participants,
        ),
    }
}

export default component => {
    return connect(mapStateToProps, mapDispatchToProps, mergeProps)(component)
}



// WEBPACK FOOTER //
// ./app/components/MessageModal/connect.js