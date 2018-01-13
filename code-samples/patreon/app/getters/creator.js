import access from 'safe-access'
import { createSelector } from 'reselect'

export const getCurrentCreator = (state) => access(state, 'creator')
export const getCreatorEntity = state => access(state, 'entities.user')
export const getCampaignEntity = state => access(state, 'entities.campaign')
export const getCurrentCreatorUserId = (state) => access(getCurrentCreator(state), 'creator.id')
export const getCurrentCreatorRssId = (state) => access(getCurrentCreator(state), 'rssAuthToken.id')
export const getCreatorPostAggregation = (state) => access(state, 'entities.post_aggregation')
export const getCreatorRssEntity = (state) => access(state, 'entities.rss-auth-token')

export const getCreatorUser = createSelector(
    [getCurrentCreator, getCreatorEntity],
    (creator, user) => {
        const creatorId = access(creator, 'creator.id') || access(creator, 'campaign.id')
        return {
            id: creatorId,
            ...access(user, `${creatorId}.attributes`)
        }
    }
)

export const getCreatorCampaignId = createSelector(
    [getCreatorUser, getCreatorEntity],
    (creatorUser, creatorEntity) => {
        const creatorId = creatorUser.id
        return access(creatorEntity, `${creatorId}.relationships.campaign.data.id`)
    }
)

export const getCreatorCampaign = createSelector(
    [getCampaignEntity, getCreatorCampaignId],
    (campaignEntity, campaignId) => {
        return {
            id: campaignId,
            ...access(campaignEntity, `${campaignId}.attributes`)
        }
    }
)

export const getCreatorCampaignHasRss = createSelector(
    [getCampaignEntity, getCreatorCampaignId],
    (campaignEntity, campaignId) => (
        access(campaignEntity, `${campaignId}.attributes.hasRss`) || false
    )
)



// WEBPACK FOOTER //
// ./app/getters/creator.js