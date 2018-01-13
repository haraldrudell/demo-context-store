import t from 'prop-types'
import React, { Component } from 'react'

import Icon from 'components/Icon'
import Block from 'components/Layout/Block'
import LoadingSpinner from 'components/LoadingSpinner'
import CardWithHeader from 'components/CardWithHeader'
import RewardsList from './RewardsList'

const rewardPropType = {
    amountCents: t.number.isRequired,
    description: t.string.isRequired,
    patronCount: t.number,
    userLimit: t.number,
    discordRoleIds: t.arrayOf(t.string),
    isTwitchReward: t.bool,
}

export default class RewardsCard extends Component {
    static defaultProps = {
        title: 'Rewards',
    }

    static propTypes = {
        title: t.string.isRequired,
        rewards: t.arrayOf(t.shape(rewardPropType)).isRequired,
        payPerName: t.string,
        rewardClick: t.func,
        disabled: t.bool,
        editable: t.bool,
        onEditClick: t.func,
        showLoadingSpinner: t.bool,
        earningsVisibility: t.oneOf(['private', 'public']),
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
    }

    renderEditButton = () => {
        return this.props.editable ? (
            <a onClick={this.props.onEditClick}>
                <Icon type="editBox" size="xs" color="blue" label="Edit" />
            </a>
        ) : null
    }

    render() {
        const {
            currentUserIsOwner,
            currentUserReward,
            disabled,
            earningsVisibility,
            editable,
            limitedRewardsExperiment,
            payPerName,
            rewardClick,
            rewards,
            rewardsCardButtonTextExperiment,
            showLoadingSpinner,
            title,
        } = this.props
        return (
            <CardWithHeader
                title={title}
                renderHeaderContent={this.renderEditButton}
                hasHeaderBorder
            >
                {showLoadingSpinner ? (
                    <Block mt={6} mb={4}>
                        <LoadingSpinner size="sm" color="gray2" />
                    </Block>
                ) : (
                    <RewardsList
                        rewards={rewards}
                        payPerName={payPerName}
                        rewardClick={rewardClick}
                        earningsVisibility={earningsVisibility}
                        currentUserReward={currentUserReward}
                        currentUserIsOwner={currentUserIsOwner}
                        limitedRewardsExperiment={limitedRewardsExperiment}
                        rewardsCardButtonTextExperiment={
                            rewardsCardButtonTextExperiment
                        }
                        editable={editable}
                        disabled={editable || disabled}
                    />
                )}
            </CardWithHeader>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/RewardsCard/index.jsx