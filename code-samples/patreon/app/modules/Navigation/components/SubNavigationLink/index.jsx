import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { colors } = helpers

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Text from 'components/Text'

export default class SubNavigationLink extends Component {
    static propTypes = {
        children: t.node,
        href: t.string,
        onClick: t.func,
        selected: t.bool,
    }

    render() {
        const { selected, href, onClick } = this.props
        return (
            <SubNavigationLinkContainer
                onClick={onClick}
                href={href}
                selected={selected}
            >
                <Block pv={1.5} ph={2}>
                    <Flexy>
                        <Text uppercase weight="bold" color="dark" size={0}>
                            {this.props.children}
                        </Text>
                    </Flexy>
                </Block>
            </SubNavigationLinkContainer>
        )
    }
}

const SubNavigationLinkContainer = styled.a`
    display: block;
    background-color: ${props =>
        props.selected ? colors.listItemHighlight() : colors.white()};
    &:hover {
        background-color: ${colors.listItemHighlight()};
    }
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/SubNavigationLink/index.jsx