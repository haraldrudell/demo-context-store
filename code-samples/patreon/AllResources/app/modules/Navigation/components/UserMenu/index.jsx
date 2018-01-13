import t from 'prop-types'
import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { withProps } from 'recompose'
import get from 'lodash/get'
import nion from 'nion'

import getDataOrNot from 'utilities/get-data-or-not'

import Text from 'components/Text'

import { UserMenuWrapper, UserMenuLink } from './styled-components'
require('./styles')

import { USER_MENU_ITEMS, getBecomeCreatorItems } from '../../constants'
import { logHeaderNavEvent } from '../../events'

@nion('currentUser')
@withProps(props => ({
    isActiveCreator: !!get(
        getDataOrNot(props.nion.currentUser),
        'campaign.publishedAt',
    ),
    isCreator: !!get(getDataOrNot(props.nion.currentUser), 'campaign'),
}))
export default class UserMenu extends Component {
    static propTypes = {
        isOpen: t.bool,
        // Provided by @withProps decorator
        isActiveCreator: t.bool,
        // Provided by @withProps decorator
        isCreator: t.bool,
    }

    renderCreatorLink = () => {
        const { isActiveCreator, isCreator } = this.props

        if (isCreator && !isActiveCreator) {
            return this.renderLink(getBecomeCreatorItems().FINISH)
        } else if (!isCreator) {
            return this.renderLink(getBecomeCreatorItems().CREATE_ON_PATREON)
        }

        return null
    }

    getLinks = () => {
        return USER_MENU_ITEMS.filter(item => !item.mobileOnly)
    }

    renderLink = link => {
        const { href, event, title, color, creatorOnly, patronOnly } = link
        const { isActiveCreator } = this.props

        if (
            (!isActiveCreator && creatorOnly) ||
            (isActiveCreator && patronOnly)
        ) {
            return null
        }

        const onClick = () =>
            logHeaderNavEvent(event, {
                location: 'user_menu',
            })

        return (
            <UserMenuLink href={href} key={href} onClick={onClick}>
                <Text el="span" size={0} weight="bold" color={color || 'gray1'}>
                    {title}
                </Text>
            </UserMenuLink>
        )
    }

    render() {
        const { isOpen } = this.props

        const links = this.getLinks()

        return (
            <TransitionGroup>
                <CSSTransition
                    key="user-menu-transition-group"
                    classNames="userMenu"
                    timeout={{ enter: 70, exit: 70 }}
                >
                    <div>
                        {isOpen && (
                            <UserMenuWrapper>
                                {this.renderCreatorLink()}
                                {links.map(this.renderLink)}
                            </UserMenuWrapper>
                        )}
                    </div>
                </CSSTransition>
            </TransitionGroup>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/UserMenu/index.jsx