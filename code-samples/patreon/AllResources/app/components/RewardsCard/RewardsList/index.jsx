/* eslint-disable react/no-multi-comp */
import t from 'prop-types'

import React, { Component } from 'react'
import { withFeatureFlag } from 'libs/with-feature-flag'
import get from 'lodash/get'

import Button from 'components/Button'
import Icon from 'components/Icon'
import Text from 'components/Text'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'

import {
    LimitedLouderExp,
    RewardWrapper,
    RewardsUnorderedListContainer,
} from './styled-components'

import formatCurrency from 'utilities/format-currency'

import pluralize from 'pluralize'

const rewardPropType = {
    amountCents: t.number.isRequired,
    description: t.string.isRequired,
    patronCount: t.number,
    userLimit: t.number,
    discordRoleIds: t.arrayOf(t.string),
    isTwitchReward: t.bool,
    isSoldOut: t.bool,
}

export function renderRewardDescription(rewardDescription) {
    return (
        <RewardsUnorderedListContainer
            dangerouslySetInnerHTML={{ __html: rewardDescription }}
        />
    )
}

renderRewardDescription.propTypes = {
    rewardDescription: t.string,
}

@withFeatureFlag('aaHideItems')
export default class RewardsList extends Component {
    static propTypes = {
        aaHideItems: t.bool,
        earningsVisibility: t.oneOf(['private', 'public']),
        rewards: t.arrayOf(t.shape(rewardPropType)).isRequired,
        payPerName: t.string.isRequired,
        rewardClick: t.func,
        limitedRewardsExperiment: t.oneOf([
            'control',
            'minimal_a',
            'minimal_b',
            'loud_a',
            'loud_b',
            'louder_a',
            'louder_b',
        ]),
        rewardsCardButtonTextExperiment: t.oneOf([
            'control',
            'x_access',
            'x_members',
            'x_membership_tier',
            'x_tier',
        ]),
        currentUserReward: t.object,
        currentUserIsOwner: t.bool,
        editable: t.bool,
        disabled: t.bool,
    }

    handleRewardClick = (amountCents, isLimitedReward) => {
        this.props.rewardClick(amountCents, isLimitedReward)
    }

    renderLimitedRewardsExperimentVariation = (
        limitedRewardsExperiment,
        reward,
        patronsPluralized,
    ) => {
        const { patronCount, userLimit, title } = reward
        const separator = title && '\u2219'
        const rewardsLeft = userLimit - patronCount

        switch (limitedRewardsExperiment) {
            case 'control':
                return (
                    <span>
                        {' '}
                        {separator} {patronCount} of {userLimit}{' '}
                        {patronsPluralized}
                    </span>
                )
            case 'minimal_a':
                return (
                    <Text size={0} el="div" color="error">
                        {patronCount} of {userLimit} claimed
                    </Text>
                )
            case 'minimal_b':
                return (
                    <Text size={0} el="div" color="error">
                        Only {rewardsLeft} left
                    </Text>
                )
            case 'loud_a':
                return (
                    <Text size={0} el="div" color="error">
                        LIMITED! {patronCount} of {userLimit} claimed
                    </Text>
                )
            case 'loud_b':
                return (
                    <Text size={0} el="div" color="error">
                        LIMITED! Only {rewardsLeft} left
                    </Text>
                )
            case 'louder_a':
                return (
                    <LimitedLouderExp>
                        LIMITED! {patronCount} of {userLimit} claimed
                    </LimitedLouderExp>
                )
            case 'louder_b':
                return (
                    <LimitedLouderExp>
                        LIMITED! Only {rewardsLeft} left
                    </LimitedLouderExp>
                )
            default:
                return (
                    <span>
                        {' '}
                        {separator} {patronCount} of {userLimit}{' '}
                        {patronsPluralized}
                    </span>
                )
        }
    }

    renderPatronCount = reward => {
        const isPublic = this.props.earningsVisibility !== 'private'
        const { limitedRewardsExperiment } = this.props
        const patronsPluralized =
            reward.userLimit > 0
                ? 'patrons'
                : pluralize('patron', reward.patronCount)
        const limitedReward = reward.userLimit > 0
        const soldOut = reward.isSoldOut
        const separator = reward.title && '\u2219'

        //This is the current rewards styling
        const rewardNotFullEl = (
            <span>
                {' '}
                {separator} {reward.patronCount} of {reward.userLimit}{' '}
                {patronsPluralized}
            </span>
        )
        const rewardFullEl = (
            <span>
                {' '}
                {separator} {reward.patronCount} {patronsPluralized}
            </span>
        )
        const patronCount =
            limitedReward && !soldOut ? rewardNotFullEl : rewardFullEl

        //This is the A/B experiment limited rewards styling
        const patronCountForLimitedRewardsExp =
            limitedReward && !soldOut
                ? this.renderLimitedRewardsExperimentVariation(
                      limitedRewardsExperiment,
                      reward,
                      patronsPluralized,
                  )
                : rewardFullEl

        //This selects which of the two to display
        const patronCountDisplayed = !!limitedRewardsExperiment
            ? patronCountForLimitedRewardsExp
            : patronCount

        return <span>{isPublic && patronCountDisplayed}</span>
    }

