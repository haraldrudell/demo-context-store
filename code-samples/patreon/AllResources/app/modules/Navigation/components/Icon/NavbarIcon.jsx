import t from 'prop-types'
import React, { Component } from 'react'
import get from 'lodash/get'

import Block from 'components/Layout/Block'
import PseudoEffects from 'components/PseudoEffects'
import SvgImage from 'components/SvgImage'

import AirplaneSVG from './svgs/AirplaneSVG'
import BellSVG from './svgs/BellSVG'
import GearSVG from './svgs/GearSVG'
import GraphSVG from './svgs/GraphSVG'
import HamburgerSVG from './svgs/HamburgerSVG'
import HomeSVG from './svgs/HomeSVG'
import MessagesSVG from './svgs/MessagesSVG'
import PayoutsSVG from './svgs/PayoutsSVG'
import PostSVG from './svgs/PostSVG'
import SearchSVG from './svgs/SearchSVG'
import UsersSVG from './svgs/UsersSVG'

const iconSVGs = {
    analytics: GraphSVG,
    gear: GearSVG,
    hamburger: HamburgerSVG,
    home: HomeSVG,
    invite: AirplaneSVG,
    messages: MessagesSVG,
    notifications: BellSVG,
    patrons: UsersSVG,
    payouts: PayoutsSVG,
    post: PostSVG,
    search: SearchSVG,
}

export default class NavbarIcon extends Component {
    static propTypes = {
        children: t.node,
        color: t.oneOf(['highlightPrimary', 'gray1', 'white']),
        hoverColor: t.oneOf([
            'highlightPrimary',
            'gray1',
            'gray3',
            'gray4',
            'white',
        ]),
        // Width and height in units
        height: t.number,
        width: t.number,
        type: t.string,
    }

    static defaultProps = {
        color: 'gray1',
        height: 3,
        width: 3,
    }

    render() {
        const { color, children, height, hoverColor, width, type } = this.props
        const IconSVG = get(iconSVGs, type)
        let icon = (
            <SvgImage
                el={IconSVG}
                width={width}
                height={height}
                fills={[color]}
            />
        )
        if (hoverColor) {
            icon = (
                <PseudoEffects hoverProps={{ fills: [hoverColor] }}>
                    {icon}
                </PseudoEffects>
            )
        }
        return (
            <Block position="relative">
                {icon}
                {children}
            </Block>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/Icon/NavbarIcon.jsx