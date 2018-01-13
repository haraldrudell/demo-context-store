import t from 'prop-types'
import React, { Component } from 'react'
import { withTheme } from 'styled-components'

@withTheme
class WithTheme extends Component {
    static propTypes = {
        children: t.node,
        theme: t.object,
    }

    renderClonedElementWithTheme(child) {
        const { theme } = this.props

        return React.cloneElement(child, {
            theme,
        })
    }

    render() {
        const { children } = this.props
        if (Array.isArray(children)) {
            return React.Children.map(children, child =>
                this.renderClonedElementWithTheme(child),
            )
        }

        return this.renderClonedElementWithTheme(children)
    }
}

export default WithTheme



// WEBPACK FOOTER //
// ./app/components/WithTheme/index.jsx