import React from 'react'
import { Route } from 'react-router'

import App from './components/App'
import Auth from 'features/Auth'

export const makeRoutes = store => {
    return (
        <Route path="/" component={App}>
            <Route path="login" key="login" component={Auth} />
            <Route path="signup" key="signup" component={Auth} />
            <Route
                path="auth/verify-device"
                key="device-verification"
                component={Auth}
            />
        </Route>
    )
}



// WEBPACK FOOTER //
// ./app/pages/auth/routes.jsx