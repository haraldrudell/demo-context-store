import PropTypes from 'prop-types'
import React, { Component } from 'react'

class Row extends Component {
    static propTypes = {
        children: PropTypes.node,
    }

    render() {
        // For now, this uses the className "row" from flexboxgrid. In the
        // future, it will wrap with <Row> from react-grid-system
        return (
            <div className="row">
                {this.props.children}
            </div>
        )
    }
}

export default Row



// WEBPACK FOOTER //
// ./app/components/Layout/Row/index.jsx