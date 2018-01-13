import { createSelector } from 'reselect'
import get from 'lodash/get'
import pick from 'lodash/pick'
import forIn from 'lodash/forIn'
import sortBy from 'lodash/sortBy'
import {
    PUBLIC_TAG_TYPE,
    PATRON_ONLY_TAG_TYPE,
    USER_DEFINED_TAG_TYPE,
    YEAR_MONTH_TAG_TYPE,
    REWARD_TIER_TAG_TYPE,
    PAID_FOR_BY_PATRONS_TAG_TYPE,
    PARAM_TO_TAG_TYPE_MAPPING,
} from 'constants/post-tags'

import { getQueryParams } from 'getters/location'

const addToFilters = (filters, tag) => {
    filters.push({
        value: tag.value,
        count: tag.cardinality,
        id: tag.id,
        filterType: tag.tagType,
        isFeatured: tag.isFeatured,
        backgroundImageUrl: tag.backgroundImageUrl,
    })
    return filters
}

const addToFeaturedTags = (featuredTags, tag) => {
    featuredTags.push({
        value: tag.value,
        count: tag.cardinality,
        id: tag.id,
        filterType: tag.tagType,
        isFeatured: tag.isFeatured,
        backgroundImageUrl: tag.backgroundImageUrl,
        ordinalNumber: tag.ordinalNumber,
    })
    return featuredTags
}

export const getFeaturedTags = state => {
    let featuredTags = []

    const allPostTags = get(state, 'postTags')

    if (!allPostTags._fetchedAt) {
        return undefined
    }

    allPostTags.forEach(tag => {
        if (tag.tagType === USER_DEFINED_TAG_TYPE && tag.isFeatured) {
            addToFeaturedTags(featuredTags, tag)
        }
    })

    return sortBy(featuredTags, 'ordinalNumber')
}

export const getPostTags = state => {
    const allPostTags = get(state, 'postTags')

    let typeFilters = []
    let tagFilters = []
    let monthFilters = []

    // The following will all be added to typeFilters eventually,
    // but we want more explicit control over their ordering before
    // we add them to that array
    let publicTypeFilters = []
    let patronOnlyTypeFilters = []
    let rewardTierTypeFilters = []
    let paidForByPatronsTypeFilters = []

    // TODO: Gracefully handle the non fetched state.
    if (!allPostTags._fetchedAt) {
        return {}
    }

    allPostTags.forEach(tag => {
        switch (tag.tagType) {
            case PUBLIC_TAG_TYPE:
                addToFilters(publicTypeFilters, tag)
                break
            case PATRON_ONLY_TAG_TYPE:
                addToFilters(patronOnlyTypeFilters, tag)
                break
            case YEAR_MONTH_TAG_TYPE:
                addToFilters(monthFilters, tag)
                break
            case REWARD_TIER_TAG_TYPE:
                addToFilters(rewardTierTypeFilters, tag)
                break
            case PAID_FOR_BY_PATRONS_TAG_TYPE:
                addToFilters(paidForByPatronsTypeFilters, tag)
                break
            case USER_DEFINED_TAG_TYPE:
                // If user enabled featured tags, only add to tag filters if not featured.
                if (!tag.isFeatured) {
                    addToFilters(tagFilters, tag)
                }
                break
            default:
                break
        }
    })

    // Now we can push the type filters on in the order we want
    paidForByPatronsTypeFilters.forEach(paidForByPatronsTypeFilter => {
        typeFilters.push(paidForByPatronsTypeFilter)
    })
    publicTypeFilters.forEach(publicTypeFilter => {
        typeFilters.push(publicTypeFilter)
    })
    patronOnlyTypeFilters.forEach(patronOnlyTypeFilter => {
        typeFilters.push(patronOnlyTypeFilter)
    })
    rewardTierTypeFilters.forEach(rewardTierTypeFilter => {
        const dollarAmount = parseInt(rewardTierTypeFilter.value) / 100
        const tagValue = '$' + dollarAmount.toString()
        typeFilters.push({
            value: tagValue,
            count: rewardTierTypeFilter.count,
            id: rewardTierTypeFilter.id,
            filterType: rewardTierTypeFilter.filterType,
        })
    })

    return {
        typeFilters,
        tagFilters,
        monthFilters,
    }
}

export const getCurrentPostTag = createSelector(getQueryParams, params => {
    if (Object.keys(params).length === 0) {
        return undefined
    }

    // Look for all the possible post tags within the query parameters
    const possiblePostTagParams = pick(
        params,
        'tag',
        'month',
        'public',
        'patron',
        'rewardTier',
        'paidForByPatrons',
    )

    // Transform the query param values into the values we want to display. (e.g. 'true' --> 'Public')
    let possiblePostTags = []

    forIn(possiblePostTagParams, (paramValue, paramKey) => {
        // I don't really like how this selector needs to know how to build how the PostsFilter wants it to be.
        let postTag = {
            value: paramValue,
            filterType: PARAM_TO_TAG_TYPE_MAPPING[paramKey],
        }
        if (postTag.value === 'true') {
            switch (postTag.filterType) {
                case PAID_FOR_BY_PATRONS_TAG_TYPE:
                    postTag.value = 'Paid for by Patrons'
                    break
                case PUBLIC_TAG_TYPE:
                    postTag.value = 'Public'
                    break
                case PATRON_ONLY_TAG_TYPE:
                    postTag.value = 'Patron Only'
                    break
                default:
                    break
            }
        }

        possiblePostTags.push(postTag)
    })

    // Ensure that we only pick one post tag to filter on.
    let currentPostTag = undefined

    if (possiblePostTags.length === 1) {
        currentPostTag = possiblePostTags[0]
    }

    return currentPostTag
})



// WEBPACK FOOTER //
// ./app/getters/post-tags.js