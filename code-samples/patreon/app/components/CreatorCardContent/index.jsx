import t from 'prop-types'
import React, { Component } from 'react'

import formatCurrencyRounded from 'utilities/format-currency-rounded'
import { CREATOR_CARD_EVENTS } from 'analytics'

import Avatar from 'components/Avatar'
import Block from 'components/Layout/Block'
import Text from 'components/Text'

import formatPluralCount from 'utilities/format-plural-count'
import {
    ContentWrapper,
    CreatorAvatarContainer,
    HeroImage,
} from './styled-components'

class CreatorCardContent extends Component {
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
            fullName: t.string,
            id: t.string,
            imageUrl: t.string.isRequired,
            url: t.string,
        }).isRequired,

        logEvent: t.func,

        hideMeta: t.bool,
        hideOverflow: t.bool,
        fullWidth: t.bool,
    }

    static defaultProps = {
        hideOverflow: true,
    }

    handleClick = () => {
        this.props.logEvent({
            domain: CREATOR_CARD_EVENTS.DOMAIN,
            title: CREATOR_CARD_EVENTS.CLICK,
            info: {
                creator_id: this.props.creator.id,
            },
        })
    }

    render() {
        const { creator, hideOverflow } = this.props
        const campaign = creator.campaign
        const pledgeAmount = campaign.pledgeSum && campaign.pledgeSum / 100
        const pluralSpeak = campaign.isPlural ? 'are' : 'is'

        const _avatar = (
            <CreatorAvatarContainer>
                <Avatar src={creator.imageUrl} size="md" border />
            </CreatorAvatarContainer>
        )

        const shouldRenderAmountAndPayPerName =
            pledgeAmount > 0 && !!campaign.payPerName

        return (
            <div>
                <HeroImage large={this.props.fullWidth}>
                    <img src={campaign.imageUrl} />
                </HeroImage>
                {creator.url
                    ? <a href={creator.url}>
                          {_avatar}
                      </a>
                    : _avatar}
                {!this.props.hideMeta &&
                    <ContentWrapper>
                        <Block mb={0.5}>
                            <Text
                                el="div"
                                weight="bold"
                                ellipsis={hideOverflow}
                            >
                                {creator.fullName}
                            </Text>
                        </Block>
                        <Text el="div" ellipsis={hideOverflow}>
                            {campaign.creationName &&
                                `
                                ${pluralSpeak} creating ${campaign.creationName}
                            `}
                        </Text>
                        <Block mt={1} fluidWidth>
                            {!!campaign.patronCount &&
                                <Text size={0} color="gray3">
                                    {formatPluralCount(
                                        campaign.patronCount,
                                        'patron',
                                    )}
                                </Text>}
                            {shouldRenderAmountAndPayPerName &&
                                <Block display="inline-block" ml={1}>
                                    <Text size={0} color="gray3">
                                        {formatCurrencyRounded(pledgeAmount)}{' '}
                                        per {campaign.payPerName}
                                    </Text>
                                </Block>}
                            {!!campaign.pledgeTime &&
                                <Block mt={1}>
                                    <Text
                                        size={-1}
                                        color="gray3"
                                        el="div"
                                        uppercase
                                    >
                                        Patron for {campaign.pledgeTime}
                                    </Text>
                                </Block>}
                        </Block>
                    </ContentWrapper>}
            </div>
        )
    }
}

export default CreatorCardContent



// WEBPACK FOOTER //
// ./app/components/CreatorCardContent/index.jsx