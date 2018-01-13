import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactPopover from 'react-popover'
import styled from 'styled-components'

import ReactWrapper from 'components/ReactWrapper'
import ErrorBoundary from 'containers/ErrorBoundary'

import { StyledPopover } from './styled-components'

const COLORS = ['tertiary', 'secondary', 'dark']

export default class Popover extends Component {
    static displayName = 'Popover'

    static propTypes = {
        body: PropTypes.element,
        children: PropTypes.any,
        color: PropTypes.oneOf(COLORS),
        identifier: PropTypes.string,
        isOpen: PropTypes.bool,
        style: PropTypes.object,
    }

    static defaultProps = {
        color: COLORS[0],
        identifier: '',
    }

    renderForPopoverError = () => {
        return this.props.children
    }

    render() {
        if (!this.props.isOpen) {
            return this.props.children
        }
        const { color, identifier } = this.props

        const props = {
            ...this.props,
            body: (
                <ReactWrapper>
                    <StyledPopover style={this.props.style} color={color}>
                        {this.props.body}
                    </StyledPopover>
                </ReactWrapper>
            ),
        }

        return (
            <ErrorBoundary>
                {error =>
                    error ? (
                        this.renderForPopoverError(error)
                    ) : (
                        <PopoverWrapper
                            className={identifier}
                            {...props}
                            isOpen
                        />
                    )}
            </ErrorBoundary>
        )
    }
}

const PopoverWrapper = styled(ReactPopover)`
    z-index: ${props => props.theme.zIndex.Z_INDEX_12} !important;
    > svg {
        > polygon {
            fill: ${props =>
                props.theme.popovers.getTriangleColor(props.color)};
            stroke-width: 1px;
            stroke: ${props =>
                props.theme.popovers.getBorderColor(props.color)};
        }
    }
`



// WEBPACK FOOTER //
// ./app/components/Popover/index.jsx