import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom' //eslint-disable-line camelcase
import get from 'lodash/get'
import map from 'lodash/map'
import { batchedSubscribe } from 'redux-batched-subscribe'
import optimist from 'redux-optimist'
import thunkMiddleware from 'redux-thunk'
import { apiMiddleware } from 'redux-api-middleware'
import { syncHistoryWithStore } from 'react-router-redux'
import isPlainObject from 'is-plain-object'
import getWindow from 'utilities/get-window'
import getHistory from 'utilities/history'
import { isDevelopment, isClient } from 'shared/environment'

import csrfTicketMiddleware from 'shared/middleware/csrf-ticket'
import configureFeatureFlags from './configure-feature-flags'
import configureExperiments from './configure-experiments'
import configurePresets from './configure-presets'
import configureJsonApi from './configure-json-api'
import configureSocketIO from './configure-socket-io'
import configureRenderAsClient from './configure-render-as-client'

import { configureNion, bootstrapNion, initializeNionDevTool } from 'nion'
import {
    jsonApiModule,
    genericPatreonApiModule,
    apiModule,
} from 'libs/nion-modules'

import { reducers as reformReducers } from 'libs/reform'
import { reducers as mallardReducers } from 'libs/mallard'

import configureRouting from './configure-routing'
import configureResponsive, {
    bindResponsiveHandlers,
} from './configure-responsive'

const defaultOptions = {
    router: true,
    responsive: false,
    data: true,
    optimistic: false,
    nion: true,
    socketio: false,
    renderAsClient: true,
    reform: true,
    mallard: true,
    logger: true,
}

export const baseMiddleware = [
    csrfTicketMiddleware,
    thunkMiddleware,
    apiMiddleware,
]

