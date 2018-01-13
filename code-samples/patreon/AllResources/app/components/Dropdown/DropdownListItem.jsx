/* eslint-disable react/no-multi-comp */

import t from 'prop-types'

import React from 'react'

import Block from 'components/Layout/Block'
import Text from 'components/Text'

const DropdownListItem = props => {
    const defaultRenderer = ({ disabled, label, isSelected }) => (
        <Text
            size={1}
            color={disabled ? 'gray5' : 'gray1'}
            weight={isSelected ? 'bold' : 'normal'}
        >
            {label}
        </Text>
    )
    const { disabled, label, isSelected } = props
    const itemRenderer = props.itemRenderer || defaultRenderer

    return (
        <Block pv={1} ph={2}>
            {itemRenderer({ disabled, label, isSelected, ...props })}
        </Block>
    )
}
DropdownListItem.propTypes = {
    disabled: t.bool,
    label: t.oneOfType([t.string, t.node]).isRequired,
    itemRenderer: t.func,
    // Whether this item is currently selected/active
    // (isSelected => is selected by keyboard nav)
    isSelected: t.bool,
}

export default DropdownListItem



// WEBPACK FOOTER //
// ./app/components/Dropdown/DropdownListItem.jsx