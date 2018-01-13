import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Block from 'components/Layout/Block'
import Text from 'components/Text'

import ModuleList from '../ModuleList'

export default class Section extends Component {
    static propTypes = {
        expandedSection: PropTypes.any,
        label: PropTypes.string,
        modules: PropTypes.array,
        onFormLabelClick: PropTypes.func,
        onToggleChange: PropTypes.func,
        toggles: PropTypes.object,
    }

    render() {
        const {
            expandedSection,
            label,
            modules,
            onFormLabelClick,
            onToggleChange,
            toggles,
        } = this.props

        return (
            <Block mb={3}>
                <Text el="h2" color="gray3" weight="bold" size={0}>
                    {label}
                </Text>
                <ModuleList
                    modules={modules}
                    onToggleChange={onToggleChange}
                    onFormLabelClick={onFormLabelClick}
                    toggles={toggles}
                    expandedSection={expandedSection}
                />
            </Block>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/components/Section/index.jsx