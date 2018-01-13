import { createSelector, createStructuredSelector } from 'reselect'
import moment from 'moment'

import { COMMUNITY } from 'constants/feednames'
import { DEFAULT_PAY_PER_NAME } from 'constants/creators'
import rewardsSelector from './rewards'
import { getStreamFilterFeedName } from 'getters/post-feed'
import {
    getPostTags,
    getCurrentPostTag,
    getFeaturedTags,
} from 'getters/post-tags'

import {
    getCurrentUserIsPageOwner,
    getCurrentUserIsCreator,
} from '../getters/currentUser'
import { getPageOwnerIsPatronOfCurrentUser } from '../getters/pageUser'
import {
    getCreatorRssEntity,
    getCreatorCampaignHasRss,
    getCurrentCreatorRssId,
} from 'getters/creator'
import { selectorForExperiment } from 'getters/experiments'

import { GET_POST_TAGS } from 'actions/post-tags'
import loadingGetter from 'getters/loading-getter'

import * as launchCelebration from 'modules/LaunchCelebrationModal'

import get from 'lodash/get'
import pick from 'lodash/pick'
import some from 'lodash/some'
import sortBy from 'lodash/sortBy'
import exists from 'utilities/exists'
import autolink from 'libs/autolink'
import getWindow from 'utilities/get-window'

export const LAUNCH_CELEBRATION_VIEWED_KEY = 'LAUNCH_CELEBRATION_VIEWED_KEY'

const displayPostPrompt = () =>
    !!get(getWindow(), 'patreon.bootstrap.postPrompt')
const userCanMessageCreator = () =>
    !!get(getWindow(), 'patreon.bootstrap.userCanMessageCreator')

const goalEntitySelector = state => state.entities.goal
const patronGoalEntitySelector = state => state.entities.patron_goal
const pledgeInputValueSelector = state => state.pledgeInputValue

export const userEntitySelector = state => state.entities.user
export const campaignEntitySelector = state => state.entities.campaign
export const creatorRefsSelector = state => state.creator

export const isOwnerSelector = getCurrentUserIsPageOwner

const showPatronPostCardSelector = createSelector(
    [isOwnerSelector, getStreamFilterFeedName],
    (isOwner, feedName) => {
        return !isOwner && feedName === COMMUNITY
    },
)

export const creatorCampaignSelector = createSelector(
    [creatorRefsSelector, campaignEntitySelector],
    (creator, campaigns) => {
        const campaign = {
            ...campaigns[creator.campaign.id].attributes,
            id: creator.campaign.id,
        }
        if (!exists(campaign.payPerName)) {
            campaign['payPerName'] = DEFAULT_PAY_PER_NAME
        }
        return campaign
    },
)

export const creatorRssSelector = createSelector(
    [
        creatorRefsSelector,
        getCreatorRssEntity,
        getCreatorCampaignHasRss,
        getCurrentCreatorRssId,
    ],
    (creator, rssEntity, hasRss, rssId) => {
        const rssAttributes = get(rssEntity, `[${rssId}].attributes`)
        return {
            ...rssAttributes,
            hasRss,
        }
    },
)

const creatorGoalsSelector = createSelector(
    [creatorRefsSelector, creatorCampaignSelector, goalEntitySelector],
    (creator, creatorCampaign, goals) => {
        const selectedGoals = creator.goals.reduce((memo, creatorGoal) => {
            if (creatorGoal.id < 1) {
                return memo
            }
            const goal = goals[creatorGoal.id]
            memo[creatorGoal.id] = {
                amountCents: get(goal, 'attributes.amountCents'),
                description: get(goal, 'attributes.description'),
                pledgedCents: creatorCampaign.pledgeSum,
                payPerName: creatorCampaign.payPerName,
                completedPercentage: get(
                    goal,
                    'attributes.completedPercentage',
                ),
            }
            return memo
        }, {})
        return sortBy(selectedGoals, 'amountCents')
    },
)

