import t from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import getWindow from 'utilities/get-window'
import get from 'lodash/get'
import map from 'lodash/map'
import some from 'lodash/some'

import Badge from 'components/Badge'
import Block from 'components/Layout/Block'
import SubNavigationLink from '../SubNavigationLink'

import { SubNavigationWrapper } from './styled-components'
import { getAbsoluteUrl, makeSubNavOnClickHandler } from '../../utils'

// We subscribe to state so that we are notified of `react-router-redux` changes,
// but we use `getWindow().location.pathname` in case our current page does not use `react-router-redux`
@connect(state => {
    return {
        currentPath: getWindow().location.pathname,
    }
})
class SubNavigation extends Component {
    static propTypes = {
        isActiveCreator: t.bool,
        links: t.arrayOf(
            t.shape({
                name: t.string,
                url: t.string,
            }),
        ),
        currentPath: t.string,
        width: t.number,
    }

    static defaultProps = {
        link: [],
    }

    renderBadge = badge => {
        return (
            <Block ml={1} mt={-1}>
                <Badge target={<Block />}>{badge}</Badge>
            </Block>
        )
    }

    isActiveLink = paths => {
        const { currentPath } = this.props
        let path = currentPath
        if (path.charAt(0) !== '/') {
            path = '/' + currentPath
        }
        return some(paths, p => p === path)
    }

    renderLinks = () => {
        const { isActiveCreator, links } = this.props

        const linksToRender = links.filter(link => {
            if (!isActiveCreator) {
                return !link.isCreatorOnly
            }
            return true
        })

        return map(linksToRender, link => {
            const { badge } = link
            const aliases = get(link, 'aliases', [])
            const selected = this.isActiveLink([link.url, ...aliases])

            const onClick = makeSubNavOnClickHandler(link)
            const href = getAbsoluteUrl(link.url)

            return (
                <SubNavigationLink
                    key={href}
                    selected={selected}
                    href={href}
                    onClick={onClick}
                >
                    {link.name}
                    {badge && this.renderBadge(badge)}
                </SubNavigationLink>
            )
        })
    }

    render() {
        const { isActiveCreator, width } = this.props
        return (
            <SubNavigationWrapper
                navWidth={width}
                isActiveCreator={isActiveCreator}
            >
                <Block>{this.renderLinks()}</Block>
            </SubNavigationWrapper>
        )
    }
}

export default SubNavigation



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/SubNavigation/index.jsx