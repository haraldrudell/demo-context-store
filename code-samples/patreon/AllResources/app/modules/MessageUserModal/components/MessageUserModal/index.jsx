import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Modal from 'components/NewModalWithContent'
import Icon from 'components/Icon'
import Text from 'components/Text'
import MessageEditor from 'features/messages/Conversation/components/MessageEditor'

class MessageUserModal extends Component {
    render() {
        const {
            currentUserImageUrl,
            details,
            isError,
            isSending,
            isSent,
            onRequestClose,
            onMessageSend,
            isOpen,
            userToMessage,
        } = this.props

        const title = `New Message to ${userToMessage.fullName}`

        const header = (
            <Block p={2} backgroundColor="gray6">
                <Flexy
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text weight="bold">
                        {title}
                    </Text>
                    <button className="button-reset" onClick={onRequestClose}>
                        <Icon size="xs" type="cancel" />
                    </button>
                </Flexy>
            </Block>
        )

        return (
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                header={header}
            >
                <Block p={2} pb={4}>
                    {details}
                </Block>
                <MessageEditor
                    autoFocus
                    isLoading={isSending}
                    isSent={isSent}
                    isError={isError}
                    onSend={onMessageSend}
                    userAvatar={currentUserImageUrl}
                />
            </Modal>
        )
    }
}

MessageUserModal.propTypes = {
    currentUserImageUrl: PropTypes.string,
    isOpen: PropTypes.bool,
    onMessageSend: PropTypes.func,
    onRequestClose: PropTypes.func,
    details: PropTypes.node,
    isSending: PropTypes.bool,
    isSent: PropTypes.bool,
    isError: PropTypes.bool,
    userToMessage: PropTypes.shape({
        id: PropTypes.string,
        imageUrl: PropTypes.string,
        fullName: PropTypes.string,
    }),
}

export default MessageUserModal



// WEBPACK FOOTER //
// ./app/modules/MessageUserModal/components/MessageUserModal/index.jsx