import access from 'safe-access'
import { postConversation } from 'actions/conversations'
import { postMessage } from 'actions/messages'

const apiActionOpts = {
    actionSuffix: 'MESSAGE_MODAL',
}

const getConversationId = state =>
    access(state.refs, 'messageModalConversation.id')

export const postNewMessage = (content, participantUserIds) => {
    return (dispatch, getState) => {
        let conversationId = getConversationId(getState())

        if (typeof conversationId !== 'undefined') {
            return dispatch(postMessage(content, conversationId, apiActionOpts))
        }

        return dispatch(
            postConversation(participantUserIds, apiActionOpts),
        ).then(() => {
            conversationId = getConversationId(getState())

            if (!conversationId) {
                console.warn(
                    `Couldn't find a conversationId from on refs.messageModalConversation.id`,
                )
                return
            }

            return dispatch(postMessage(content, conversationId, apiActionOpts))
        })
    }
}

export const setParticipants = participants => {
    return {
        type: 'SET_PARTICIPANTS',
        payload: participants,
    }
}

export const clearConversation = () => {
    return {
        type: 'MESSAGE_MODAL_CLEAR_CONVERSATION',
    }
}



// WEBPACK FOOTER //
// ./app/components/MessageModal/actions.js