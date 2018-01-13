import t from 'prop-types'
import React, { Component } from 'react'
import map from 'lodash/map'

import Badge from 'components/Badge'
import Block from 'components/Layout/Block'
import Text from 'components/Text'

import { MobileMenuLink } from '../MobileMenu/styled-components'
import { getAbsoluteUrl, makeSubNavOnClickHandler } from '../../utils'

export default class MobileSubNavigation extends Component {
    static propTypes = {
        isActiveCreator: t.bool,
        isOpen: t.bool,
        links: t.arrayOf(
            t.shape({
                name: t.string,
                url: t.string,
            }),
        ),
        // Passed in from the grandparent MobileNavbar
        toggleMenuOpen: t.func,
    }

    renderBadge = badge => {
        return (
            <Block ml={1} mt={-1}>
                <Badge target={<Block />}>
                    {badge}
                </Badge>
            </Block>
        )
    }

    render() {
        const { isActiveCreator, isOpen, links, toggleMenuOpen } = this.props

        if (!isOpen) {
            return null
        }

        const linksToRender = links.filter(link => {
            if (!isActiveCreator) {
                return !link.isCreatorOnly
            }
            return true
        })

        return (
            <Block>
                {map(linksToRender, link => {
                    const { badge } = link
                    const callback = () => toggleMenuOpen()
                    const onClick = makeSubNavOnClickHandler(link, callback)
                    const href = getAbsoluteUrl(link.url)

                    return (
                        <MobileMenuLink
                            key={link.url}
                            href={href}
                            onClick={onClick}
                        >
                            <Block pl={8}>
                                <Text size={1} weight="bold" uppercase>
                                    {link.name}
                                </Text>
                                {badge && this.renderBadge(badge)}
                            </Block>
                        </MobileMenuLink>
                    )
                })}
            </Block>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/MobileSubNavigation/index.jsx