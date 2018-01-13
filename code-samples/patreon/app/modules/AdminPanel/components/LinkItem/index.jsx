/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TextButton from 'components/TextButton'

export default class LinkItem extends Component {
    static propTypes = {
        href: PropTypes.string,
        label: PropTypes.string,
        onClick: PropTypes.func,
    }

    render() {
        const { href, label, onClick } = this.props

        return (
            <TextButton
                href={href}
                color="light"
                onClick={onClick}
                title={label}
            >
                {label}
            </TextButton>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/components/LinkItem/index.jsx