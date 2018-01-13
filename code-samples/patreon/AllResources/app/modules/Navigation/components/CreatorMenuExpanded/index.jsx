import t from 'prop-types'
import React, { Component } from 'react'

import Text from 'components/Text'

import {
    CreatorMenuExpandedWrapper,
    CreatorMenuLink,
    Links,
} from './styled-components'

import { CREATOR_MENU_ITEMS } from '../../constants'

import { logCreatorNavEvent } from '../../events'

export default class CreatorMenuExpanded extends Component {
    static propTypes = {
        creatorName: t.string,
        hoveredOver: t.string,
        isExpanded: t.bool,
        selectedIndex: t.number,
        setHoveredOver: t.func,
    }

    onMouseEnter = key => {
        const { setHoveredOver } = this.props
        setHoveredOver(key)
    }

    onMouseLeaveLink = () => {
        const { setHoveredOver } = this.props
        setHoveredOver(null)
    }

    renderLink = (link, index) => {
        const { href, event, key } = link
        let { title } = link
        const { creatorName, hoveredOver, selectedIndex } = this.props

        if (key === 'CREATOR' && creatorName) {
            title = creatorName.toUpperCase()
        }

        const selected = index === selectedIndex
        const onClick = () => logCreatorNavEvent(event)

        return (
            <CreatorMenuLink
                selected={selected}
                hover={hoveredOver === key}
                href={href}
                key={href}
                onClick={onClick}
                onMouseEnter={() => this.onMouseEnter(key)}
                onMouseLeave={() => this.onMouseLeaveLink()}
            >
                <Text color="light" size={1} weight="bold" ellipsis>
                    {title}
                </Text>
            </CreatorMenuLink>
        )
    }

    render() {
        const links = CREATOR_MENU_ITEMS.map(this.renderLink)
        return (
            <CreatorMenuExpandedWrapper isExpanded={this.props.isExpanded}>
                <Links>{links}</Links>
            </CreatorMenuExpandedWrapper>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/CreatorMenuExpanded/index.jsx