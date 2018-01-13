import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'

import { Label } from './styled-components'

class Select extends Component {
    static propTypes = {
        id: t.string.isRequired,
        name: t.string,
        label: t.string,
        options: t.arrayOf(
            t.shape({
                value: t.string.isRequired,
                label: t.string.isRequired,
                default: t.bool,
            }),
        ).isRequired,
        value: t.string,
        placeholder: t.string,
        hasError: t.bool,
        showsError: t.bool,
        onBlur: t.func,
        onFocus: t.func,
        onChange: t.func,
        fluid: t.bool,
    }

    renderOption = option => {
        return (
            <option
                key={option.value}
                value={option.value}
                selected={option.default}
            >
                {option.label}
            </option>
        )
    }

    render() {
        const {
            id,
            options,
            value,
            placeholder,
            hasError,
            showsError,
            onChange,
            fluid,
            onBlur,
            onFocus,
            name,
            label,
        } = this.props

        const placeholderOption = (
            <option key="" value="placeholder" disabled>
                {placeholder}
            </option>
        )

        return (
            <div>
                {label ? <Label>{label}</Label> : null}
                <Block
                    backgroundColor={hasError ? 'errorRedBg' : 'light'}
                    borderColor={hasError ? 'error' : 'gray5'}
                    fluidWidth={fluid ? true : false}
                    mt={showsError ? 2 : 0}
                    pb={1}
                    bb
                >
                    <Flexy alignItems="center" justifyContent="space-between">
                        <StyledSelect
                            name={name ? name : id}
                            onChange={onChange}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            value={value || 'placeholder'}
                        >
                            {!!placeholder ? placeholderOption : null}
                            {options.map(this.renderOption)}
                        </StyledSelect>
                        <Block mr={1}>
                            <Icon type="caretDown" color="gray2" size="xxs" />
                        </Block>
                    </Flexy>
                </Block>
            </div>
        )
    }
}

const StyledSelect = styled.select`
    width: 100%;
    cursor: pointer;
    appearance: none;
    outline: none;
    border: none;
    background: none;
`

export default Select



// WEBPACK FOOTER //
// ./app/components/Form/Select/index.jsx