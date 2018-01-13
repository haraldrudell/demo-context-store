import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { textSizeType } from 'components/Text'

import TextButton from 'components/TextButton'

export default class Link extends Component {
    static propTypes = {
        /**
         * Link destination
         */
        href: PropTypes.string.isRequired,
        /**
         * Integer between `-1` and `6`.
         */
        size: textSizeType,
        /**
         * `target` attribute of the rendered `<a>`
         */
        target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),
        /**
         * Link copy
         */
        children: PropTypes.node.isRequired,
    }

    render = () => (
        <TextButton
            href={this.props.href}
            size={this.props.size}
            target={this.props.target}
        >
            {this.props.children}
        </TextButton>
    )
}



// WEBPACK FOOTER //
// ./app/components/Link/index.jsx