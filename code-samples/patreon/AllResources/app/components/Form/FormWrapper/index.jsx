import PropTypes from 'prop-types'
import React, { Component } from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import reformed from 'react-reformed'
import omit from 'lodash/omit'
import compose from 'lodash/flowRight'
import validateSchema from 'utilities/forms/reformed-validate-schema-with-context'
import dirtyTracker from 'utilities/forms/reformed-dirty-tracker'
import getComponentName from 'utilities/get-component-name'

/*
    Our standard form handler.
    Wraps together react-reformed, dirtyTracker, and validateSchema,
    and provides their props under the `form` namespace
    to the wrapped component.

    Example Usage:
        import formWrapper, { formPropTypes } from 'components/Form/FormWrapper'
        import Form from 'components/Form'
        import Input from 'components/Form/Input'
        import { email } from 'libs/reform/src/validation'
        import { validateOrFail } from 'libs/reform/src/validation/helpers'

        const fieldList = [{
            type: 'email',
            name: 'email',
            label: 'Email',
            component: Input,
            icon: {
                type: 'email',
                size: 'xs',
                color: 'gray3'
            }
        }]
        const validations = {
            email: validateOrFail([
                { rules: [email], errorResult: 'Please enter a valid email.' }
            ]),
        }

        @nion({ changeEmail: { endpoint: buildUrl('/user') } })
        @formWrapper(validations)
        export default class MyForm extends Component {
            static propTypes = {
                form: PropTypes.shape(...formPropTypes).isRequired,
            }

            onSubmit = (model) => {
                const {actions} = this.props.nion.changeEmail
                actions.post({ data: { email: model.email } })
            }

            render() {
                const isLoading = get(
                    this.props.nion, 'changeEmail.request.isLoading'
                )
                return (
                    <Form
                        inputs={ fieldList }
                        buttonText={ 'Change Email' }
                        onSubmit={ this.onSubmit }
                        isLoading={ isLoading }

                        {...this.props.form}
                    />
                )
            }
        }

 */

export const formPropTypes = {
    // React-Reformed prop types
    model: PropTypes.object.isRequired,
    setModel: PropTypes.func.isRequired,
    setProperty: PropTypes.func.isRequired,
    bindInput: PropTypes.func.isRequired,
    bindToChangeEvent: PropTypes.func.isRequired,

    // ValidateSchema prop types
    validation: PropTypes.object.isRequired,

    // DirtyTracker prop types
    bindToFocusEvent: PropTypes.func.isRequired,
    bindToBlurEvent: PropTypes.func.isRequired,
    dirtyState: PropTypes.object.isRequired,
    resetDirtyState: PropTypes.func.isRequired,
}

const formWrapper = validations => WrappedComponent => {
    class FormWrapperInner extends Component {
        static propTypes = formPropTypes

        render() {
            return React.createElement(WrappedComponent, {
                ...omit(this.props, Object.keys(formPropTypes)),
                form: {
                    model: this.props.model,
                    setModel: this.props.setModel,
                    setProperty: this.props.setProperty,
                    bindInput: this.props.bindInput,
                    bindToChangeEvent: this.props.bindToChangeEvent,
                    validation: this.props.validation,
                    bindToFocusEvent: this.props.bindToFocusEvent,
                    bindToBlurEvent: this.props.bindToBlurEvent,
                    dirtyState: this.props.dirtyState,
                    resetDirtyState: this.props.resetDirtyState,
                },
            })
        }
    }

    const FormWrapper = compose(
        reformed(),
        dirtyTracker(),
        validateSchema(validations),
    )(FormWrapperInner)

    FormWrapper.displayName = `FormWrapper(${getComponentName(
        WrappedComponent,
    )})`
    return hoistNonReactStatic(FormWrapper, WrappedComponent)
}

export default formWrapper



// WEBPACK FOOTER //
// ./app/components/Form/FormWrapper/index.jsx