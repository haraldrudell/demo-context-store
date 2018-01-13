import t from 'prop-types'
import React, { Component } from 'react'
import ReactWrapper from 'components/ReactWrapper'
import styled, { css } from 'styled-components'

import withRenderAsClient from 'libs/with-render-as-client'

import Navigation from 'modules/Navigation'

import BannerManager from 'features/BannerManager'

import FooterWrapper from '../FooterWrapper'
import NavigationOffsetLeft from '../NavigationOffsetLeft'

import { logLandedEvent } from 'shared/events/generic-logging'

@withRenderAsClient
export default class ContentContainer extends Component {
    static propTypes = {
        backgroundColor: t.string,
        children: t.node.isRequired,
        eventsNamespace: t.shape({
            DOMAIN: t.string,
            LANDED: t.string,
        }),
        // See Footer props
        footer: t.object,
        isLegacyPage: t.bool,
        // See Navbar props
        navigation: t.object,
        subNavigationLinks: t.array,
        subNavigationWidth: t.number,
        // Provided by @withRenderAsClient
        renderAsClient: t.bool.isRequired,
    }

    componentDidMount() {
        const { eventsNamespace, navigation } = this.props
        // Any page that loads Angular (e.g. pages w/ angular navbar),
        // loads Angular code that automatically calls page load events (Load: <DOMAIN>).
        // In an effort to not be overly redundant, only log LANDED events on React
        // pages using the React navbar
        if (eventsNamespace && navigation) {
            logLandedEvent(eventsNamespace)
        }

        this.handleLegacyLayout()
    }

    componentDidUpdate() {
        this.handleLegacyLayout()
    }

    // An EXTREMELY hacky way of dealing with legacy page creator menu offsets. We're wrapping all
    // rendered legacy page content in a div with id legacyContent, which we'll imperatively give a
    // left margin the size of the creator menu, depending on whether or not we're displaying the
    // creator menu
    handleLegacyLayout() {
        const { isLegacyPage } = this.props

        if (isLegacyPage) {
            const legacyContent = document.querySelector('#legacyContent')
            const pageWrapper = document.querySelector(
                '#renderPageContentWrapper',
            )

            const isWrapped =
                legacyContent && legacyContent.parentElement === pageWrapper

            if (legacyContent && pageWrapper && !isWrapped) {
                pageWrapper.appendChild(legacyContent)
            }
        }
    }

    renderContent = () => {
        const {
            backgroundColor,
            children,
            footer,
            isLegacyPage,
            navigation,
            renderAsClient,
            subNavigationLinks,
            subNavigationWidth,
        } = this.props
        return (
            <NavigationOffsetLeft
                hasNavigation={navigation && !navigation.hideNavItems}
                hasSubNavigation={
                    subNavigationLinks && !navigation.hideNavItems
                }
                subNavigationWidth={subNavigationWidth}
                isLegacyPage={isLegacyPage}
            >
                {/*
                    renderAsClient safeguard needed because Alert uses LESS still
                    @TODO Kill LESS in <Alert />
                  */}
                {renderAsClient && <BannerManager />}
                <ContentWrapper
                    hasFooter={!!footer}
                    id="renderPageContentWrapper"
                    isLegacyPage={isLegacyPage}
                    backgroundColor={backgroundColor}
                >
                    {children}
                </ContentWrapper>
            </NavigationOffsetLeft>
        )
    }

    renderNavigation = () => {
        const {
            subNavigationLinks,
            subNavigationWidth,
            navigation,
        } = this.props
        return (
            <Navigation
                subNavigationWidth={subNavigationWidth}
                subNavigationLinks={subNavigationLinks}
                navbarProps={navigation}
            />
        )
    }

    render() {
        const {
            backgroundColor,
            footer,
            navigation,
            subNavigationLinks,
            subNavigationWidth,
        } = this.props

        return (
            <ReactWrapper pageBackgroundColor={backgroundColor}>
                {navigation && this.renderNavigation()}
                {this.renderContent()}
                {footer && (
                    <FooterWrapper
                        hasNavigation={navigation && !navigation.hideNavItems}
                        hasSubNavigation={
                            subNavigationLinks && !navigation.hideNavItems
                        }
                        subNavigationWidth={subNavigationWidth}
                        footerProps={footer}
                    />
                )}
            </ReactWrapper>
        )
    }
}

/*
    max-width: 100%;
    overflow-x: hidden;
*/
const legacy = css`
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            {
                xs: `${props.theme.units.getValues([2, 0])}`,
                sm: `${props.theme.units.getValues([4, 4])}`,
            },
            'padding',
        )};
    box-sizing: border-box;
`

const ContentWrapper = styled.div`
    background-color: ${props =>
        props.backgroundColor
            ? props.backgroundColor
            : props.theme.colors.pageBackground};
    width: 100%;
    ${props => props.isLegacyPage && legacy};
    min-height: ${props => (props.hasFooter ? '60vh' : '100vh')};
`



// WEBPACK FOOTER //
// ./app/shared/render-page/components/ContentContainer/index.jsx