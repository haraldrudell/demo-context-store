import t from 'prop-types'
import React, { Component } from 'react'
import { ICON_SIZE_TO_UNITS } from 'constants/sizes'
import Icon from 'components/Icon'
import Text from 'components/Text'
import { Container } from './styled-components'

let PLACEHOLDER_TYPES = {
    avatar: 'user',
    api: 'globe',
    default: 'image',
}

export default class ImagePlaceholder extends Component {
    static propTypes = {
        /**
         * `'avatar'`, `'post'`
         */
        size: t.oneOf(Object.keys(ICON_SIZE_TO_UNITS)),
        type: t.oneOf(Object.keys(PLACEHOLDER_TYPES).concat(['post']))
            .isRequired,
    }

    static defaultProps = {
        size: 'xxs',
        type: 'default',
    }

    render() {
        const iconType = PLACEHOLDER_TYPES[this.props.type]
        let content = null

        if (iconType) {
            content = (
                <Icon type={iconType} size={this.props.size} color="gray3" />
            )
        } else if (this.props.type === 'post') {
            content = (
                <Text color="gray3" scale="0" weight="bold">
                    Aa
                </Text>
            )
        }

        return (
            <Container>
                {content}
            </Container>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/ImagePlaceholder/index.jsx