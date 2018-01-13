import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'
import redirectToLogin from 'utilities/redirect-to-login'
import { getUserIsLoggedIn } from 'getters/current-user'
import { POLL_EVENTS, logPollEvent } from 'analytics'

export const POST_POLL_RESPONSE = 'POST_POLL_RESPONSE'

export const API_RESOURCE_PATH = '/polls'

export const postPollResponse = (pollId, choiceIds, feedName, isVoting, postId) => (
    (dispatch, getState) => {
        const state = getState()
        if (!getUserIsLoggedIn(state)) return redirectToLogin({postLoginRedirectURI: window.location.pathname})

        logPollEvent({
            title: POLL_EVENTS.VOTED,
            info: {
                'post_id': postId,
                'poll_id': pollId,
                'voted': isVoting,
                'source': feedName
            }
        })

        const pollResponses = choiceIds.map((id) => {
            return {
                type: 'poll_response',
                relationships: {
                    poll: {
                        data: {
                            type: 'poll',
                            id: pollId
                        }
                    },
                    choice: {
                        data: {
                            type: 'poll_choice',
                            id: id
                        }
                    }
                }
            }
        })
        const body = {
            data: pollResponses
        }

        return dispatch(apiRequestAction(POST_POLL_RESPONSE, jsonApiUrl(`${API_RESOURCE_PATH}/${pollId}/responses`), { body }))
    }
)

export const START_UNVOTING_ALL_RESPONSES = 'START_UNVOTING_ALL_RESPONSES'
export const FINISH_UNVOTING_ALL_RESPONSES = 'FINISH_UNVOTING_ALL_RESPONSES'

export const startUnvotingAllResponses = () => (
    (dispatch, getState) => {
        return dispatch({
            type: START_UNVOTING_ALL_RESPONSES,
            payload: null
        })
    }
)

export const finishUnvotingAllResponses = () => (
    (dispatch, getState) => {
        return dispatch({
            type: FINISH_UNVOTING_ALL_RESPONSES,
            payload: null
        })
    }
)



// WEBPACK FOOTER //
// ./app/actions/poll.js