import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import Text from 'components/Text'

import SIZE_TO_UNITS, { SIZE_KEYS } from 'constants/sizes'

class Checkbox extends Component {
    static propTypes = {
        /**
         * Whether to display the `description` as bolded or not
         **/
        boldLabel: t.bool,
        checked: t.bool,
        /**
         * First line of the label to the right of the checkbox
         **/
        description: t.node,
        disabled: t.bool,
        /**
         * `name` attribute of the checkbox html element
         **/
        name: t.string,
        /**
         * Whether to not add bottom margin to the checkbox + label
         **/
        noMargin: t.bool,
        /**
         * Callback function for when the user toggles the checkbox
         **/
        onChange: t.func,
        /**
         * Size of the checkmark: `xs` `sm` `md`
         **/
        size: t.oneOf(SIZE_KEYS),
        /**
         * Second line of the label to the right of the checkbox.
         * Will be displayed in a lighter gray, at normal weight (even if `boldLabel` is true),
         * and slightly small font-size
         **/
        subtitle: t.node,
    }

    static defaultProps = {
        size: 'md',
    }

    renderCheckbox() {
        const { name, size, ...checkProps } = this.props
        const checkmarkSize = size === 'sm' ? 'xxs' : 'xs'
        const disabled = checkProps.disabled || checkProps.readOnly

        return (
            <Block
                backgroundColor="light"
                borderColor={disabled ? 'gray6' : 'gray4'}
                display="inline-block"
                b
            >
                <StyledCheckmark size={size}>
                    <StyledCheckmarkInput
                        name={name}
                        type="checkbox"
                        size={size}
                        {...checkProps}
                        disabled={disabled}
                    />
                    {checkProps.checked &&
                        <Icon
                            type="checkmark"
                            color={disabled ? 'gray5' : 'checkmarkFill'}
                            size={checkmarkSize}
                        />}
                </StyledCheckmark>
            </Block>
        )
    }

    renderLabel() {
        const { boldLabel, description, size, subtitle } = this.props
        const sizeUnits = SIZE_TO_UNITS[size]
        const weight = boldLabel ? 'bold' : 'normal'
        return (
            <Flexy display="inline" alignSelf="center">
                <Block ml={sizeUnits}>
                    {typeof description === 'string'
                        ? <Text color="dark" weight={weight}>
                              {description}
                          </Text>
                        : description}
                    {typeof subtitle === 'string'
                        ? <Text el="div" size={0} color="gray3">
                              {subtitle}
                          </Text>
                        : subtitle}
                </Block>
            </Flexy>
        )
    }

    //The checkbox and label are wrapped in <label> to make everything clickable
    render() {
        const { description, disabled, noMargin } = this.props
        return (
            <StyledLabel
                disabled={disabled}
                noMargin={noMargin}
                hasDescription={!!description}
            >
                {this.renderCheckbox()}
                {this.renderLabel()}
            </StyledLabel>
        )
    }
}

const StyledLabel = styled.label`
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    display: ${props => (props.hasDescription ? 'flex' : 'block')};
    ${props =>
        props.hasDescription ? 'align-items: flex-start;' : ''} ${props =>
            props.disabled
                ? `
        &:before {
            background-color: ${props.theme.colors.gray5};
        }
    `
                : ''} ${props =>
            props.noMargin
                ? ''
                : `margin-bottom: ${props.theme.units.getValue(3)}`};
`
const _size = props => props.theme.units.getValue(SIZE_TO_UNITS[props.size] + 1)
const StyledCheckmarkInput = styled.input`
    ${props => `
    width: ${_size(props)};
    height: ${_size(props)};
    display: block;
    position: absolute;
    cursor: pointer;
    &:disabled {
        cursor: not-allowed;
    }
    display: none;
`};
`

const StyledCheckmark = styled.div`
    ${props => `
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${_size(props)};
    height: ${_size(props)};
`};
`

export default Checkbox



// WEBPACK FOOTER //
// ./app/components/Form/Checkbox/index.jsx