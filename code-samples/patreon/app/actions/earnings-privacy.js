import clientize from 'utilities/clientize'
import jsonApiUrl from 'utilities/json-api-url'
import apiRequestAction from 'actions/api-request-action'
import { CREATOR_PAGE_EVENTS, logCreatorPageEvent } from 'analytics'

export const PUBLIC_EARNINGS_OPTIONS_SUCCESS = 'PUBLIC_EARNINGS_OPTIONS_SUCCESS'
export const PUBLIC_EARNINGS_OPTIONS_ERROR = 'PUBLIC_EARNINGS_OPTIONS_ERROR'

export const SET_EARNINGS_PRIVACY_START = 'SET_EARNINGS_PRIVACY_START'
export const SET_EARNINGS_PRIVACY_SUCCESS = 'SET_EARNINGS_PRIVACY_SUCCESS'
export const SET_EARNINGS_VISIBILITY_ERROR = 'SET_EARNINGS_VISIBILITY_ERROR'

export const POST_EARNINGS_PRIVACY = 'POST_EARNINGS_PRIVACY'

export const publicEarningsOptionsError = () => {
    return {
        type: PUBLIC_EARNINGS_OPTIONS_ERROR
    }
}

export const publicEarningsOptionsSuccess = (response) => {
    if (!response) {
        return publicEarningsOptionsError()
    }

    const clientizedResponse = clientize(response)
    return {
        type: PUBLIC_EARNINGS_OPTIONS_SUCCESS,
        payload: {
            earningsOptions: {
                ...clientizedResponse
            }
        }
    }
}

export const setEarningsPrivacyV2 = (campaignId, earningsStatus) => {
    const attributes = {
        earnings_visibility: earningsStatus
    }

    const body = {
        data: {
            type: 'campaign',
            attributes
        }
    }

    return (dispatch) => {

        logCreatorPageEvent({
            title: CREATOR_PAGE_EVENTS.EARNINGS_VISIBILITY_SUBMITTED,
            info: {
                campaignId,
                earningsStatus
            }
        })

        return dispatch(
            apiRequestAction(`${POST_EARNINGS_PRIVACY}__${campaignId}`,
            jsonApiUrl(`/campaigns/${campaignId}/earnings-visibility`),
            { body })
        )
    }
}



// WEBPACK FOOTER //
// ./app/actions/earnings-privacy.js