import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'
import clientize from 'utilities/clientize'

import { SETTINGS_PAGE_EVENTS, logSettingsEvent } from 'analytics'

export const GET_CURRENT_USER = 'GET_CURRENT_USER'
export const PATCH_CURRENT_USER = 'PATCH_CURRENT_USER'
export const CURRENT_USER_SUCCESS = 'CURRENT_USER_SUCCESS'
export const CURRENT_USER_ERROR = 'CURRENT_USER_ERROR'

export const API_RESOURCE_PATH = '/current_user'

const DEFAULT_VARIANT = {
    include: [],
}

const _getCurrentUser = ({ variant = DEFAULT_VARIANT }) => (
    dispatch,
    getState,
) => {
    const { include, fields } = variant
    return dispatch(
        apiRequestAction(
            GET_CURRENT_USER,
            jsonApiUrl(API_RESOURCE_PATH, { include, fields }),
        ),
    )
}

const pledgingAndFollowing = {
    /* TODO: these variants should probably get their own actionTypes. */
    // actionType: GET_CURRENT_USER_PLEDGING_AND_FOLLOWING,
    /* TODO after that: make these implications of shape easy to re-use in proptypes. */
    /* TODO after that: just define a resource shape and you get the plumbing for free. */
    include: [
        'pledges.creator.campaign.null',
        'follows.followed.campaign.null',
    ],
    fields: {
        user: ['image_url', 'full_name', 'url', 'social_connections'],
        campaign: ['creation_name', 'pay_per_name', 'is_monthly'],
        pledge: ['amount_cents', 'is_paused'],
        follow: [],
    },
}

const creatorProfilePhotos = {
    include: ['campaign.creator'],
    fields: {
        user: ['image_url'],
        campaign: ['image_url'],
    },
}

export const getCurrentUser = () => _getCurrentUser({})
export const getCurrentUserPledgingFollowing = () =>
    _getCurrentUser({ variant: pledgingAndFollowing })

export const getCurrentCreatorProfilePhotos = () =>
    _getCurrentUser({ variant: creatorProfilePhotos })

export const updateCurrentUser = userInfoFields => {
    const include = ['campaign.creator.null', 'locations.null']
    const fields = {
        campaign: ['published_at'],
        user: [
            'about',
            'email',
            'facebook',
            'facebook_id',
            'full_name',
            'image_url',
            'twitter',
            'url',
            'vanity',
            'youtube',
            'is_creator',
            'hide_pledges',
            'twitch',
        ],
    }

    const body = {
        data: {
            type: 'user',
            attributes: userInfoFields,
        },
    }

    logSettingsEvent({
        title: SETTINGS_PAGE_EVENTS.PATCH_PROFILE_BEGAN,
    })

    const action = apiRequestAction(
        PATCH_CURRENT_USER,
        jsonApiUrl(API_RESOURCE_PATH, { include, fields }),
        {
            body,
            headers: { 'Content-Type': 'application/json' },
        },
    )
    return action
}

export const currentUserError = () => {
    return {
        type: CURRENT_USER_ERROR,
    }
}

export const currentUserSuccess = response => {
    if (!response) {
        return currentUserError()
    }

    const payload = clientize(response.data)
    const included = response.included || []
    payload['follows'] = included
        .filter(data => data.type === 'follow')
        .map(clientize)
    payload['campaign'] = clientize(
        included.find(data => data.type === 'campaign'),
    )

    return {
        type: CURRENT_USER_SUCCESS,
        payload,
    }
}



// WEBPACK FOOTER //
// ./app/actions/current-user.js