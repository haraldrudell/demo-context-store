/* eslint-disable react/no-multi-comp */

import t from 'prop-types'

import React from 'react'

import KeyboardNav from './KeyboardNav'
import { ListItem } from './styled-components'

const _propTypes = {
    items: t.array,
    onClick: t.func,
    keyboardNav: t.bool,
    selectedIndex: t.number,
    isPrivateCampaign: t.bool,
}

const _defaultProps = {
    items: [],
    onClick: () => {},
    keyboardNav: false,
    selectedIndex: undefined,
    isPrivateCampaign: undefined,
}

const List = ({
    items,
    onClick,
    isPrivateCampaign,
    selectedIndex,
    component,
    hideLines,
    props,
}) => {
    return (
        <ul className="list-reset">
            {items.map((item, i) => {
                const isHighlighted = item.isHighlighted
                const isSelected = item.isSelected || i === selectedIndex
                const onClickItem = () => onClick(item, i)

                return (
                    <ListItem
                        key={item.id || item.key || i}
                        onClick={!item.disabled ? onClickItem : undefined}
                        hideLines={hideLines}
                        isHighlighted={isHighlighted}
                        isSelected={isSelected}
                        disabled={item.disabled}
                    >
                        {React.createElement(component, {
                            ...props,
                            ...item,
                            isSelected,
                            isPrivateCampaign,
                        })}
                    </ListItem>
                )
            })}
        </ul>
    )
}

List.propTypes = {
    component: t.func,
    items: t.array,
    isPrivateCampaign: t.bool,
    onClick: t.func,
    props: t.object,
    hideLines: t.bool,
    selectedIndex: t.number,
}

export const createInteractiveList = (component, props) => {
    const InteractiveList = ({
        items,
        onClick,
        keyboardNav,
        hideLines,
        selectedIndex,
        isPrivateCampaign,
    }) => {
        if (!keyboardNav) {
            return (
                <List
                    items={items}
                    onClick={onClick}
                    hideLines={hideLines}
                    isPrivateCampaign={isPrivateCampaign}
                    component={component}
                    props={props}
                />
            )
        }

        return (
            <KeyboardNav items={items} onClick={onClick} isActive={keyboardNav}>
                <List
                    isPrivateCampaign={isPrivateCampaign}
                    selectedIndex={selectedIndex}
                    onClick={onClick}
                    component={component}
                    hideLines={hideLines}
                    props={props}
                />
            </KeyboardNav>
        )
    }

    InteractiveList.propTypes =
        typeof component.propTypes !== 'undefined'
            ? {
                  ..._propTypes,
                  items: t.arrayOf(
                      t.shape({
                          ...component.propTypes,
                          isSelected: t.bool,
                          isHighlighted: t.bool,
                      }),
                  ),
              }
            : _propTypes

    InteractiveList.defaultProps = _defaultProps

    return InteractiveList
}

const DefaultComponent = props => {
    return <div className="p-md">{props.content}</div>
}

DefaultComponent.propTypes = { content: t.string }

export default createInteractiveList(DefaultComponent)



// WEBPACK FOOTER //
// ./app/components/InteractiveList/index.jsx