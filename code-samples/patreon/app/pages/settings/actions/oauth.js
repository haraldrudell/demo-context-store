import access from 'safe-access'
import fetch from 'isomorphic-fetch'

const oauthWindowConfig = [
    'width=555',
    'height=800',
    'left=125',
    'top=75',
    'menubar=no',
    'status=no',
    'titlebar=no',
    'toolbar=no',
    'location=no'
].join(',')

export const GET_OAUTH_SERVICE_URLS = 'GET_OAUTH_SERVICE_URLS'

export const getOauthServiceUrls = () => {
    return (dispatch) => {
        fetch('/auth/services.json')
        .then(res => res.json())
        .then(res => {
            dispatch({
                type: GET_OAUTH_SERVICE_URLS,
                payload: res
            })
        })
    }
}

export const beginDiscordOAuth = () =>
    (dispatch, getState) => {
        const url = access(getState(), 'config.discordConnectUrl')
        window.open(url, 'OAuthFlow', oauthWindowConfig)
        window.addEventListener('message', (e) => {
            if (e.data === 'oauthSuccess-discord') {
                window.location.reload()
            }
        }, false)
    }

export const beginTwitchOAuth = () =>
    (dispatch, getState) => {
        const url = access(getState(), `oauthServices.twitch.connect`)
        window.open(url, 'OAuthFlow', oauthWindowConfig)
    }



// WEBPACK FOOTER //
// ./app/pages/settings/actions/oauth.js