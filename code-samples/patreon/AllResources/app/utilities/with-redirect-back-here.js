import withRedirect from './with-redirect'
import getWindow from 'utilities/get-window'

export default url => withRedirect(url, getWindow().location.pathname)



// WEBPACK FOOTER //
// ./app/utilities/with-redirect-back-here.js