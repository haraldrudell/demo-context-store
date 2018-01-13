/* eslint-disable react/no-array-index-key */
import t from 'prop-types'

import React, { Component } from 'react'

import UserMediaItem from '../UserMediaItem'
import FormItem from '../FormItem'
import ListExpandItem from '../ListExpandItem'
import LinkItem from '../LinkItem'

export default class ModuleList extends Component {
    static propTypes = {
        expandedSection: t.any,
        modules: t.array,
        onFormLabelClick: t.func,
        onToggleChange: t.func,
        toggles: t.object,
    }

    render() {
        const {
            modules,
            toggles,
            onFormLabelClick,
            onToggleChange,
            expandedSection,
        } = this.props

        return (
            <ul className="list-reset">
                {modules.map((item, i) => {
                    const isExpandedSection =
                        expandedSection === (item.label || item.submitLabel)
                    const toggleable =
                        item.type === 'form' || item.type === 'toggle_list'
                    const isOpen = toggleable && isExpandedSection

                    return (
                        <li key={i}>
                            {item.type === 'user_media' &&
                                <UserMediaItem {...item} />}
                            {item.type === 'link' && <LinkItem {...item} />}
                            {item.type === 'form' &&
                                <FormItem
                                    {...item}
                                    onLabelClick={onFormLabelClick}
                                    isOpen={isOpen}
                                    onToggleChange={onToggleChange}
                                    toggles={toggles}
                                />}
                            {item.type === 'toggle_list' &&
                                <ListExpandItem
                                    {...item}
                                    onLabelClick={onFormLabelClick}
                                    isOpen={isOpen}
                                    onToggleChange={onToggleChange}
                                    toggles={toggles}
                                />}
                        </li>
                    )
                })}
            </ul>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/components/ModuleList/index.jsx