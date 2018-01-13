import t from 'prop-types'
import React, { Component } from 'react'

import sanitizeHtml from 'utilities/sanitize-html'

class Sanitizer extends Component {
    render() {
        const { el, nofollow } = this.props
        const elProps = {
            dangerouslySetInnerHTML: {
                __html: sanitizeHtml(this.props.dirtyHtml, nofollow),
            },
        }
        return React.createElement(el, elProps)
    }
}

Sanitizer.defaultProps = {
    el: 'span',
    nofollow: false,
}

Sanitizer.propTypes = {
    dirtyHtml: t.any,
    el: t.oneOf(['div', 'span']),
    nofollow: t.bool,
}

export default Sanitizer



// WEBPACK FOOTER //
// ./app/components/Sanitizer/index.jsx