export default function configureStore(
    reducers = {},
    options = {},
    extraMiddleware = null,
    initialState = {},
) {
    const getOption = option => {
        const defaultOption = get(defaultOptions, option)
        return get(options, option, defaultOption)
    }

    const router = getOption('router')
    const responsive = getOption('responsive')
    const data = getOption('data')
    const optimistic = getOption('optimistic')
    const nion = getOption('nion')
    const socketio = getOption('socketio')
    const renderAsClient = getOption('renderAsClient')
    const reform = getOption('reform')
    const mallard = getOption('mallard')
    const logger = getOption('logger')

    if (!isPlainObject(reducers)) {
        console.error(
            'reducers passed to configureStore must be a plain object.',
        )
    }

    let middleware = [...baseMiddleware]

    const windowOrFixture = getWindow()
    const featureFlags = configureFeatureFlags(windowOrFixture)
    const experiments = configureExperiments(windowOrFixture)
    const presets = configurePresets(windowOrFixture)

    reducers = {
        ...reducers,
        featureFlags: featureFlags.reducer,
        experiments: experiments.reducer,
        presets: presets.reducer,
    }
    initialState = {
        ...initialState,
        featureFlags: featureFlags.initialState,
        experiments: experiments.initialState,
        presets: presets.initialState,
    }

    if (socketio) {
        if (typeof socketio === 'object' && typeof socketio.host === 'string') {
            const socketIOConfig = configureSocketIO(socketio.host)
            middleware = [...middleware, ...socketIOConfig.middleware]
        } else {
            console.error(
                "option 'socketio' must be provided with a host field: configureStore(reducers, {..., socketio: {host: 'https://www.example.com'}})",
            )
        }
    }

    if (data) {
        const jsonApiConfig = configureJsonApi()
        middleware = [...middleware, ...jsonApiConfig.middleware]
        reducers = { ...reducers, data: jsonApiConfig.reducer }
    }

    let bindRouterReplays
    let history
    if (router) {
        const initialRoute = get(router, 'initialRoute', undefined)
        history = getHistory(initialRoute)
        const routingConfig = configureRouting(history)
        bindRouterReplays = routingConfig.bindRouterReplays
        middleware = [...middleware, ...routingConfig.middleware]

        /**
         * When using combineReducer this must be
         * stored under `routing` https://github.com/reactjs/react-router-redux#routerreducer
         */
        reducers = { ...reducers, routing: routingConfig.reducer }
    }

    if (responsive) {
        if (isDevelopment() && !isClient()) {
            console.warn(
                'redux-responsive is being used via configure-store.' +
                    '\nSee https://paper.dropbox.com/doc/How-to-Make-a-Page-Server-Side-Render-able-P6Cxd2NxpgR0twckh7r9T#:uid=855726538454661342669251 for more',
            )
        }
        const responsiveConfig = configureResponsive()
        reducers = { ...reducers, browser: responsiveConfig.reducer }
    }

    if (renderAsClient) {
        const renderAsClientConfig = configureRenderAsClient()
        reducers = {
            ...reducers,
            renderAsClient: renderAsClientConfig.reducer,
        }
    }

    if (nion) {
        const flattenSelectedData = get(nion, 'flattenSelectedData', true)
        if (flattenSelectedData) {
            console.warn(
                'Flat data inside nion is deprecated. Please migrate to flattenSelectedData=false before it is too late!',
            )
        }
        // Configure nion with the API modules we need to run our app
        const nionConfig = configureNion({
            apiModules: {
                api: apiModule,
                jsonApi: jsonApiModule,
                genericPatreonApi: genericPatreonApiModule,
            },
            defaultApi: 'jsonApi',
            // TODO: now that nion internally (and by default) maintains selected data on a `data`
            // attribute, we should try to update our application's use of selected data to use
            // this new API rather than the old, legacy splatted out system that this option allows
            // const { name } = this.props.nion.currentUser vs
            // const { name } = this.props.nion.currentUser.data
            flattenSelectedData,
        })
        reducers = { ...reducers, nion: nionConfig.reducer }
    }

    if (reform) {
        reducers = { ...reducers, reform: reformReducers }
    }

    if (mallard) {
        reducers = { ...reducers, mallard: mallardReducers }
    }

    if (extraMiddleware) middleware = [...middleware, ...extraMiddleware]

    // Determine redux logging / devTools configuration
    const shouldLog = !!process.env.DEVELOPMENT_DEBUG
    const shouldUseDevTools = shouldLog && !!windowOrFixture.devToolsExtension

    if (shouldLog) {
        const configureLogger = require('./configure-logger').default
        const diff = get(logger, 'diff', true)
        const loggerMiddleware = configureLogger({ diff }).middleware
        middleware = [...middleware, ...loggerMiddleware]
    }

    // enhance createStore
    const finalCreateStore = compose(
        applyMiddleware(...middleware),
        shouldUseDevTools ? windowOrFixture.devToolsExtension() : f => f,
        batchedSubscribe(batchedUpdates),
    )(createStore)

    // Set up a function that allows adding reducers later (asyncReducers)
    const createCombinedReducers = asyncReducers => {
        let result = combineReducers({
            ...reducers,
            ...asyncReducers,
        })
        if (optimistic) result = optimist(result)
        return result
    }
    const combinedReducers = createCombinedReducers()

    const store = finalCreateStore(combinedReducers, initialState)

    if (router && history) {
        syncHistoryWithStore(history, store)
    }

    // "Required for replaying actions from devtools to work" -docs
    if (router && bindRouterReplays && process.env.NODE_ENV === 'production') {
        bindRouterReplays(store)
    }

    if (responsive) {
        bindResponsiveHandlers(store)
    }

    // Add in a nion debug method for more easily accessing nion state in development
    if (nion && process.env.DEVELOPMENT_DEBUG) {
        initializeNionDevTool(store)
    }

    // Finally, handle bootstrapping into the nion store if present
    if (nion) {
        const bootstrapObj = get(windowOrFixture, 'patreon.bootstrap', {})
        // We need to split the bootstrapped data into JSON-API-compliant data and generic data in
        // order to bootstrap it with the appropriate parse in nion

        const apiBootstrapObj = {}
        const jsonApiBootstrapObj = {}
        map(bootstrapObj, (bootstrapData, key) => {
            // eslint-disable-line no-shadow
            if (jsonApiModule.isJsonApi(bootstrapData)) {
                jsonApiBootstrapObj[key] = bootstrapData
            } else {
                apiBootstrapObj[key] = bootstrapData
            }
        })

        bootstrapNion(store, apiBootstrapObj, 'api')
        bootstrapNion(store, jsonApiBootstrapObj, 'jsonApi')
    }

    // And set up module reducer system
    store.moduleReducers = {}

    store.addModuleReducer = (name, reducer) => {
        store.moduleReducers[name] = reducer
        store.replaceReducer(
            createCombinedReducers({
                modules: combineReducers(store.moduleReducers),
            }),
        )
    }

    return { store, history }
}

/**
 * Selectors for default reducers provided by using `shared/configure-store`.
 * Keep these selectors close to where we define the state shape, and they should
 * be composed of selectors that are aware of actual state shape for the given reducer.
 */
export const selectFeatureFlags = state => {
    return state.featureFlags
}

export const selectExperiments = state => {
    return state.experiments
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/index.js