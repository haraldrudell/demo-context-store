import t from 'prop-types'
import React, { Component } from 'react'
import nion from 'nion'
import { withPreset } from 'libs/with-preset'
import { withState } from 'recompose'
import debounce from 'lodash/debounce'

import Avatar from 'components/Avatar'
import RenderHook from 'components/RenderHook'
import getDataOrNot from 'utilities/get-data-or-not'

import NavbarIcon, { NavbarIconWithCounter } from '../Icon'
import CreatorMenuExpanded from '../CreatorMenuExpanded'
import { CreatorMenuWrapper, CreatorMenuIcon, Links } from './styled-components'

import { getSelectedPage } from '../../utils'
import { CREATOR_MENU_ITEMS } from '../../constants'
import { logCreatorNavEvent } from '../../events'

@nion('currentUser')
@withPreset('navigation')
@withState('isExpanded', 'setIsExpanded', false)
@withState('hoveredOver', 'setHoveredOver', null)
export default class CreatorMenu extends Component {
    static propTypes = {
        hoveredOver: t.string,
        isExpanded: t.bool,
        navigation: t.object,
        setIsExpanded: t.func,
        setHoveredOver: t.func,
    }

    _setIsExpanded = debounce(this.props.setIsExpanded, 10)
    _setHoveredOver = debounce(this.props.setHoveredOver, 10)

    onMouseEnterLink = key => {
        this._setHoveredOver(key)
    }

    onMouseLeaveLink = () => {
        this._setHoveredOver(null)
    }

    onMouseEnterWrapper = () => {
        this._setIsExpanded(true)
    }

    onMouseLeaveWrapper = () => {
        this._setIsExpanded(false)
    }

    renderLink = (link, selected) => {
        const { hoveredOver, navigation } = this.props
        const { event, renderEvent, href, key, iconType, counterKey } = link
        const counter = navigation[counterKey]
        const navbarProps = {
            color: 'white',
            type: iconType,
        }

        let Content
        if (link.key === 'CREATOR') {
            Content = this.renderAvatar()
        } else if (link.counterKey && counter) {
            Content = (
                <NavbarIconWithCounter counter={counter} {...navbarProps} />
            )
        } else {
            Content = <NavbarIcon {...navbarProps} />
        }

        let onClick = () => logCreatorNavEvent(event)
        let onRender = () => {
            if (renderEvent) {
                logCreatorNavEvent(renderEvent)
            }
        }

        return (
            <RenderHook onRender={onRender} key={key}>
                <CreatorMenuIcon
                    selected={selected}
                    hover={hoveredOver === key}
                    href={href}
                    key={href}
                    onClick={onClick}
                    onMouseEnter={() => this.onMouseEnterLink(key)}
                    onMouseLeave={() => this.onMouseLeaveLink()}
                >
                    {Content}
                </CreatorMenuIcon>
            </RenderHook>
        )
    }

    renderAvatar = () => {
        const { currentUser } = this.props.nion
        const { thumbUrl } = getDataOrNot(currentUser)

        return <Avatar src={thumbUrl} size="xs" />
    }

    getCreatorMenuItems = () => {
        return CREATOR_MENU_ITEMS
    }

    render() {
        const { hoveredOver, isExpanded } = this.props

        const { currentUser } = this.props.nion
        const { url, vanity } = getDataOrNot(currentUser)

        const links = this.getCreatorMenuItems()

        // Use this rather ad-hoc way of detecting which creator menu subpage we're on, in order to
        // highlight the correct page
        const selectedIndex = getSelectedPage(links, url, vanity)

        return (
            <CreatorMenuWrapper
                onMouseLeave={() => this.onMouseLeaveWrapper()}
                onMouseEnter={() => this.onMouseEnterWrapper()}
            >
                <Links>
                    {links.map((link, index) => {
                        const selected = selectedIndex === index
                        return this.renderLink(link, selected)
                    })}
                </Links>
                <CreatorMenuExpanded
                    selectedIndex={selectedIndex}
                    creatorName={currentUser.fullName}
                    hoveredOver={hoveredOver}
                    setHoveredOver={this._setHoveredOver}
                    isExpanded={isExpanded}
                />
            </CreatorMenuWrapper>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/CreatorMenu/index.jsx