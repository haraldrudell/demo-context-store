import t from 'prop-types'
import React from 'react'
import get from 'lodash/get'
import Block from 'components/Layout/Block'

const getErrorsString = field => {
    const errors = get(field, 'errors', [])
    return errors.join(' ')
}

const InputWrapper = ({
    input,
    showErrorBeforeBlur,
    bindInput,
    model,
    validation,
    dirtyState,
}) => {
    const fieldName = input.name
    const field = get(validation, `fields.${fieldName}`)
    const errorMessage = getErrorsString(field)
    const dataEntered = input.name in model
    let hasBlurred = true
    if (typeof dirtyState !== 'undefined') {
        hasBlurred = get(dirtyState, `${fieldName}.hasBlurred`, false)
    }
    let hasError =
        dataEntered && (showErrorBeforeBlur ? true : hasBlurred) && errorMessage

    return (
        <Block mb={1}>
            {React.createElement(input.component, {
                type: input.type,
                placeholder: input.placeHolder || input.placeholder,
                label: input.label,
                icon: input.icon,
                error: hasError,
                ...input, // select, name, etc.
                ...bindInput(fieldName),
            })}
        </Block>
    )
}

InputWrapper.propTypes = {
    input: t.object.isRequired,
    showErrorBeforeBlur: t.bool,
    /* from reform */
    bindInput: t.func.isRequired,
    model: t.object.isRequired,
    validation: t.object.isRequired,
    dirtyState: t.object,
}

export default InputWrapper



// WEBPACK FOOTER //
// ./app/components/Form/InputWrapper/index.jsx