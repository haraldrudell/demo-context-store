import t from 'prop-types'
import React from 'react'
import autolink from 'libs/autolink'
import classNames from 'classnames'
import { flexContainerHorizontal } from 'styles/shared/flex-helpers.less'
import { formatDate } from 'utilities/format-date'
import { Message as messageShape } from 'utilities/prop-types'

import TextButton from 'components/TextButton'
import Text from 'components/Text'
import Avatar from 'components/Avatar'
import styles from './styles.less'

export default class extends React.Component {
    static propTypes = {
        messages: t.arrayOf(messageShape),
    }

    render() {
        return (
            <ol className={`${styles.list} list-reset`}>
                {this.props.messages.map((message, i) =>
                    <li
                        key={message.id}
                        className={`${flexContainerHorizontal}`}
                    >
                        <a href={message.sender.url}>
                            <div className={styles.avatarContainer}>
                                <Avatar
                                    src={message.sender.imageUrl}
                                    size="sm"
                                />
                            </div>
                        </a>
                        <div className={styles.textContainer}>
                            <div className={flexContainerHorizontal}>
                                <div className={styles.name}>
                                    <TextButton
                                        href={message.sender.url}
                                        color="dark"
                                    >
                                        {message.sender.fullName}
                                    </TextButton>
                                </div>
                                <div className={`${styles.date}`}>
                                    <Text size={0} color="gray3">
                                        {formatDate(message.sentAt)}
                                    </Text>
                                </div>
                            </div>
                            <div
                                className={classNames(
                                    'mt-xs',
                                    styles.messageContent,
                                )}
                                dangerouslySetInnerHTML={{
                                    __html: autolink(message.content),
                                }}
                            />
                        </div>
                    </li>,
                )}
            </ol>
        )
    }
}



// WEBPACK FOOTER //
// ./app/features/messages/Conversation/components/MessageList/index.jsx