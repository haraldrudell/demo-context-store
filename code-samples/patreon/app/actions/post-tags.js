import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'
import momenttz from 'moment-timezone'

export const GET_POST_TAGS = 'GET_POST_TAGS'
export const POST_FEATURED_TAGS = 'POST_FEATURED_TAGS'

export const GET_POST_TAGS_API_RESOURCE_PATH = (campaignId) => (`/campaigns/${campaignId}/post-tags`)
export const POST_FEATURED_TAGS_API_RESOURCE_PATH = (campaignId) => (`/campaigns/${campaignId}/featured-tags`)

const _getPostTags = (campaignId) => (
    (dispatch, getState) => {
        const postTagsEndpoint = GET_POST_TAGS_API_RESOURCE_PATH(campaignId)
        const params = {'timezone': momenttz.tz.guess()}
        return dispatch(apiRequestAction(GET_POST_TAGS, jsonApiUrl(postTagsEndpoint, params)))
    }
)

const _postFeaturedTags = (campaignId, featuredTags) => (
    (dispatch, getState) => {
        const featuredTagsEndpoint = POST_FEATURED_TAGS_API_RESOURCE_PATH(campaignId)
        const body = {
            data: featuredTags
        }
        return dispatch(apiRequestAction(POST_FEATURED_TAGS, jsonApiUrl(featuredTagsEndpoint), { body }))
    }
)

export const getPostTags = (campaignId) => _getPostTags(campaignId)
export const saveFeaturedTags = (campaignId, newFeaturedTags) => {
    // we need to make each item have an ordinal number consistent with the ordering
    const featuredTags = newFeaturedTags.map((featuredTag, index) => {
        return {
            type: 'post_tag',
            attributes: {
                is_featured: true,
                tag_type: featuredTag.filterType,
                ordinal_number: index,
                value: featuredTag.value
            }
        }
    })
    return _postFeaturedTags(campaignId, featuredTags)
}



// WEBPACK FOOTER //
// ./app/actions/post-tags.js