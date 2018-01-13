import { GET_OAUTH_SERVICE_URLS } from 'pages/settings/actions/oauth'

export default (state = {}, action) =>
    action.type === GET_OAUTH_SERVICE_URLS ?
        action.payload
        : state



// WEBPACK FOOTER //
// ./app/reducers/oauth.js