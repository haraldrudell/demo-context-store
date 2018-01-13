/* eslint-disable react/no-array-index-key */
import t from 'prop-types'

import React, { Component } from 'react'

import Collapse from 'components/Collapse'
import LinkItem from '../LinkItem'
import PanelForm from '../Form'

export default class FormItem extends Component {
    static propTypes = {
        isOpen: t.bool,
        label: t.string,
        onLabelClick: t.func,
        submitLabel: t.string,
    }

    render() {
        const { isOpen, label, onLabelClick, submitLabel } = this.props
        const linkLabel = label || submitLabel

        const _labelClick = e => {
            e.nativeEvent.preventDefault()
            onLabelClick(linkLabel)
        }

        return (
            <div>
                <LinkItem
                    href="#"
                    label={`${isOpen ? '–' : '+'} ${linkLabel}`}
                    onClick={_labelClick}
                />
                <Collapse isOpened={isOpen}>
                    <PanelForm {...this.props} />
                </Collapse>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/components/FormItem/index.jsx