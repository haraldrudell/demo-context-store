import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'

import { serializePollChoices, serializeTagValues } from 'utilities/make-post'

export const GET_POST = 'GET_POST'
export const GET_NEW_DRAFT = 'GET_NEW_DRAFT'

export const POST_POST = 'POST_POST'
export const PATCH_POST = 'PATCH_POST'

export const GET_DRAFTS = 'GET_DRAFTS'
export const GET_PUBLISHED_POSTS = 'GET_PUBLISHED_POSTS'
export const GET_SCHEDULED_POSTS = 'GET_SCHEDULED_POSTS'

import { API_POST_TYPES } from 'constants/posts'

export const patchPost = (
    postId,
    postAttributes,
    pollAttributes,
    postTagValues,
) => {
    let { included, relationships } = serializeTagValues(postTagValues)

    if (postAttributes.post_type === API_POST_TYPES.POLL) {
        const { includedPollInfo, pollRelationshipInfo } = serializePollChoices(
            pollAttributes,
        )

        included = [...included, ...includedPollInfo]
        relationships = {
            ...relationships,
            ...pollRelationshipInfo,
        }
    }

    const tags = { ...postAttributes.tags }
    tags.publish = !!tags.publish

    const data = {
        type: 'post',
        attributes: {
            ...postAttributes,
            tags,
        },
        relationships,
    }

    const postIncludes = [
        'user.null',
        'attachments.null',
        'user_defined_tags.null',
        'campaign.earnings_visibility',
        'campaign.rewards.null',
        'poll',
    ]

    const body = { data, included }
    const url = jsonApiUrl(`/posts/${postId}`, { include: postIncludes })
    return apiRequestAction(PATCH_POST, url, {
        body,
        headers: { 'Content-Type': 'application/json' },
    })
}

export const publishPost = (postId, postAttributes, postTagValues) => {
    const tags = { ...postAttributes.tags, publish: true }
    const pa = { ...postAttributes, tags }

    return patchPost(postId, pa, postTagValues)
}

export const getPost = postId => {
    const postIncludes = [
        'user.null',
        'attachments.null',
        'user_defined_tags.null',
        'campaign.earnings_visibility',
        'campaign.rewards.null',
        'poll',
    ]

    const postFields = {
        post: [
            'category',
            'cents_pledged_at_creation',
            'change_visibility_at',
            'comment_count',
            'content',
            'created_at',
            'current_user_can_delete',
            'current_user_can_view',
            'current_user_has_liked',
            'deleted_at',
            'early_access_min_cents',
            'edit_url',
            'edited_at',
            'early_access_min_cents',
            'embed',
            'image',
            'is_automated_monthly_charge',
            'is_paid',
            'like_count',
            'min_cents_pledged_to_view',
            'num_pushable_users',
            'patreon_url',
            'patron_count',
            'pledge_url',
            'post_file',
            'post_type',
            'published_at',
            'scheduled_for',
            'thumbnail',
            'title',
            'url',
            'was_posted_by_campaign_owner',
        ],
    }

    const url = jsonApiUrl(`/posts/${postId}`, {
        include: postIncludes,
        fields: postFields,
    })

    return apiRequestAction(GET_POST, url)
}



// WEBPACK FOOTER //
// ./app/actions/make-post.js