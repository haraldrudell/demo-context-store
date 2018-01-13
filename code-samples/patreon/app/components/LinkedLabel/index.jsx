import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import { SIZE_KEYS } from 'constants/sizes'
import helpers from 'styles/themes/helpers'

import Block from 'components/Layout/Block'
import Icon from 'components/Icon'
import Text from 'components/Text'

class LinkedLabel extends Component {
    static propTypes = {
        icon: t.string,
        iconColor: t.string,
        linkUrl: t.string,
        // Min width of label, in units
        minWidth: t.number,
        onClick: t.func,
        size: t.oneOf(SIZE_KEYS),
        text: t.string,
    }

    onLinkLabelClick = () => {
        const { linkUrl } = this.props

        if (linkUrl) {
            this.props.onClick && this.props.onClick()
            window.location = linkUrl
        }
    }

    render() {
        const { icon, iconColor, minWidth, size, text } = this.props

        return (
            <LinkedLabelContainer
                display="inline-block"
                minWidth={minWidth}
                borderColor={iconColor}
                mt={0.5}
            >
                <Block display="inline-block" mr={0.5}>
                    <Icon type={icon} size={size} color={iconColor} labelBold />
                </Block>
                <Text color={iconColor} size={0} whiteSpace="nowrap">
                    {text}
                </Text>
            </LinkedLabelContainer>
        )
    }
}

const { units } = helpers
const LinkedLabelContainer = styled(Block)`
    ${props =>
        props.minWidth &&
        `
        min-width: ${units.getValue(props.minWidth)};
        display: flex;
        justify-content: space-around;
    `} cursor: ${props => (props.onClick ? 'pointer' : 'auto')};
`

export default LinkedLabel



// WEBPACK FOOTER //
// ./app/components/LinkedLabel/index.jsx