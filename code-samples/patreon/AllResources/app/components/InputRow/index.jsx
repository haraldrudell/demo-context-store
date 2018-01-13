import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
import unitRange from 'utilities/validation/props/unit-range'

const { responsive, units } = helpers

import Text from 'components/Text'

export default class InputRow extends Component {
    static propTypes = {
        align: t.oneOf(['left', 'right']),
        children: t.node,
        mb: t.oneOfType([unitRange]),
        subtitle: t.node,
        title: t.node,
    }

    static defaultProps = {
        align: 'right',
        mb: 6,
    }

    render() {
        const { align, children, mb, subtitle, title } = this.props

        return (
            <Row mb={mb}>
                <Label align={align}>
                    {typeof title === 'string'
                        ? <Text el="div" weight="bold" align={align}>
                              {title}
                          </Text>
                        : title}
                    {typeof subtitle === 'string'
                        ? <Text el="div" size={0} color="gray3">
                              {subtitle}
                          </Text>
                        : subtitle}
                </Label>
                <Content>
                    {children}
                </Content>
            </Row>
        )
    }
}

const Row = styled.div`
    padding-bottom: ${props => props.theme.units.getValue(props.mb)};
    display: flex;
    flex-direction: row;

    @media (max-width: ${responsive.getBreakpoint('sm')}rem) {
        flex-direction: column;
    }
`

const Label = styled.div`
    flex-basis: 20%;
    margin-right: ${units.getValue(4)};
    margin-bottom: 0;

    display: flex;
    flex-direction: column;
    align-items: ${props =>
        props.align === 'left' ? 'flex-start' : 'flex-end'};

    @media (max-width: ${responsive.getBreakpoint('sm')}rem) {
        flex-basis: auto;
        margin-right: 0;
        margin-bottom: ${units.getValue(2)};
    }
`

const Content = styled.div`
    flex-basis: 80%;
    width: 100%;

    @media (max-width: ${responsive.getBreakpoint('sm')}rem) {
        flex-basis: auto;
    }
`



// WEBPACK FOOTER //
// ./app/components/InputRow/index.jsx