// Port of https://github.com/HenrikJoreteg/react-internal-nav for react-15 upgrade
import t from 'prop-types'

import React, { Component } from 'react'
import localLinks from 'local-links'
import omit from 'lodash/omit'

export default class InternalNav extends Component {
    static propTypes = {
        onInternalNav: t.func.isRequired,
        tagType: t.string,
        children: t.node,
    }

    static defaultProps = {
        tagType: 'div',
    }

    onPotentialNav = event => {
        let pathname = localLinks.getLocalPathname(event)

        if (pathname) {
            event.preventDefault()
            this.props.onInternalNav(pathname)
        }
    }

    render() {
        const nextProps = omit(this.props, [
            'onInternalNav',
            'tagType',
            'children',
        ])

        nextProps.onClick = this.onPotentialNav
        return React.createElement(
            this.props.tagType,
            nextProps,
            this.props.children,
        )
    }
}



// WEBPACK FOOTER //
// ./app/libs/internal-nav/index.jsx