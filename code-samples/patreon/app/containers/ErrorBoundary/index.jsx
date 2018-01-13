import { Component } from 'react'
import PropTypes from 'prop-types'
import { logException } from 'shared/logging/sentry'

export default class ErrorBoundary extends Component {
    state = {
        error: null,
    }

    static propTypes = {
        /**
         * Will be provided an optional `error` parameter,
         * and can use this to decide what to render.
         *
         * @param {Optional[Error]} error The error that happened, if one happened
         * @returns {PropTypes.node} The React component to render
         */
        children: PropTypes.func.isRequired,

        /**
         * Optional.
         * Will be called with the error when the error occurs.
         *
         * @param {Error} error The error that happened
         * @param {Object} errorInfo Additional errorInfo that React provides
         */
        onError: PropTypes.func,
    }

    componentDidCatch(error, errorInfo) {
        logException(error, errorInfo)
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }
        this.setState({ error })
    }

    render() {
        return this.props.children(this.state.error)
    }
}



// WEBPACK FOOTER //
// ./app/containers/ErrorBoundary/index.jsx