import { routerReducer, routerMiddleware } from 'react-router-redux'

export default history => {
    return {
        middleware: [routerMiddleware(history)],
        reducer: routerReducer,
    }
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-routing.js