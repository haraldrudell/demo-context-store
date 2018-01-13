import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import { withProps } from 'recompose'

import { getCategoryByRoute } from 'constants/categories'
import getWindow from 'utilities/get-window'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import Text from 'components/Text'

@withProps(props => ({
    pathname: getWindow().location.pathname,
}))
export default class CategoriesPageMark extends Component {
    static propTypes = {
        pathname: t.string,
    }

    render() {
        const { pathname } = this.props
        const route = pathname.replace('/c/', '')

        const category = getCategoryByRoute(route)

        if (!category) {
            return <span />
        }

        return (
            <Block>
                <Flexy alignItems="center">
                    <Icon type={`${category.icon}Md`} />
                    <TextWrapper>
                        <Text>{category.name}</Text>
                    </TextWrapper>
                </Flexy>
            </Block>
        )
    }
}

const TextWrapper = styled.div`
    margin-left: 6px;
    margin-top: -5px;
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/CategoriesPageMark/index.jsx