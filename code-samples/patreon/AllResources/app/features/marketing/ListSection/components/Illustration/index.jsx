import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

class Illustration extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired, // units
    }

    render() {
        const { name, size } = this.props
        const svg = require(`../../assets/${name}.html`)
        return (
            <SVGContainer
                size={size}
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        )
    }
}

const SVGContainer = styled.span`
    ${props => `
    > svg {
        width: ${props.theme.units.getValue(props.size)};
        height: ${props.theme.units.getValue(props.size)};
    }
`};
`

export default Illustration



// WEBPACK FOOTER //
// ./app/features/marketing/ListSection/components/Illustration/index.jsx