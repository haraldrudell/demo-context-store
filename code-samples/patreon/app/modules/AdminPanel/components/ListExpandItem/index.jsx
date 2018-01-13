/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types'

import React, { Component } from 'react'

import Block from 'components/Layout/Block'
import Collapse from 'components/Collapse'
import Text from 'components/Text'
import LinkItem from '../LinkItem'
import ListItem from '../ListItem'
import Form from '../Form'

export default class ListExpandItem extends Component {
    static propTypes = {
        fields: PropTypes.array,
        isOpen: PropTypes.bool,
        label: PropTypes.string,
        onLabelClick: PropTypes.func,
    }

    render() {
        const { label, onLabelClick, isOpen, fields } = this.props

        const _labelClick = e => {
            e.nativeEvent.preventDefault()
            onLabelClick(label)
        }

        return (
            <div>
                <LinkItem
                    href="#"
                    label={`${isOpen ? '–' : '+'} ${label}`}
                    onClick={_labelClick}
                />
                <Collapse isOpened={isOpen}>
                    <Block pt={0.5} pb={0.5} pl={2}>
                        {fields.map((f, i) => {
                            if (f && f.type === 'link') {
                                return (
                                    <Text el="div" color="light" key={i}>
                                        <LinkItem {...f} />
                                    </Text>
                                )
                            }
                            if (f && f.type === 'text') {
                                return (
                                    <Text el="div" color="light" key={i}>
                                        <ListItem {...f} />
                                    </Text>
                                )
                            }
                            if (f && f.type === 'form') {
                                return <Form key={i} {...f} />
                            }
                        })}
                    </Block>
                </Collapse>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/components/ListExpandItem/index.jsx