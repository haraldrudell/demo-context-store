import t from 'prop-types'
import React, { Component } from 'react'
import nion from 'nion'
import { withPreset } from 'libs/with-preset'
import { withProps } from 'recompose'
import get from 'lodash/get'

import Avatar from 'components/Avatar'
import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import Text from 'components/Text'
import getDataOrNot from 'utilities/get-data-or-not'

import MobileSearch from '../MobileSearch'
import MobileSubNavigation from '../MobileSubNavigation'
import NavbarIcon, { NavbarIconWithCounter } from '../Icon'

import { logCreatorNavEvent, logHeaderNavEvent } from '../../events'
import { onAuthLinkClick } from '../../utils'

import {
    CREATOR_MENU_ITEMS,
    USER_MENU_ITEMS,
    AUTH_ITEMS,
    getBecomeCreatorItems,
    getLoggedOutMenuItems,
} from '../../constants'

import {
    MobileMenuWrapper,
    MobileMenuLink,
    MobileMenuList,
} from './styled-components'

@nion('currentUser')
@withPreset('navigation')
@withProps(props => ({
    creatorName: get(getDataOrNot(props.nion.currentUser), 'fullName'),
    isActiveCreator: !!get(
        getDataOrNot(props.nion.currentUser),
        'campaign.publishedAt',
    ),
    isCreator: !!get(getDataOrNot(props.nion.currentUser), 'campaign'),
    isLoggedIn: !!get(getDataOrNot(props.nion.currentUser), 'id'),
    unreadMessagesCount: props.navigation.unreadMessagesCount,
    unreadNotificationsCount: props.navigation.unreadNotificationsCount,
}))
export default class MobileMenu extends Component {
    static propTypes = {
        creatorName: t.string,
        hideSearch: t.bool,
        isActiveCreator: t.bool,
        isCreator: t.bool,
        isLoggedIn: t.bool,
        navigation: t.object,
        // Passed in from the parent MobileNavbar
        toggleMenuOpen: t.func,
    }

    state = {}

    renderAvatar = () => {
        const { currentUser } = this.props.nion
        const { thumbUrl } = getDataOrNot(currentUser)

        return <Avatar src={thumbUrl} size="xs" />
    }

    renderLinkText = link => {
        const { color, key, title } = link
        const { creatorName } = this.props
        const linkText =
            link.key === 'CREATOR' ? creatorName.toUpperCase() : title

        return (
            <Text
                key={key}
                color={color || 'gray1'}
                size={1}
                weight="bold"
                ellipsis
            >
                {linkText}
            </Text>
        )
    }

    renderCreatorMenuIcon = link => {
        const { navigation } = this.props
        const { iconType, counterKey } = link
        const counter = navigation[counterKey]

        const navbarProps = {
            color: 'navy',
            width: 4,
            type: iconType,
        }

        let CreatorMenuIcon
        if (link.key === 'CREATOR') {
            CreatorMenuIcon = this.renderAvatar()
        } else if (link.counterKey && counter) {
            CreatorMenuIcon = (
                <NavbarIconWithCounter counter={counter} {...navbarProps} />
            )
        } else {
            CreatorMenuIcon = <NavbarIcon {...navbarProps} />
        }

        return CreatorMenuIcon
    }

    getIsOpenKey = ({ key }) => `${key}_subNavIsOpen`

    makeSubNavClickHandler = link => () => {
        const isOpenKey = this.getIsOpenKey(link)
        const isOpen = this.state[isOpenKey]

        this.setState({ [isOpenKey]: !isOpen })
    }

    getClickHandler = (link, isCreatorLink) => {
        const { event, subNavigationLinks } = link
        const isAuthLink = [
            get(AUTH_ITEMS, 'SIGNUP.key'),
            get(AUTH_ITEMS, 'LOGIN.key'),
        ].includes(link.key)

        const loggingFn = isCreatorLink ? logCreatorNavEvent : logHeaderNavEvent
        const clickHandler = () =>
            loggingFn(event, {
                location: 'dropdown',
            })
        const authLinkClickHandler = e => {
            e.preventDefault()
            clickHandler()
            onAuthLinkClick(link.href)
        }

        // We need to disable the generic click handler for menu items with subnavigationLinks, and
        // wire it up to the open / close logic of the subnavigation menu
        if (subNavigationLinks) {
            return this.makeSubNavClickHandler(link)
        } else if (isAuthLink) {
            return authLinkClickHandler
        } else {
            return clickHandler
        }
    }

    renderSubNavigation = link => {
        const { subNavigationLinks } = link
        const { isActiveCreator, toggleMenuOpen } = this.props

        const isOpenKey = this.getIsOpenKey(link)
        const isOpen = this.state[isOpenKey]

        return (
            <MobileSubNavigation
                isActiveCreator={isActiveCreator}
                toggleMenuOpen={toggleMenuOpen}
                isOpen={isOpen}
                links={subNavigationLinks}
            />
        )
    }

    renderLink = ({ link, isCreatorLink }) => {
        const { key, subNavigationLinks } = link

        // We don't want to add an href to the links that contain subnavigationLinks => we just want
        // to open/close the submenu
        const href = subNavigationLinks ? null : link.href

        const clickHandler = this.getClickHandler(link, isCreatorLink)

        // We need to determine the correct pl for creator menu link vs general
        const titlePadding = isCreatorLink ? 2 : 6

        const isOpenKey = this.getIsOpenKey(link)

        return (
            <Block key={key}>
                <MobileMenuLink href={href} key={href} onClick={clickHandler}>
                    <Flexy alignItems="center" justifyContent="flex-start">
                        {isCreatorLink && this.renderCreatorMenuIcon(link)}
                        <Block pl={titlePadding}>
                            {this.renderLinkText(link)}
                        </Block>
                    </Flexy>
                    <Flexy alignItems="center">
                        {subNavigationLinks && (
                            <Block mr={1}>
                                <Icon
                                    type={
                                        this.state[isOpenKey]
                                            ? 'caretUp'
                                            : 'caretDown'
                                    }
                                />
                            </Block>
                        )}
                    </Flexy>
                </MobileMenuLink>
                {subNavigationLinks && this.renderSubNavigation(link)}
            </Block>
        )
    }

    renderCreatorLink = () => {
        const { isActiveCreator, isCreator } = this.props

        if (isCreator && !isActiveCreator) {
            return this.renderLink({ link: getBecomeCreatorItems().FINISH })
        }

        return null
    }

    render() {
        const { hideSearch, isActiveCreator, isLoggedIn } = this.props

        const mobileMenuFilter = item => {
            if (item.noMobile) {
                return false
            } else if (isActiveCreator && item.patronOnly) {
                return false
            } else if (!isActiveCreator && item.creatorOnly) {
                return false
            }
            return true
        }

        const loggedOutLinks = getLoggedOutMenuItems().filter(mobileMenuFilter)
        const userLinks = USER_MENU_ITEMS.filter(mobileMenuFilter)
        const creatorLinks = CREATOR_MENU_ITEMS.filter(mobileMenuFilter)

        return (
            <MobileMenuWrapper>
                {!hideSearch && <MobileSearch />}
                <MobileMenuList>
                    {this.renderCreatorLink()}
                    {isActiveCreator &&
                        creatorLinks.map(link =>
                            this.renderLink({ link, isCreatorLink: true }),
                        )}
                    {isLoggedIn &&
                        userLinks.map(link => this.renderLink({ link }))}
                    {!isLoggedIn &&
                        loggedOutLinks.map(link => this.renderLink({ link }))}
                </MobileMenuList>
            </MobileMenuWrapper>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/MobileMenu/index.jsx