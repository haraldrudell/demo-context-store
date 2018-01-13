import withRedirect from './with-redirect'

// TODO: a modal instead of a full redirect, then accept a callback to be executed upon modal dismissed
export default ({ postLoginRedirectURI }) =>
    (window.location.href = withRedirect('/login', postLoginRedirectURI))



// WEBPACK FOOTER //
// ./app/utilities/redirect-to-login.js