import t from 'prop-types'
import React from 'react'
import access from 'safe-access'

import Button from 'components/Button'
import Text from 'components/Text'
import InputWrapper from './InputWrapper'
import { formPropTypes } from 'components/Form/FormWrapper'

import styles from './styles.less'

// Form component complies with the react-reformed library
const Form = ({
    inputs,
    buttonText,
    onSubmit,
    isLoading,
    error,
    bindInput,
    model,
    validation,
    dirtyState,
}) => {
    const submitHandler = e => {
        e.preventDefault()
        onSubmit(model)
    }

    const inputElements = inputs.map((input, i) => {
        return (
            <InputWrapper
                input={input}
                bindInput={bindInput}
                model={model}
                validation={validation}
                dirtyState={dirtyState}
                key={input.name}
            />
        )
    })

    const isValid = access(validation, 'isValid') || false

    return (
        <div>
            {error &&
                <Text align="center" scale="1" el="p" color="error">
                    {error}
                </Text>}

            <form onSubmit={e => submitHandler(e)} className="mb-md">
                {inputElements}
                <div className={styles.buttonContainer}>
                    <Button
                        color="blue"
                        type="submit"
                        disabled={!isValid}
                        fluid
                        block
                        isLoading={isLoading}
                    >
                        {buttonText}
                    </Button>
                </div>
            </form>
        </div>
    )
}

Form.propTypes = {
    inputs: t.array.isRequired,
    buttonText: t.string.isRequired,
    onSubmit: t.func.isRequired,
    isLoading: t.bool,
    error: t.string,
    ...formPropTypes,
}

export default Form



// WEBPACK FOOTER //
// ./app/components/Form/index.jsx