import PropTypes from 'prop-types'
import { Component } from 'react'

/**
 * Higher order component for hooking in to `componentDidMount` so
 * we can log when the a component is mounted/rendered once
 * for analytics w/o the component itself needing to know about a render
 * callback. This could be a useful/reusable pattern.
 */

class RenderHook extends Component {
    static propTypes = {
        children: PropTypes.node,
        onRender: PropTypes.func,
    }

    componentDidMount() {
        const { onRender } = this.props
        if (onRender) {
            onRender()
        }
    }

    render() {
        return this.props.children
    }
}

export default RenderHook



// WEBPACK FOOTER //
// ./app/components/RenderHook/index.jsx