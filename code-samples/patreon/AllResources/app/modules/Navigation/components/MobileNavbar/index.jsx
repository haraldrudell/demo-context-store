import t from 'prop-types'
import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import nion from 'nion'
import { withPreset } from 'libs/with-preset'
import { withProps, withState } from 'recompose'
import get from 'lodash/get'
import { lockScroll, unlockScroll } from 'utilities/lock-scroll'
import withRenderAsClient from 'libs/with-render-as-client'

import Flexy from 'components/Layout/Flexy'
import Logo from 'components/Logo'
import PseudoEffects from 'components/PseudoEffects'
import TextButton from 'components/TextButton'
import getDataOrNot from 'utilities/get-data-or-not'

import CategoriesPageMark from '../CategoriesPageMark'
import NavbarIcon from '../Icon'
import MobileMenu from '../MobileMenu'

import { LogoSection } from '../sharedNavStyles'

require('./styles')

import { logHeaderNavEvent } from '../../events'
import { AUTH_ITEMS } from '../../constants'
import { onAuthLinkClick } from '../../utils'
import { HEADER_EVENTS } from 'analytics/nav-and-footer'

import {
    MobileNavigationWrapper,
    NavbarHamburger,
    NavbarWrapper,
    RightSection,
} from './styled-components'

import { TextLinks } from '../sharedNavStyles'

@nion('currentUser')
@withPreset('navigation')
@withProps(props => ({
    isCreator: !!get(
        getDataOrNot(props.nion.currentUser),
        'campaign',
        !!get(props.navigation, 'simulatedBootstrap.isActiveCreator'),
    ),
    isLoggedIn: !!get(
        getDataOrNot(props.nion.currentUser),
        'id',
        !!get(props.navigation, 'simulatedBootstrap.isLoggedIn'),
    ),
    unreadMessagesCount: props.navigation.unreadMessagesCount,
    unreadNotificationsCount: props.navigation.unreadNotificationsCount,
}))
@withState('isMenuOpen', 'setIsMenuOpen', false)
@withRenderAsClient
export default class MobileNavbar extends Component {
    static propTypes = {
        hideSearch: t.bool,
        hideNavItems: t.bool,
        isLoggedIn: t.bool,
        isMenuOpen: t.bool,
        setIsMenuOpen: t.func,
        renderAsClient: t.bool,
    }

    renderLoginLinks = () => {
        const textButtonProps = {
            color: 'dark',
            weight: 'bold',
            size: 0,
        }

        const onClickLogIn = e => {
            e.preventDefault()
            logHeaderNavEvent(HEADER_EVENTS.CLICKED_LOG_IN)
            onAuthLinkClick(AUTH_ITEMS.LOGIN.href)
        }

        return (
            <TextLinks>
                <TextButton
                    weight="normal"
                    href={AUTH_ITEMS.LOGIN.href}
                    onClick={onClickLogIn}
                    {...textButtonProps}
                >
                    Log In
                </TextButton>
            </TextLinks>
        )
    }

    render() {
        const {
            hideSearch,
            hideNavItems,
            isLoggedIn,
            isMenuOpen,
            setIsMenuOpen,
            renderAsClient,
        } = this.props

        const toggleMenuOpen = () => {
            if (isMenuOpen) {
                unlockScroll()
            } else {
                lockScroll()
            }
            setIsMenuOpen(!isMenuOpen)
        }

        const onClickLogo = () => logHeaderNavEvent(HEADER_EVENTS.CLICKED_LOGO)

        return (
            <MobileNavigationWrapper isMenuOpen={isMenuOpen}>
                <NavbarWrapper>
                    <Flexy alignItems="center">
                        <LogoSection href="/" ml={0} onClick={onClickLogo}>
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
                    {!hideNavItems && (
                        <RightSection>
                            {!isLoggedIn && this.renderLoginLinks()}
                            <NavbarHamburger
                                onClick={toggleMenuOpen}
                                disabled={!renderAsClient}
                            >
                                <NavbarIcon type="hamburger" />
                            </NavbarHamburger>
                        </RightSection>
                    )}
                </NavbarWrapper>
                <TransitionGroup>
                    {isMenuOpen && (
                        <CSSTransition
                            key="user-menu-transition-group-mobile"
                            classNames="mobileNavbar"
                            timeout={{ enter: 200, exit: 100 }}
                        >
                            <MobileMenu
                                hideSearch={hideSearch}
                                toggleMenuOpen={toggleMenuOpen}
                            />
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </MobileNavigationWrapper>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/MobileNavbar/index.jsx