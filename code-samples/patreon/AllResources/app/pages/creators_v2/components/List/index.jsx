import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import Block from 'components/Layout/Block'

class List extends Component {
    static defaultProps = {
        colors: ['blue', 'yellow', 'green'],
    }

    static propTypes = {
        children: t.any,
        colors: t.array,
    }

    renderItem = (child, i) => {
        const { colors } = this.props
        const colorIndex = i % colors.length
        const isLast = i === colors.length - 1
        return (
            <Item key={i} color={colors[colorIndex]}>
                <Block mb={!isLast && 4}>
                    <ItemContainer>
                        <Bullet color={colors[colorIndex]} />
                        {child}
                    </ItemContainer>
                </Block>
            </Item>
        )
    }

    render() {
        return (
            <ul>
                {this.props.children.map(this.renderItem)}
            </ul>
        )
    }
}

const ItemContainer = styled.span`position: relative;`

const Item = styled.li`list-style-type: none;`

const Bullet = styled.div`
    width: 20px;
    height: 4px;
    display: inline-block;
    position: absolute;
    background-color: ${props => props.theme.colors[props.color]};
    left: -35px;
    top: 8px;
`

export default List



// WEBPACK FOOTER //
// ./app/pages/creators_v2/components/List/index.jsx