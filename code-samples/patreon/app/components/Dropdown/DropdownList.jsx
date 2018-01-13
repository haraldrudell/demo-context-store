import t from 'prop-types'
import React from 'react'

import { createInteractiveList } from 'components/InteractiveList'

import DropdownListItem from './DropdownListItem'
import { ListContainer } from './styled-components/DropdownList'

const DropdownList = ({
    items,
    itemRenderer,
    onSelectItem,
    selectedIndex,
    keyboardNav,
    hideLines,
    maxHeight,
    ...props
}) => {
    const InteractiveList = createInteractiveList(DropdownListItem, {
        itemRenderer,
    })
    return (
        <ListContainer maxHeight={maxHeight}>
            <InteractiveList
                items={items}
                onClick={onSelectItem}
                selectedIndex={selectedIndex}
                keyboardNav={keyboardNav}
                hideLines={hideLines}
                {...props}
            />
        </ListContainer>
    )
}
DropdownList.propTypes = {
    // Items can be an array of any object
    // But usually is of shape {id||key, label, isSelected}
    items: t.arrayOf(t.object).isRequired,
    // Custom item renderer. Used by DropdownListItem
    itemRenderer: t.func,
    onSelectItem: t.func,
    // Index of currently selected item
    // Alternately, can pass a 'isSelected' prop to item objects
    // for the same effect
    selectedIndex: t.number,
    // Whether to enable keyboard navigation
    // passed right on thru to `InteractiveList`
    keyboardNav: t.bool,
    // Whether to not render lines delineating items
    // in the list. Default is to render lines
    hideLines: t.bool,
    maxHeight: t.oneOfType([t.number, t.string]),
}

DropdownList.defaultProps = {
    maxHeight: 'inherit',
}

export default DropdownList



// WEBPACK FOOTER //
// ./app/components/Dropdown/DropdownList.jsx