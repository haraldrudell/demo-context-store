require('utilities/polyfills')

import t from 'prop-types'

import React, { Component } from 'react'
import omit from 'lodash/omit'
import classNames from 'classnames'
// import injectTapEventPlugin from 'react-tap-event-plugin'

import ThemeProvider from 'components/ThemeProvider'

// injectTapEventPlugin()

class ReactWrapper extends Component {
    static propTypes = {
        children: t.node,
        pageBackgroundColor: t.string,
        wrapperClass: t.string,
    }

    render() {
        const { children, pageBackgroundColor, wrapperClass } = this.props
        const nextProps = omit(this.props, [
            'pageBackgroundColor',
            'children',
            'wrapperClass',
        ])

        return (
            <ThemeProvider>
                <div
                    className={classNames('reactWrapper', wrapperClass)}
                    style={{ backgroundColor: pageBackgroundColor }}
                    {...nextProps}
                >
                    {children}
                </div>
            </ThemeProvider>
        )
    }
}

export default ReactWrapper



// WEBPACK FOOTER //
// ./app/components/ReactWrapper/index.jsx