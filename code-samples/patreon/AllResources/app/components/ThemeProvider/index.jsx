import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { initGlobalThemeStyles, getThemePrimitives } from 'styles/themes'

import './flexboxgrid'
import './normalize'

class ThemeProvider extends Component {
    static childContextTypes = {
        breakpoints: PropTypes.arrayOf(PropTypes.number),
        containerWidths: PropTypes.arrayOf(PropTypes.number),
        getSectionSize: PropTypes.func,
        gutterWidth: PropTypes.number,
    }

    getChildContext() {
        return this.context
    }

    componentWillMount() {
        const { excludeGlobalStyles } = this.props
        if (excludeGlobalStyles) {
            return
        }
        initGlobalThemeStyles()
    }

    render() {
        const { themeName } = this.props

        return (
            <SCThemeProvider theme={getThemePrimitives(themeName)}>
                {this.props.children}
            </SCThemeProvider>
        )
    }
}

ThemeProvider.defaultProps = {
    excludeGlobalStyles: false,
}

ThemeProvider.propTypes = {
    children: PropTypes.node,
    excludeGlobalStyles: PropTypes.bool,
    themeName: PropTypes.string,
}

export default ThemeProvider

// 3.0.2



// WEBPACK FOOTER //
// ./app/components/ThemeProvider/index.jsx