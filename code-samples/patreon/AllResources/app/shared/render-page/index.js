import 'react-hot-loader/patch'

import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import configureStore from 'shared/configure-store'
import { getThemePageColor } from 'styles/themes'
import { initializeSentry } from 'shared/logging/sentry'
import { isDevelopment, isDelta, isTest } from 'shared/environment'
import getWindow from 'utilities/get-window'
import initializeFixtureDevTool from 'utilities/test/fixture'

import ContentContainer from './components/ContentContainer'

const optionDefaults = {
    backgroundColor: getThemePageColor(),
    footer: {},
    navigation: {},
    reactTarget: 'reactTarget',
    subNavigationWidth: undefined,
    subNavigationLinks: undefined,
}

/**
 * options obj includes default overrides +
 *    backgroundColor<string>: the background color passed to ReactWrapper
 *    Content<ReactElement>: page content to be rendered
 *    eventsNamespace<string>: analytics events dict for component/page
 *    footer<obj>: if falsey, don't show footer. Else obj of Footer props
 *    navigation<obj>: if falsey, don't show navigation. Else obj of Navbar props`
 *    props<obj>: optional extra props to pass to the rendered Content
 *    store<obj>: result of a configureStore call with the proper reducers
 **/
const renderPage = (Content, options = {}) => {
    // initializes our error logging lib
    initializeSentry()

    // Add in a fixture debug method for more easily accessing bootstrapped data in development
    if (isDevelopment() || isDelta()) {
        initializeFixtureDevTool(getWindow())
    }

    const mergedOptions = {
        ...optionDefaults,
        ...options,
    }

    const { props, reactTarget, store } = mergedOptions

    const nextProps = {
        backgroundColor: mergedOptions.backgroundColor,
        eventsNamespace: mergedOptions.eventsNamespace,
        footer: mergedOptions.footer,
        isLegacyPage: mergedOptions.isLegacyPage,
        navigation: mergedOptions.navigation,
        subNavigationLinks: mergedOptions.subNavigationLinks,
        subNavigationWidth: mergedOptions.subNavigationWidth,
    }

    let toRender = (
        <AppContainer>
            <Provider store={store ? store : configureStore().store}>
                <ContentContainer {...nextProps}>
                    <Content {...props} />
                </ContentContainer>
            </Provider>
        </AppContainer>
    )
    if (options.stylesheet) {
        toRender = options.stylesheet.collectStyles(toRender)
    }

    if (options.renderToStaticMarkup) {
        return ReactDOMServer.renderToStaticMarkup(toRender)
    } else if (options.renderToString) {
        return ReactDOMServer.renderToString(toRender)
    } else if (isTest()) {
        return toRender
    } else {
        const node = document.getElementById(reactTarget)
        if (!node) {
            console.error(
                `Could not render react page. Did not find element in DOM with id "${reactTarget}"`,
            )
            return
        }

        if (module.hot) {
            module.hot.accept('./components/ContentContainer', () => {
                ReactDOM.render(toRender, node)
            })
        }

        ReactDOM.render(toRender, node)
        return toRender
    }
}

export default renderPage



// WEBPACK FOOTER //
// ./app/shared/render-page/index.js