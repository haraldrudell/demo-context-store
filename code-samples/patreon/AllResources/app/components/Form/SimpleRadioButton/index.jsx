import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'

const RADIO_SIZE_UNITS = 2.75
const RADIO_INNER_SIZE_UNITS = 1.5

class SimpleRadioButton extends Component {
    /*
    ** Super simple radio button, simplified from our RadioButtonGroup,
    ** for use in situations where more styling in the surrounding UI
    ** is necessary.
    **/
    static propTypes = {
        children: t.node,
        checked: t.bool,
        disabled: t.bool,
        name: t.string,
        onChange: t.func,
        value: t.oneOfType([t.string, t.bool, t.number]),
        className: t.string,
    }

    render() {
        const {
            checked,
            children,
            disabled,
            name,
            onChange,
            value,
            className,
        } = this.props

        return (
            <ClickableFlexy
                direction="row"
                disabled={disabled}
                onClick={!checked && !disabled ? onChange : null}
                className={className}
            >
                <StyledRadioContainer disabled={disabled}>
                    <Block
                        position="relative"
                        borderColor="gray4"
                        backgroundColor="light"
                        cornerRadius="circle"
                        b
                        mr={children ? 2 : 0}
                    >
                        <Flexy alignItems="center" justifyContent="center">
                            {checked && (
                                <StyledCheckedInput data-tag="styledCheckedInput" />
                            )}
                            <StyledHiddenRadioInput
                                name={name}
                                value={value}
                                type="radio"
                                checked={checked}
                                onChange={() => {
                                    /* to get React 15 to shut up about no onChange method */
                                }}
                                disabled={disabled}
                                readOnly={checked || disabled}
                            />
                        </Flexy>
                    </Block>
                </StyledRadioContainer>
                {children}
            </ClickableFlexy>
        )
    }
}

const StyledRadioContainer = styled.div`
    ${props => {
        const disabledProps = `
        cursor: not-allowed;
        opacity: .33;
    `
        return props.disabled && disabledProps
    }};
`

const StyledCheckedInput = styled.div`
    ${props => {
        const radioInnerSize = props.theme.units.getValue(
            RADIO_INNER_SIZE_UNITS,
        )
        const borderUnits = props.theme.units.getValue(
            (RADIO_SIZE_UNITS - RADIO_INNER_SIZE_UNITS) / 2,
        )

        return `
        background-color: ${props.theme.colors.radioFill};
        width: ${radioInnerSize};
        height: ${radioInnerSize};
        border: ${borderUnits} solid ${props.theme.colors.light};
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
    `
    }};
`

const ClickableFlexy = styled(Flexy)`
    cursor: ${props =>
        props.disabled ? 'not-allowed' : props.onClick ? 'pointer' : 'auto'};
`

const StyledHiddenRadioInput = styled.input`
    ${props => {
        const radioSize = props.theme.units.getValue(RADIO_SIZE_UNITS)
        return `
        -webkit-appearance: none;
        -moz-appareance: none;
        appearance: none;
        width: ${radioSize};
        height: ${radioSize};
        cursor: pointer;
        &:disabled {
            cursor: not-allowed;
        }
    `
    }};
`

export default SimpleRadioButton



// WEBPACK FOOTER //
// ./app/components/Form/SimpleRadioButton/index.jsx