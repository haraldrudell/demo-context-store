import t from 'prop-types'
import React from 'react'
import Avatar from 'components/Avatar'
import Block from 'components/Layout/Block'
import { flexContainerHorizontal } from 'styles/shared/flex-helpers.less'
import formatPluralCount from 'utilities/format-plural-count'
import styles from './styles.less'

const MAX_AVATARS = 4

export default class extends React.Component {
    static propTypes = {
        participants: t.arrayOf(
            t.shape({
                id: t.oneOfType([t.string, t.number]).isRequired,
                fullName: t.string.isRequired,
                imageUrl: t.string.isRequired,
                url: t.string.isRequired,
                isYourPatron: t.bool,
                patronSince: t.string,
            }),
        ),
    }

    _multipleParticipants = participants => {
        const numParticipants = participants.length
        const shownParticipants = participants.slice(0, MAX_AVATARS)
        const otherCount = numParticipants - MAX_AVATARS

        return (
            <div className={`${styles.main} ${flexContainerHorizontal}`}>
                <div className={styles.avatarContainer}>
                    {shownParticipants.map((participant, index) => {
                        const marginRight =
                            index === shownParticipants.length - 1 ? 0 : -2
                        return (
                            <Block
                                key={participant.id}
                                position="relative"
                                display="inline-block"
                                mr={marginRight}
                                style={{ zIndex: numParticipants - index }}
                            >
                                <Avatar
                                    src={participant.imageUrl}
                                    size="sm"
                                    border
                                    borderStrokeWidth="3px"
                                />
                            </Block>
                        )
                    })}
                    {otherCount > 0 && (
                        <span className={styles.otherCount} testId="otherCount">
                            +{otherCount}
                        </span>
                    )}
                </div>
                <div className={styles.textContainer} testId="textContainer">
                    You sent out a message to{' '}
                    {formatPluralCount(numParticipants, 'person')}. Every
                    conversation is private.
                </div>
            </div>
        )
    }

    _singleParticipant = participant => {
        return (
            <div className={`${styles.main} ${flexContainerHorizontal}`}>
                <div className={styles.avatarContainer}>
                    <Block position="relative" display="inline-block">
                        <Avatar src={participant.imageUrl} size="sm" />
                    </Block>
                </div>
                <div className={styles.textContainer} testId="textContainer">
                    <div className={styles.name}>{participant.fullName}</div>
                    {participant.patronSince ? (
                        <div className="mt-xs">
                            {participant.isYourPatron
                                ? `Your patron for ${participant.patronSince}`
                                : `You have been a patron for ${participant.patronSince}`}
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }

    render() {
        return this.props.participants.length > 1
            ? this._multipleParticipants(this.props.participants)
            : this._singleParticipant(this.props.participants[0])
    }
}



// WEBPACK FOOTER //
// ./app/features/messages/Conversation/components/Header/index.jsx