import t from 'prop-types'
import React from 'react'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import Text from 'components/Text'

import SimpleRadioButton from '../SimpleRadioButton'

export default class RadioGroup extends React.Component {
    static propTypes = {
        items: t.arrayOf(
            t.shape({
                value: t.oneOfType([t.string, t.bool, t.number]).isRequired,
                label: t.node.isRequired,
                description: t.node,
                disabled: t.bool,
                icon: t.string,
            }),
        ),
        currentValue: t.oneOfType([t.string, t.bool, t.number]),
        onChange: t.func,
        // NB 'name' is what binds the radio buttons to the same group!
        name: t.string.isRequired,
        vertical: t.bool,
        isHoverable: t.bool,
    }

    renderRadio = (itemProps, i, collection) => {
        // NB this is from instance props, not radio
        const { currentValue, name, vertical, isHoverable } = this.props

        const { description, disabled, icon, label, value } = itemProps

        let onChange
        if (this.props.onChange) {
            onChange = this.props.onChange.bind(null, itemProps.value)
        }

        const checked = currentValue !== undefined && currentValue === value

        const radioProps = {
            checked,
            disabled,
            name,
            onChange,
            value,
        }

        const mr = !vertical && i < collection.length - 1 ? 2 : 0
        const mb = vertical && i < collection.length - 1 ? 2 : 0
        const ml = isHoverable ? 3 : 0

        return (
            <Block mr={mr} mb={mb} ml={ml} display="inline-block" key={value}>
                <label>
                    <SimpleRadioButton {...radioProps}>
                        <Block>
                            <Flexy>
                                {icon && (
                                    <Block mt={0.5} mr={1}>
                                        <Icon
                                            type={icon}
                                            color="gray3"
                                            size="xs"
                                        />
                                    </Block>
                                )}
                                <div>
                                    {label && <Text scale="1">{label}</Text>}
                                    {description && (
                                        <Text scale="0" color="gray2" el="div">
                                            {description}
                                        </Text>
                                    )}
                                </div>
                            </Flexy>
                        </Block>
                    </SimpleRadioButton>
                </label>
            </Block>
        )
    }

    render() {
        let radioItems = this.props.items
        let flexDirection = 'row'
        let flexWrap
        if (this.props.vertical) {
            flexDirection = 'column'
            flexWrap = 'wrap'
        }
        return (
            <Flexy direction={flexDirection} wrap={flexWrap}>
                {radioItems.map(this.renderRadio)}
            </Flexy>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/Form/RadioGroup/index.jsx