const patronGoalsSelector = createSelector(
    [creatorRefsSelector, creatorCampaignSelector, patronGoalEntitySelector],
    (creator, campaign, patronGoals) => {
        const selectedPatronGoals = creator.patronGoals.reduce(
            (memo, patronGoal) => {
                if (patronGoal.id < 1) {
                    return memo
                }
                const pg = patronGoals[patronGoal.id]
                const isDeleted = get(pg, 'attributes.deletedAt')
                if (isDeleted) {
                    return memo
                }
                memo[patronGoal.id] = {
                    numberPatrons: get(pg, 'attributes.numberPatrons'),
                    goalText: get(pg, 'attributes.goalText'),
                    currentPatronCount: get(campaign, 'patronCount'),
                }
                return memo
            },
            {},
        )
        return sortBy(selectedPatronGoals, 'numberPatrons')
    },
)

export const creatorUserSelector = createSelector(
    [creatorRefsSelector, userEntitySelector],
    (creator, users) => {
        const creatorId = get(creator, 'creator.id')
        return {
            id: creatorId,
            ...get(users, `${creatorId}.attributes`),
        }
    },
)

export const creatorIsUnlaunchedSelector = createSelector(
    [creatorCampaignSelector],
    creatorCampaign => !creatorCampaign.publishedAt,
)

// The just launched window is to ensure we do not show the launch celebration
// if the creator is viewing their profile from a differ browser session
export const creatorJustLaunchedSelector = createSelector(
    [creatorCampaignSelector],
    creatorCampaign => {
        if (!creatorCampaign.publishedAt) {
            return false
        }
        const publishedAt = moment(creatorCampaign.publishedAt)
        const now = moment()
        const delta = now.diff(publishedAt) / 1000
        return delta <= 900 // sec (15min) just launched window
    },
)

export const pledgeToCreatorSelector = state => {
    const currentUserPledge = get(state, 'creator.currentUserPledge')
    const pledge = get(state, 'entities.pledge')
    return currentUserPledge ? pledge[currentUserPledge.id] : null
}

export const currentUserRewardSelector = createSelector(
    pledgeToCreatorSelector,
    pledgeToCreator => get(pledgeToCreator, 'relationships.reward.data'),
)

export const currentUserPledgeAmountSelector = createSelector(
    pledgeToCreatorSelector,
    pledgeToCreator => get(pledgeToCreator, 'attributes.amountCents'),
)

export const currentUserPledgeIsTwitchSelector = createSelector(
    pledgeToCreatorSelector,
    pledgeToCreator => get(pledgeToCreator, 'attributes.isTwitchPledge'),
)

export const becomeAPatronExperimentString = createSelector(
    selectorForExperiment('becomeAPatron'),
    becomeAPatronTreatment => {
        switch (becomeAPatronTreatment) {
            case 'control':
                return 'Become a patron'
            case 'join_community':
                return 'Join community'
            case 'choose_reward':
                return 'Choose reward'
            case 'let_me_in':
                return 'Let me in'
            case 'pledge':
                return 'Pledge'
            case 'pledge_and_get_rewards':
                return 'Pledge & get rewards'
            case 'get_rewards':
                return 'Get rewards'
            case 'become_a_member':
                return 'Become a member'
            case 'pay_to_pledge':
                return 'Pay to Pledge'
            case 'join':
                return 'Join'
            case 'pay_to_join':
                return 'Pay to Join'
            case 'pledge_to_join':
                return 'Pledge to Join'
            case 'get_access':
                return 'Get access'
            case 'unlock':
                return 'Unlock'
            case 'pay_to_unlock':
                return 'Pay to unlock'
            case 'pledge_to_unlock':
                return 'Pledge to unlock'
            case 'subscribe':
                return 'Subscribe'
            case 'pay_to_subscribe':
                return 'Pay to subscribe'
            case 'pledge_support':
                return 'Pledge Support'
            default:
                return 'Become a patron'
        }
    },
)

