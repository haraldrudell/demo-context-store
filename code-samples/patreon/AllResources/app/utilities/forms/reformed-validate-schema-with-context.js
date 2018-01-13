import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import getComponentName from 'utilities/get-component-name'

/*
    This is a re-implementation of https://github.com/davezuko/react-reformed/blob/49f36e3259e023587e28d3dec2400ac2b4431299/src/validateSchema.js
    That passes more context to the validation test function (specifically, the whole props object)

    Example Setup:
        const MyFormContainer = compose(
            reformed(),
            dirtyTracker(),
            validateSchema({
                paypalEmail: (value, fail, props) => {
                    if (typeof value !== 'string' || string.length === 0) {
                        return fail('Please enter your PayPal email')
                    }
                    if (!isEmail(value)) {
                        return fail('Please enter a valid email')
                    }
                }
            })
        )(MyForm)

    Example Usage:
        const errorMessage = ...
        <Input
            placeholder="Paypal email"
            showsError
            error={errorMessage}
            { ...this.props.bindInput('paypalEmail') } />
*/

export const getValidationErrors = (schema, props) =>
    Object.keys(schema).reduce(
        (acc, key) => {
            const value = props.model[key]
            const test = schema[key]

            let error
            test(
                value,
                emittedError => {
                    error = emittedError
                },
                props,
            )
            const errors = error ? (Array.isArray(error) ? error : [error]) : []

            return {
                ...acc,
                isValid: !errors.length && acc.isValid,
                fields: {
                    ...acc.fields,
                    [key]: {
                        isValid: !errors.length,
                        errors,
                    },
                },
            }
        },
        { isValid: true, fields: {} },
    )

const validateSchema = schema => WrappedComponent => {
    const validated = props => {
        const validationErrors = getValidationErrors(schema, props)

        return React.createElement(WrappedComponent, {
            ...props,
            validation: validationErrors,
        })
    }
    validated.displayName = `ValidateSchema(${getComponentName(
        WrappedComponent,
    )})`
    return hoistNonReactStatic(validated, WrappedComponent)
}

export default validateSchema



// WEBPACK FOOTER //
// ./app/utilities/forms/reformed-validate-schema-with-context.js