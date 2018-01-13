import t from 'prop-types'
import React, { Component } from 'react'
import nion from 'nion'
import { withPreset } from 'libs/with-preset'
import { withProps, withState } from 'recompose'
import get from 'lodash/get'
import withRenderAsClient from 'libs/with-render-as-client'

import AdminPanel from 'modules/AdminPanel'
import Avatar from 'components/Avatar'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Logo from 'components/Logo'
import PseudoEffects from 'components/PseudoEffects'
import TextButton from 'components/TextButton'
import RenderHook from 'components/RenderHook'
import getDataOrNot from 'utilities/get-data-or-not'

import { NavbarIconWithCounter } from '../Icon'
import CategoriesPageMark from '../CategoriesPageMark'
import Fox from '../Fox'
import UserMenu from '../UserMenu'
import Search from '../Search'
import CreatorMenu from '../CreatorMenu'
import SubNavigation from '../SubNavigation'

import {
    HamburgerMenuWrapper,
    NavSection,
    NavWrapper,
    NavbarIconWrapper,
    TopNavBar,
    UserMenuWrapper,
} from './styled-components'

import { LogoSection, TextLinks } from '../sharedNavStyles'

import { getLoggedOutMenuItems } from '../../constants'
import { logHeaderNavEvent } from '../../events'
import { onAuthLinkClick } from '../../utils'
import { HEADER_EVENTS } from 'analytics/nav-and-footer'
import toProperCase from 'utilities/format-title-case'

@nion('currentUser')
@withPreset('navigation')
@withProps(props => ({
    isActiveCreator: !!get(
        getDataOrNot(props.nion.currentUser),
        'campaign.publishedAt',
        !!get(props.navigation, 'simulatedBootstrap.isActiveCreator'),
    ),
    avatarUrl: get(
        getDataOrNot(props.nion.currentUser),
        'thumbUrl',
        get(props.navigation, 'simulatedBootstrap.avatarUrl'),
    ),
    isLoggedIn: !!get(
        getDataOrNot(props.nion.currentUser),
        'id',
        !!get(props.navigation, 'simulatedBootstrap.isLoggedIn'),
    ),
}))
@withState('userMenuOpen', 'setUserMenuOpen', false)
@withState('creatorMenuOpen', 'setCreatorMenuOpen', false)
@withRenderAsClient
export default class Navbar extends Component {
    static propTypes = {
        avatarUrl: t.string,
        /** Hide parts of the nav for certain static pages **/
        hideSearch: t.bool,
        hideNavItems: t.bool,
        isActiveCreator: t.bool,
        isLoggedIn: t.bool,
        navigation: t.object,
        setUserMenuOpen: t.func,
        subNavigationLinks: t.array,
        userMenuOpen: t.bool,
        renderAsClient: t.bool,
    }

    renderIcon = ({ type, href, counter, onClick, onRender }) => {
        return (
            <RenderHook onRender={onRender} key={type}>
                <NavbarIconWrapper key={type}>
                    <a href={href} onClick={onClick}>
                        <NavbarIconWithCounter
                            type={type}
                            color="gray1"
                            hoverColor="gray4"
                            counter={counter}
                        />
                    </a>
                </NavbarIconWrapper>
            </RenderHook>
        )
    }

    renderMessagesIcon = () => {
        const { navigation } = this.props
        const onClick = () => logHeaderNavEvent(HEADER_EVENTS.CLICKED_MESSAGES)

        return this.renderIcon({
            type: 'messages',
            href: '/messages',
            counter: navigation.unreadMessagesCount,
            onClick,
        })
    }

    renderHomeIcon = () => {
        const onClick = () => logHeaderNavEvent(HEADER_EVENTS.CLICKED_HOME)
        return this.renderIcon({
            type: 'home',
            href: '/',
            onClick,
        })
    }

    renderLoggedOutLink = link => {
        const { key, href, event, title } = link
        const onClick = e => {
            e.preventDefault()
            logHeaderNavEvent(event, {
                location: 'header_nav',
            })
            onAuthLinkClick(href)
        }

        return (
            <TextButton
                key={key}
                href={href}
                onClick={onClick}
                color="dark"
                weight="bold"
                size={0}
            >
                {toProperCase(title)}
            </TextButton>
        )
    }

    renderLoggedOut = () => {
        const links = getLoggedOutMenuItems()

        return <TextLinks>{links.map(this.renderLoggedOutLink)}</TextLinks>
    }

    renderLoggedIn = () => {
        const {
            avatarUrl,
            isActiveCreator,
            setUserMenuOpen,
            userMenuOpen,
            renderAsClient,
        } = this.props
        return [
            this.renderHomeIcon(),
            !isActiveCreator && this.renderMessagesIcon(),
            <HamburgerMenuWrapper
                key="hamburger"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
                disabled={!renderAsClient}
            >
                {isActiveCreator ? (
                    this.renderIcon({ type: 'hamburger' })
                ) : (
                    <Block ml={1}>
                        <Avatar size="xs" src={avatarUrl} />
                    </Block>
                )}
                <UserMenuWrapper>
                    <UserMenu isOpen={userMenuOpen} />
                </UserMenuWrapper>
            </HamburgerMenuWrapper>,
        ]
    }

    render() {
        const {
            hideSearch,
            hideNavItems,
            isActiveCreator,
            isLoggedIn,
            navigation,
            subNavigationLinks,
        } = this.props

        const { isAdmin } = navigation
        const onClickLogo = () => logHeaderNavEvent(HEADER_EVENTS.CLICKED_LOGO)

        return (
            <NavWrapper>
                {isActiveCreator && !hideNavItems && <CreatorMenu />}
                {subNavigationLinks && (
                    <SubNavigation
                        isActiveCreator={isActiveCreator}
                        links={subNavigationLinks}
                    />
                )}
                <TopNavBar>
                    <Flexy alignItems="center">
                        <LogoSection href="/" onClick={onClickLogo}>
                            <PseudoEffects hoverProps={{ color: 'gray3' }}>
                                <Logo
                                    type="wordmark"
                                    color="gray1"
                                    width={12}
                                />
                            </PseudoEffects>
                        </LogoSection>
                        <CategoriesPageMark />
                    </Flexy>
                    <NavSection>
                        {!hideSearch && <Search isLoggedIn={isLoggedIn} />}
                        {isLoggedIn && !hideNavItems && this.renderLoggedIn()}
                        {!isLoggedIn && !hideNavItems && this.renderLoggedOut()}
                        {isAdmin &&
                            !hideNavItems && (
                                <Flexy alignItems="center">
                                    <Block ml={1}>
                                        <Fox
                                            onClick={() =>
                                                window.toggleAdminPanel()}
                                        />
                                    </Block>
                                </Flexy>
                            )}
                    </NavSection>
                </TopNavBar>
                {isAdmin && <AdminPanel />}
            </NavWrapper>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/Navbar/index.jsx