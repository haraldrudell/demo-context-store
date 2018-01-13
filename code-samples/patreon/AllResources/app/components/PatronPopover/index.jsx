import t from 'prop-types'
import React, { Component } from 'react'
import nion, { exists, selectData } from 'nion'
import { buildUrl } from 'utilities/json-api'
import { connect } from 'react-redux'
import get from 'lodash/get'

import formatCurrencyFromCents from 'utilities/format-currency-from-cents'

import PatronPopover from './inner-component'

/*
 * This component wraps the unconnected PatronPopover in a nion container,
 * plucks out the data that is required to render the popover, and passes it
 * down. :)
 */

const makeMapStateToProps = () => {
    const mapStateToProps = (state, ownProps) => ({
        campaignId: selectData('currentUser.campaign.id')(state),
        currentUserId: selectData('currentUser.id')(state),
        currentUserIsCreator: selectData('currentUser.isCreator')(state),
        payPerName: selectData('currentUser.campaign.payPerName')(state),
    })
    return mapStateToProps
}

@connect(makeMapStateToProps)
@nion(({ patronId }) => ({
    userPledgeData: {
        dataKey: `userPledgeData:${patronId}`,
        endpoint: buildUrl(`/user/${patronId}`, {
            include: ['memberships.reward'],
            fields: {
                user: ['full_name', 'image_url'],
                member: [
                    'last_charge_status',
                    'full_name',
                    'pledge_amount_cents',
                    'lifetime_support_cents',
                    'pledge_relationship_start',
                ],
                reward: ['title', 'amount_cents'],
            },
            'json-api-use-default-includes': false,
        }),
        fetchOnInit: false,
        fetchOnce: false,
    },
}))
export default class ConnectedPatronPopover extends Component {
    static propTypes = {
        patronId: t.string.isRequired,
        fullName: t.string.isRequired,
        avatar: t.string.isRequired,
        children: t.node.isRequired,
        currentUserId: t.string,
        payPerName: t.string,
        currentUserIsCreator: t.bool,
        nion: t.object.isRequired,
    }

    render() {
        const { patronId } = this.props
        const {
            fullName: name,
            imageUrl: avatar,
        } = this.props.nion.userPledgeData

        if (
            this.props.currentUserId === patronId ||
            !this.props.currentUserIsCreator
        ) {
            return this.props.children
        }

        const { isLoading } = this.props.nion.userPledgeData.request
        let { get: getData } = this.props.nion.userPledgeData.actions

        if (isLoading || exists(this.props.nion.userPledgeData)) {
            getData = () => {}
        }
        let rewardTier

        let isPatron = false
        let isDeclined = false
        // Are there any pledges to the current user?

        let pledgeAmountCents,
            reward,
            chargeStatus,
            lifetimeSupportCents,
            joinDate

        const membership = get(this.props.nion.userPledgeData, 'memberships[0]')
        if (membership) {
            pledgeAmountCents = get(membership, 'pledgeAmountCents')
            reward = get(membership, 'reward')
            chargeStatus = get(membership, 'lastChargeStatus')
            lifetimeSupportCents = get(membership, 'lifetimeSupportCents')
            joinDate = get(membership, 'pledgeRelationshipStart')
        }

        if (pledgeAmountCents > 0) {
            isPatron = true
            const rewardTierTitle = get(reward, 'title')
            const rewardTierAmountCents = get(reward, 'amountCents')
            const noReward = get(reward) === null
            if (noReward) {
                rewardTier = 'No reward'
            } else if (rewardTierTitle) {
                rewardTier = rewardTierTitle
            } else {
                let pledgeMoney = formatCurrencyFromCents(rewardTierAmountCents)
                let perThingName = this.props.payPerName
                rewardTier = `${pledgeMoney} or more per ${perThingName}`
            }
        }

        if (chargeStatus === 'declined') {
            isDeclined = true
        }

        return (
            <PatronPopover
                getData={getData}
                isLoading={isLoading}
                name={name || this.props.fullName}
                avatar={avatar || this.props.avatar}
                pledgeAmountCents={pledgeAmountCents}
                rewardTier={rewardTier}
                lifetimeSupportCents={lifetimeSupportCents}
                patronId={patronId}
                isPatron={isPatron}
                isDeclined={!!isDeclined}
                joinDate={joinDate}
            >
                {this.props.children}
            </PatronPopover>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PatronPopover/index.jsx