import t from 'prop-types'
import React, { Component } from 'react'
import nion, { selectData } from 'nion'
import { buildUrl, JsonApiPayload } from 'utilities/json-api'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { withState } from 'recompose'

import MessageUserModal from '../../components/MessageUserModal'

import { getIsModalOpen } from '../../core'

@connect(
    createStructuredSelector({
        currentUser: selectData('currentUser'),
        isModalOpen: getIsModalOpen,
    }),
)
@nion({
    conversation: {
        dataKey: 'modules:messageModal:conversation',
        endpoint: buildUrl('/conversations'),
    },
    message: {
        dataKey: 'modules:messageModal:message',
        endpoint: buildUrl('/messages?messages-version=2'),
    },
})
@withState('isSending', 'setIsSending', false)
@withState('isSent', 'setIsSent', false)
@withState('isError', 'setIsError', false)
class MessageUserModalContainer extends Component {
    static propTypes = {
        currentUser: t.shape({
            id: t.string,
            imageUrl: t.string,
            fullName: t.string,
        }),
        details: t.node,
        isError: t.bool,
        isModalOpen: t.bool,
        isSending: t.bool,
        isSent: t.bool,
        onRequestClose: t.func,
        setIsError: t.func,
        setIsSending: t.func,
        setIsSent: t.func,
        userToMessage: t.shape({
            id: t.string,
            imageUrl: t.string,
            fullName: t.string,
        }),
    }

    getParticipants = () => {
        const { currentUser, userToMessage } = this.props
        return [currentUser, userToMessage].map(user => ({
            id: user.id,
            type: 'user',
        }))
    }

    onMessageSend = content => {
        const { conversation, message } = this.props.nion
        const { setIsSending, setIsSent, setIsError } = this.props

        // We want to track isSending state with local state, since there'll be a flicker in between
        // the conversation post loading ending and the post message starting
        setIsSending(true)

        // We need to create a conversation, then create a message using the subsequent conversation
        // id. We'll handle this with promises internally
        const conversationPayload = new JsonApiPayload('conversation', {})
        conversationPayload.addRelationship(
            'participants',
            this.getParticipants(),
        )

        conversation.actions
            .post(conversationPayload.toRequest())
            .then(result => {
                const conversationId = result.id

                const messagePayload = new JsonApiPayload('message_v2', {
                    content,
                })
                messagePayload.addRelationship('conversation', conversationId)

                return message.actions.post(messagePayload.toRequest())
            })
            .then(() => {
                setIsSending(false)
                setIsSent(true)
                setTimeout(this.closeModal, 1000)
            })
            .catch(() => {
                setIsSending(false)
                setIsError(true)
            })
    }

    // We need to reset local state when we want to close the modal
    closeModal = () => {
        const {
            onRequestClose,
            setIsSending,
            setIsSent,
            setIsError,
        } = this.props
        setIsSending(false)
        setIsSent(false)
        setIsError(false)
        onRequestClose()
    }

    render() {
        const { isSending, isSent, isError } = this.props

        return (
            <MessageUserModal
                onRequestClose={this.props.onRequestClose}
                currentUserImageUrl={this.props.currentUser.imageUrl}
                details={this.props.details}
                isSending={isSending}
                isSent={isSent}
                isError={isError}
                onMessageSend={this.onMessageSend}
                isOpen={this.props.isModalOpen}
                userToMessage={this.props.userToMessage}
            />
        )
    }
}

export default MessageUserModalContainer



// WEBPACK FOOTER //
// ./app/modules/MessageUserModal/containers/MessageUserModal/index.jsx