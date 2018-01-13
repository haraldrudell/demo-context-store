import t from 'prop-types'
import React from 'react'

import Modal from 'components/Modal'
import Icon from 'components/Icon'
import Conversation from 'features/messages/Conversation'
import MessageSelectParticipants from './MessageSelectParticipants/Connected'

import { whitestGray } from 'styles/themes/default/colors-js.less'
import { flexContainerHorizontal } from 'styles/shared/flex-helpers.less'
import styles from './styles.less'

const MessageModal = props => {
    const {
        show,
        close,
        inline,
        title,
        showDetail,
        detailProps,
        selectProps,
        onMessageSend,
        onChangeParticipants,
    } = props

    const header = (
        <div
            className={`${styles.modalHeader} ${flexContainerHorizontal} middle-xs between-xs pt-md pr-lg pb-md pl-lg`}
            style={{ backgroundColor: whitestGray }}
        >
            <strong>
                {title}
            </strong>
            <button className="button-reset" onClick={close}>
                <Icon size="xs" type="cancel" />
            </button>
        </div>
    )

    return (
        <Modal
            show={show}
            close={close}
            header={header}
            inline={inline}
            noPadding
            isScrollable
        >
            <div
                style={{ height: '389px' }}
                className={styles.conversationDetailWrapper}
            >
                {showDetail
                    ? <Conversation
                          {...detailProps}
                          onMessageSend={onMessageSend}
                          onChangeParticipants={onChangeParticipants}
                      />
                    : <MessageSelectParticipants {...selectProps} />}
            </div>
        </Modal>
    )
}

MessageModal.propTypes = {
    show: t.bool,
    close: t.func,
    inline: t.bool,
    title: t.string,
    showDetail: t.bool,
    detailProps: t.shape(Conversation.propTypes).isRequired,
    // temp so we can pass fixtures in for cosmos
    // otherwise this is a connected component
    selectProps: t.shape(MessageSelectParticipants.propTypes),
    onMessageSend: t.func,
    onChangeParticipants: t.func,
}

export default MessageModal



// WEBPACK FOOTER //
// ./app/components/MessageModal/index.jsx