    renderDiscordRolesLabel = () => {
        return (
            <Block mt={2} fluidWidth>
                <Flexy fluidWidth>
                    <Block mr={1}>
                        <Icon
                            type="socialDiscord"
                            color="discordBlurple"
                            size="xs"
                        />
                    </Block>
                    <Text size={0} color="gray3">
                        Includes Discord rewards
                    </Text>
                </Flexy>
            </Block>
        )
    }

    rewardButtonText = amountDollar => {
        const formattedAmount = formatCurrency(amountDollar)
        switch (this.props.rewardsCardButtonTextExperiment) {
            case 'control':
                return `Get ${formattedAmount} Reward`
            case 'x_access':
                return `${formattedAmount} Access`
            case 'x_members':
                return `${formattedAmount} Members`
            case 'x_membership_tier':
                return `${formattedAmount} Membership Tier`
            case 'x_tier':
                return `${formattedAmount} Tier`
            default:
                return `Get ${formattedAmount} Reward`
        }
    }

    renderReward = (reward, i, collection) => {
        const amountDollar = reward.amountCents / 100
        const patronLimitReached = reward.isSoldOut
        const isCurrentUserReward =
            this.props.currentUserReward &&
            this.props.currentUserReward.id === reward.id
        const isTwitchReward = reward.isTwitchReward
        const isLimitedReward = reward.userLimit > 0
        const showUnpublishedMarker =
            !reward.published &&
            (this.props.editable || this.props.currentUserIsOwner)
        let buttonContent = this.rewardButtonText(amountDollar)
        if (isTwitchReward) {
            buttonContent = (
                <Flexy fluidWidth>
                    <div className="mr-sm mt-xs">
                        <Icon
                            type="socialTwitch"
                            color="twitchPurple"
                            size="xs"
                        />
                    </div>
                    <Text>Get Twitch reward</Text>
                </Flexy>
            )
        }
        if (patronLimitReached) {
            buttonContent = 'SOLD OUT'
        }
        if (showUnpublishedMarker) {
            buttonContent = 'Unpublished'
        }
        if (isCurrentUserReward) {
            buttonContent = 'Your current reward'
        }

        const requirementText = `${formatCurrency(
            amountDollar,
        )} or more per ${this.props.payPerName}`
        const subtitleRequirementText = isTwitchReward ? '' : requirementText

        const defaultRewardTitle = isTwitchReward
            ? 'Twitch Subscription'
            : `Pledge ${requirementText}`

        const isButtonDisabled =
            this.props.disabled ||
            patronLimitReached ||
            isCurrentUserReward ||
            !reward.published

        // We want to disable the bottom margin for the last reward in the list
        const isLast = i === collection.length - 1
        const showItems = this.props.aaHideItems
            ? this.props.currentUserIsOwner
            : true

        return (
            <RewardWrapper key={i} isLast={isLast} data-tag="reward-tier">
                <Text weight="bold" el="h6" noMargin>
                    {!!reward.title ? reward.title : defaultRewardTitle}
                </Text>
                <div className="mb-md">
                    <Text size={0} color="gray3">
                        {!!reward.title && subtitleRequirementText}
                        {this.renderPatronCount(reward)}
                        {patronLimitReached && (
                            <Text size={0} color="highlightPrimary">
                                {' '}
                                (sold out!)
                            </Text>
                        )}
                    </Text>
                </div>
                {!!reward.imageUrl && (
                    <div className="mb-md">
                        <img src={reward.imageUrl} width="100%" />
                    </div>
                )}
                {renderRewardDescription(reward.description)}
                {showItems &&
                    get(reward, 'items.length', 0) > 0 && (
                        <Block mt={1}>
                            <Text size={0}>Includes</Text>
                            <RewardsUnorderedListContainer>
                                <ul>
                                    {reward.items.map(item => (
                                        <Block mt={1}>
                                            <li>{item.title}</li>
                                        </Block>
                                    ))}
                                </ul>
                            </RewardsUnorderedListContainer>
                        </Block>
                    )}
                {reward.discordRoleIds && reward.discordRoleIds.length
                    ? this.renderDiscordRolesLabel()
                    : null}
                <div className="mt-md">
                    <Button
                        href={reward.url}
                        onClick={() =>
                            this.handleRewardClick(
                                reward.amountCents,
                                isLimitedReward,
                            )}
                        color="tertiary"
                        size="sm"
                        fluid
                        disabled={isButtonDisabled}
                    >
                        {buttonContent}
                    </Button>
                </div>
            </RewardWrapper>
        )
    }

    render() {
        const rewardsSorted = this.props.rewards.reduce((memo, r) => {
            r.isTwitchReward ? memo.unshift(r) : memo.push(r)
            return memo
        }, [])
        return <div>{rewardsSorted.map(this.renderReward)}</div>
    }
}



// WEBPACK FOOTER //
// ./app/components/RewardsCard/RewardsList/index.jsx