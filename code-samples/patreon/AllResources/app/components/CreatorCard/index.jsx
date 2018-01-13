import t from 'prop-types'
import React from 'react'

import CardButton from 'components/CardButton'
import CreatorCardContent from 'components/CreatorCardContent'

import { CREATOR_CARD_EVENTS } from 'analytics'

export default class CreatorCard extends React.Component {
    static displayName = 'CreatorCard'

    static propTypes = {
        creator: t.shape({
            campaign: t.shape({
                creationName: t.string,
                imageUrl: t.string,
                patronCount: t.number,
                payPerName: t.string,
                pledgeSum: t.number,
                pledgeTime: t.string,
                isPlural: t.bool,
            }),
            fullName: t.string.isRequired,
            id: t.string.isRequired,
            imageUrl: t.string.isRequired,
            url: t.string.isRequired,
        }).isRequired,

        logEvent: t.func,
        domainEvent: t.shape({
            domain: t.string,
            title: t.string,
        }),
        onClick: t.func,
        source: t.string,
    }

    static defaultProps = {
        card: true,
    }

    handleClick = () => {
        const { creator, domainEvent, logEvent } = this.props
        if (this.props.onClick) {
            this.props.onClick()
            return
        }
        if (!logEvent) return
        logEvent({
            domain: CREATOR_CARD_EVENTS.DOMAIN,
            title: CREATOR_CARD_EVENTS.CLICK,
            info: {
                creator_id: creator.id,
                source: this.props.source,
            },
        })
        if (domainEvent) {
            logEvent({
                ...this.props.domainEvent,
                info: {
                    creator_id: creator.id,
                },
            })
        }
    }

    render() {
        const creator = this.props.creator
        const contentProps = {
            ...creator,
            // don't render avatar url since the whole card is linked
            url: undefined,
        }

        return (
            <CardButton href={creator.url} onClick={this.handleClick} noPadding>
                <CreatorCardContent creator={contentProps} />
            </CardButton>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/CreatorCard/index.jsx