export const creatorPageHeadSelector = createSelector(
    [
        creatorUserSelector,
        creatorCampaignSelector,
        rewardsSelector,
        pledgeToCreatorSelector,
        pledgeInputValueSelector,
        isOwnerSelector,
        selectorForExperiment('becomeAPatron'),
        becomeAPatronExperimentString,
        state => state.featureFlags,
    ],
    (
        creatorUser,
        creatorCampaign,
        rewards,
        pledgeToCreator,
        pledgeInputValue,
        isOwner,
        becomeAPatronTreatment,
        becomeAPatronText,
        flags,
    ) => {
        return {
            ...pick(creatorUser, 'fullName'),
            ...pick(
                creatorCampaign,
                'creationName',
                'isNsfw',
                'isPlural',
                'payPerName',
                'creationCount',
                'patronCount',
            ),
            userId: creatorUser.id,
            campaignId: creatorCampaign.id,
            pledgeSumCents: creatorCampaign.pledgeSum,
            heroImageUrl: creatorCampaign.imageUrl,
            avatarUrl: creatorUser.imageUrl,
            creatorSocialLinks: {
                facebook: creatorUser.facebook ? creatorUser.facebook : null,
                twitter: creatorUser.twitter
                    ? `https://twitter.com/${creatorUser.twitter}`
                    : null,
                youtube: creatorUser.youtube ? creatorUser.youtube : null,
                twitch: creatorUser.twitch ? creatorUser.twitch : null,
            },
            pledgeInputValue,
            rewardAmountsCents: rewards.map(reward => reward.amountCents),
            currentUserIsPatron: !!pledgeToCreator,
            isPledgePaused:
                !!pledgeToCreator &&
                get(pledgeToCreator, 'attributes.isPaused'),
            becomeAPatronTreatment,
            becomeAPatronText,
            isOwner,
            flags,
        }
    },
)

const pitchSelector = createSelector(
    [creatorCampaignSelector, pledgeToCreatorSelector],
    (creatorCampaign, pledgeToCreator) => {
        if (!creatorCampaign.summary && !creatorCampaign.mainVideoEmbed) {
            return null
        }

        return {
            currentUserIsPatron: !!pledgeToCreator,
            summary: autolink(creatorCampaign.summary) || null,
            video: creatorCampaign.mainVideoEmbed,
        }
    },
)

const currentUserIsPatronSelector = createSelector(
    [pledgeToCreatorSelector],
    pledgeToCreator => {
        return !!pledgeToCreator
    },
)

const patronTourSelector = createSelector(
    state => state.hasSeenPatronTour,
    currentUserIsPatronSelector,
    (hasSeen, isPatron) => ({
        hasSeen,
        flagIsOn: isPatron && false, // force disables to clean-up dead feature experiment
    }),
)

export const creatorInfoSelector = createSelector(
    [
        creatorUserSelector,
        creatorCampaignSelector,
        rewardsSelector,
        pledgeInputValueSelector,
    ],
    (creatorUser, creatorCampaign, rewards, pledgeInputValue) => {
        return {
            ...pick(creatorUser, 'id', 'fullName'),
            ...pick(
                creatorCampaign,
                'creationName',
                'isPlural',
                'payPerName',
                'creationCount',
                'patronCount',
                'earningsVisibility',
                'displayPatronGoals',
            ),
            userId: creatorUser.id,
            campaignId: creatorCampaign.id,
            pledgeSumCents: creatorCampaign.pledgeSum,
            heroImageUrl: creatorCampaign.imageUrl,
            avatarUrl: creatorUser.imageUrl,
            creatorSocialLinks: {
                facebook: creatorUser.facebook ? creatorUser.facebook : null,
                twitter: creatorUser.twitter
                    ? `https://twitter.com/${creatorUser.twitter}`
                    : null,
                youtube: creatorUser.youtube ? creatorUser.youtube : null,
                twitch: creatorUser.twitch ? creatorUser.twitch : null,
            },
            rewardAmountsCents: rewards.map(reward => reward.amountCents),
            pledgeInputValue,
        }
    },
)

