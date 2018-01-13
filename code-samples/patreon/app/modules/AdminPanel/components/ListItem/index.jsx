import t from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

export default class ListItem extends Component {
    static propTypes = {
        format: t.string,
        label: t.node,
        title: t.node,
        url: t.string,
    }

    render() {
        const { title, label, format, url } = this.props

        let labelToRender = label

        if (label === null) {
            return <div />
        }
        if (format === 'date') {
            labelToRender = moment(label).fromNow()
        }
        if (format === 'int') {
            //sometimes it comes back as a string.
            labelToRender = parseInt(label).toLocaleString()
        }

        if (format === 'float') {
            labelToRender = label.toFixed(5)
        }

        if (format === 'str') {
            labelToRender = label
        }

        if (url) {
            labelToRender = (
                <a href={url}>
                    {label}
                </a>
            )
        }
        return (
            <div className="pb-xs">
                <span>
                    {title}:{' '}
                </span>
                <span>
                    {labelToRender}
                </span>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/components/ListItem/index.jsx