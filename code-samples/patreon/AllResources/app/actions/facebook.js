import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'
import { SETTINGS_PAGE_EVENTS, logSettingsEvent } from 'analytics'

export const POST_CONNECT_FACEBOOK = 'POST_CONNECT_FACEBOOK'
export const POST_DISCONNECT_FACEBOOK = 'POST_DISCONNECT_FACEBOOK'

export function connectFacebook (data) {
    return (dispatch) => {
        const uri = '/user/connect-facebook'
        const body = {
            data: data
        }
        return dispatch(apiRequestAction(
            POST_CONNECT_FACEBOOK,
            jsonApiUrl(uri),
            { body, headers: {'Content-Type': 'application/json', 'Accept': 'application/json'} }
        ))
    }
}

export function disconnectFacebook () {
    return (dispatch) => {
        logSettingsEvent({
            title: SETTINGS_PAGE_EVENTS.UPDATE_FACEBOOK_CONNECT_BEGAN,
            info: {enable: false}
        })
        const uri = '/user/disconnect-facebook'
        return dispatch(apiRequestAction(
            POST_DISCONNECT_FACEBOOK,
            jsonApiUrl(uri)
        ))
    }
}

export const facebookAuth = () => {
    const FB = window.FB
    return new Promise((resolve, reject) => {
        if (!FB) {
            console.error('FB lib has not been initialized')
            return reject()
        }

        FB.getLoginStatus((statusResponse) => {
            if (statusResponse.status === 'connected') {
                return resolve(statusResponse.authResponse)
            }

            FB.login((loginResponse) => {
                if (loginResponse.authResponse) {
                    return resolve(loginResponse.authResponse)
                } else {
                    return reject()
                }
            })
        })
    })
}



// WEBPACK FOOTER //
// ./app/actions/facebook.js