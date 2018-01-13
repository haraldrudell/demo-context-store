import PropTypes from 'prop-types'
import React, { Component } from 'react'

class PseudoEffects extends Component {
    static propTypes = {
        activeProps: PropTypes.object,
        children: PropTypes.node,
        focusProps: PropTypes.object,
        hoverProps: PropTypes.object,
        renderChildren: PropTypes.func, // defaults over children
    }

    state = {
        hover: false,
        active: false,
        focus: false,
    }

    render() {
        const {
            activeProps,
            children,
            focusProps,
            hoverProps,
            renderChildren,
        } = this.props

        let props = {}
        if (this.state.focus) Object.assign(props, focusProps)
        if (this.state.hover) Object.assign(props, hoverProps)
        if (this.state.active) Object.assign(props, activeProps)

        const pseudoHandlers = {
            onFocus: () => this.setState({ focus: true }),
            onBlur: () => this.setState({ focus: false }),
            onMouseEnter: () => this.setState({ hover: true }),
            onMouseLeave: () => this.setState({ hover: false }),
            onMouseDown: () => this.setState({ active: true }),
            onMouseUp: () => this.setState({ active: false }),
        }

        return (
            <span {...pseudoHandlers}>
                {renderChildren
                    ? renderChildren(props)
                    : React.cloneElement(children, props)}
            </span>
        )
    }
}

export default PseudoEffects



// WEBPACK FOOTER //
// ./app/components/PseudoEffects/index.jsx