const isCampaignPaused = createSelector(
    creatorCampaignSelector,
    campaign => campaign.isPaused,
)
const campaignPledgeUrl = createSelector(
    creatorCampaignSelector,
    campaign => campaign.pledgeUrl,
)
const hasActiveLimitedRewards = createSelector(rewardsSelector, rewards => {
    //returns true if user has limited rewards and they're not all sold out
    return some(
        rewards,
        reward =>
            !!reward.userLimit && reward.userLimit - reward.patronCount !== 0,
    )
})
const isCampaignPausedAlertDismissed = state =>
    get(state, 'page.isCampaignPausedAlertDismissed')

export const creatorPageSelector = createStructuredSelector({
    currentUserIsOwner: isOwnerSelector,
    currentUserIsPatron: currentUserIsPatronSelector,
    creatorPageHead: creatorPageHeadSelector,
    hasActiveLimitedRewards,
    isCampaignPaused,
    isCampaignPausedAlertDismissed,
    isPreview: state => get(state, 'isPreview'),
    limitedRewardsExperiment: selectorForExperiment('limitedRewardsExperiment'),
    postGridExperiment: selectorForExperiment('postGridExperiment'),
    rewardsCardButtonTextExperiment: selectorForExperiment(
        'rewardsCardButtonTextExperiment',
    ),
    routing: state => state.routing,
    campaignPledgeUrl,
})

const isLaunchCelebrationModalOpenSelector = state =>
    launchCelebration.getIsModalOpen(state)
const launchCelebrationModalViewedSelector = state => {
    return !!state.localStorage[LAUNCH_CELEBRATION_VIEWED_KEY]
}

export const overviewTabSelector = createStructuredSelector({
    creatorInfo: creatorInfoSelector,
    creatorIsUnlaunched: creatorIsUnlaunchedSelector,
    creatorJustLaunched: creatorJustLaunchedSelector,
    currentUserIsCreator: getCurrentUserIsCreator,
    currentUserIsOwner: isOwnerSelector,
    currentUserIsPatron: currentUserIsPatronSelector,
    currentUserPledgeAmountCents: currentUserPledgeAmountSelector,
    currentUserPledgeIsTwitch: currentUserPledgeIsTwitchSelector,
    displayPostPrompt: state =>
        !!get(state, 'postPrompt') && displayPostPrompt(),
    featuredTags: getFeaturedTags,
    goals: creatorGoalsSelector,
    hideGoalCard: selectorForExperiment('hideGoalsCardExperiment'),
    isLaunchCelebrationModalOpen: isLaunchCelebrationModalOpenSelector,
    isPreview: state => get(state, 'isPreview'),
    launchCelebrationModalViewed: launchCelebrationModalViewedSelector,
    ownerIsPatron: getPageOwnerIsPatronOfCurrentUser,
    patronGoals: patronGoalsSelector,
    pitch: pitchSelector,
    postPrompt: state => get(state, 'postPrompt'),
    postPublishState: state => state.postPublishState,
    postTagsFetching: loadingGetter(GET_POST_TAGS),
    rss: creatorRssSelector,
    userCanMessageCreator: () => userCanMessageCreator(),
})

export const postsTabSelector = createStructuredSelector({
    creatorInfo: creatorInfoSelector,
    currentPostsTabURL: state => get(state, 'currentPostsTabURL'),
    currentPostTag: getCurrentPostTag,
    currentUserIsCreator: getCurrentUserIsCreator,
    currentUserIsPatron: currentUserIsPatronSelector,
    currentUserIsOwner: isOwnerSelector,
    featuredTags: getFeaturedTags,
    featureFlags: state => get(state, 'featureFlags'),
    isPreview: state => get(state, 'isPreview'),
    patronTour: patronTourSelector,
    allowGridOption: state =>
        selectorForExperiment('postGridExperiment')(state) ===
        'show_grid_view_and_toggle',
    postTags: getPostTags,
    postTagsFetching: loadingGetter(GET_POST_TAGS),
})

export const communityTabSelector = createStructuredSelector({
    currentUserIsOwner: isOwnerSelector,
    showPatronPostCard: showPatronPostCardSelector,
})



// WEBPACK FOOTER //
// ./app/pages/creator_page_v3/selectors/index.js