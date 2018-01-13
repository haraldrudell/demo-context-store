/**
 * Taken and modified from https://www.npmjs.com/package/react-collapse
 * Checkout ./readme.md
 */

import PropTypes from 'prop-types'

import React from 'react'

class HeightReporter extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        onHeightReady: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.height = this.wrapper.clientHeight
        if (this.height > 0) {
            return this.props.onHeightReady(this.height)
        }
    }

    componentDidUpdate() {
        const wrapper = this.wrapper
        if (wrapper.clientHeight > 0 && wrapper.clientHeight !== this.height) {
            this.height = wrapper.clientHeight
            return this.props.onHeightReady(this.height)
        }
    }

    render() {
        return (
            <div style={{ height: 0, overflow: 'hidden' }}>
                <div ref={ref => (this.wrapper = ref)}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default HeightReporter



// WEBPACK FOOTER //
// ./app/components/Collapse/HeightReporter.jsx