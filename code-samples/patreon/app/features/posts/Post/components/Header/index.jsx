import t from 'prop-types'
import React, { Component } from 'react'
import pluralize from 'pluralize'
import { POST_EVENTS, logPostEvent } from 'analytics'

import { formatDateAndTime } from 'utilities/format-date'
import formatCurrencyFromCents from 'utilities/format-currency-from-cents'
import formatNumberComma from 'utilities/format-number-comma'
import shallowCompare from 'utilities/shallow-compare'

import { SINGLE_POST } from 'constants/feednames'
import Avatar from 'components/Avatar'
import LinkedLabel from 'components/LinkedLabel'
import TextButton from 'components/TextButton'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Text from 'components/Text'

import { PostInfoRow, AccessLabel } from './styled-components'

class Header extends Component {
    shouldComponentUpdate: shallowCompare

    static propTypes = {
        authorAvatarUrl: t.string,
        authorId: t.string,
        authorUrl: t.string,
        changeVisibilityAt: t.string,
        currentUserCanView: t.bool,
        earningsVisibility: t.string,
        feedName: t.string,
        fullName: t.string,
        id: t.string,
        isPaidForByPatrons: t.bool,
        linkToProfile: t.bool,
        minCentsPledgedToView: t.number,
        patronCount: t.number,
        patreonUrl: t.string,
        publishedAt: t.string,
    }

    static defaultProps = {
        linkToProfile: false,
    }

    isExclusive = () => {
        return this.props.minCentsPledgedToView > 0
    }

    getPrivacyIconType = () => {
        return this.props.currentUserCanView ? 'unlocked' : 'lock'
    }

    getPledgeDollarsFormatted = ({ minCentsPledgedToView }) => {
        if (minCentsPledgedToView === 1) {
            return 'Patrons only'
        }
        return `${formatCurrencyFromCents(minCentsPledgedToView)}+ patrons`
    }

    renderAccessLabel = () => {
        const {
            authorId,
            changeVisibilityAt,
            currentUserCanView,
            feedName,
            id,
            minCentsPledgedToView,
            patreonUrl,
        } = this.props
        const pledgeDollarsString = this.getPledgeDollarsFormatted(this.props)

        let accessLabelData = {
            icon: this.getPrivacyIconType(),
            iconColor: 'subduedGray',
            linkUrl: patreonUrl,
            size: 'xxxs',
            text: pledgeDollarsString,
        }

        const clickedLinkedLabel = () => {
            logPostEvent(POST_EVENTS.CLICKED_TO_GET_ACCESS, {
                creator_id: authorId,
                post_id: id,
                is_blurred: !currentUserCanView,
                is_early_access_post: !!changeVisibilityAt,
                min_cents_pledged_to_view: minCentsPledgedToView,
                source: feedName,
            })
        }

        return (
            this.isExclusive() && (
                <AccessLabel>
                    <LinkedLabel
                        onClick={clickedLinkedLabel}
                        {...accessLabelData}
                    />
                </AccessLabel>
            )
        )
    }

    render() {
        const {
            authorAvatarUrl,
            authorId,
            authorUrl,
            changeVisibilityAt,
            currentUserCanView,
            earningsVisibility,
            feedName,
            fullName,
            id,
            isPaidForByPatrons,
            linkToProfile,
            minCentsPledgedToView,
            patronCount,
            patreonUrl,
            publishedAt,
        } = this.props

        const avatar = (
            <Block display="inline-block" mr={2}>
                <Avatar src={authorAvatarUrl} size="sm" />
            </Block>
        )

        const fullNameContainer = (
            <Block display="inline-block">
                <Text weight="bold" ellipsis>
                    {fullName}
                </Text>
            </Block>
        )

        const paidForByPatronsContainer = (
            <span>
                <Text color="gray3" size={0}>
                    Paid for by patrons
                </Text>
                <Block display="inline" mh={0.5}>
                    <Text color="gray3" size={0}>
                        &middot;
                    </Text>
                </Block>
            </span>
        )

        const patronCountContainer = (
            <span>
                <Text color="gray3" size={0}>
                    {formatNumberComma(patronCount)}&nbsp;{pluralize('patron', patronCount)}
                </Text>
                <Block display="inline" mh={0.5}>
                    <Text color="gray3" size={0}>
                        &middot;
                    </Text>
                </Block>
            </span>
        )

        const showPatronCount =
            feedName !== SINGLE_POST &&
            patronCount > 0 &&
            earningsVisibility !== 'private'

        const clickedDateTime = () => {
            logPostEvent(POST_EVENTS.CLICKED_DATETIME, {
                creator_id: authorId,
                post_id: id,
                is_blurred: !currentUserCanView,
                is_early_access_post: !!changeVisibilityAt,
                min_cents_pledged_to_view: minCentsPledgedToView,
                source: feedName,
            })
        }

        return (
            <Block m={2} position="relative">
                <Flexy>
                    {linkToProfile ? <a href={authorUrl}>{avatar}</a> : avatar}
                    <PostInfoRow>
                        {linkToProfile ? (
                            <a href={authorUrl}>{fullNameContainer}</a>
                        ) : (
                            fullName
                        )}
                        <Flexy alignItems="center">
                            <Block display="inline-block">
                                {isPaidForByPatrons &&
                                    paidForByPatronsContainer}
                                {showPatronCount && patronCountContainer}
                                <TextButton
                                    color="subdued"
                                    size={0}
                                    href={patreonUrl}
                                    onClick={clickedDateTime}
                                >
                                    {formatDateAndTime(publishedAt)}
                                </TextButton>
                            </Block>
                        </Flexy>
                    </PostInfoRow>
                    {this.renderAccessLabel()}
                </Flexy>
            </Block>
        )
    }
}

export default Header



// WEBPACK FOOTER //
// ./app/features/posts/Post/components/Header/index.jsx