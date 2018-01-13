// named client-render as we want this isolated for testing purposes,
// but naming it render.js would compile it into our ssr service,
// which this page is not yet ready for

import React from 'react'
import renderPage from 'shared/render-page'
import configureStore from 'shared/configure-store'
import { Router } from 'react-router'
import { makeRoutes } from './routes'

export default (options = {}) => {
    const { store, history } = configureStore(
        {},
        {
            router: { initialRoute: options.route },
        },
    )
    const routes = makeRoutes(store)
    const Auth = () => <Router history={history}>{routes}</Router>

    return renderPage(Auth, { store, ...options })
}



// WEBPACK FOOTER //
// ./app/pages/auth/client-render.js