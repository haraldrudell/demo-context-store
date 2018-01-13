import PropTypes from 'prop-types'
import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics'
import getComponentName from 'utilities/get-component-name'

/*
    Track field dirty state (isFocused, hasFocused, isBlurred, hasBlurred, hasChanged, hasTouched).
    Pass field dirty state to inner components as props.dirtyState

    dirtyState: PropTypes.shape({
        [fieldName: PropTypes.string]: {
            hasFocused: PropTypes.bool,
            hasChanged: PropTypes.bool,
            hasBlurred: PropTypes.bool
        }
    })

    Example Setup:
        const MyFormContainer = compose(
            reformed(),
            dirtyTracker(),
            validateSchema(schemaRules)
        )(MyForm)

    Example Usage:
        const errorMessage = ...
        const hasBlurred = get(props, `dirtyState.${paypalEmail}.hasBlurred`, false)
        <Input
            placeholder="Paypal email"
            showsError
            error={hasBlurred ? errorMessage : null}
            { ...this.props.bindInput('paypalEmail') } />
 */

const dirtyTracker = () => WrappedComponent => {
    class DirtyTracker extends React.Component {
        static propTypes = {
            bindInput: PropTypes.func.isRequired,
            bindToChangeEvent: PropTypes.func.isRequired,
            initialModel: PropTypes.object,
        }

        constructor(props, ctx) {
            super(props, ctx)
            this.state = {}
        }

        setDirtyState = (fieldName, stateKey, value) => {
            this.setState({
                [fieldName]: {
                    ...(this.state[fieldName] || {}),
                    [stateKey]: value,
                },
            })
        }

        wrappedBindToChangeEvent = e => {
            const { name, value } = e.target
            const { initialModel } = this.props

            const hasChanged = initialModel && initialModel[name] !== value
            this.setDirtyState(name, 'hasChanged', hasChanged)
            this.setDirtyState(name, 'hasTouched', true)
            this.props.bindToChangeEvent(e)
        }

        onFocus = e => {
            const { name } = e.target
            this.setDirtyState(name, 'isFocused', true)
            this.setDirtyState(name, 'isBlurred', false)
            this.setDirtyState(name, 'hasFocused', true)
        }

        onBlur = e => {
            const { name } = e.target
            this.setDirtyState(name, 'isFocused', false)
            this.setDirtyState(name, 'isBlurred', true)
            this.setDirtyState(name, 'hasBlurred', true)
        }

        wrappedBindInput = name => {
            const innerBindInput = this.props.bindInput(name)
            return {
                ...innerBindInput,
                onFocus: this.onFocus,
                onChange: this.wrappedBindToChangeEvent,
                onBlur: this.onBlur,
            }
        }

        resetDirtyState = () => {
            const emptyState = Object.keys(this.state).reduce(
                (memo, key) => ({
                    ...memo,
                    [key]: {},
                }),
                {},
            )
            this.setState(emptyState)
        }

        render() {
            return React.createElement(WrappedComponent, {
                ...this.props,
                bindInput: this.wrappedBindInput,
                bindToFocusEvent: this.onFocus,
                bindToChangeEvent: this.wrappedBindToChangeEvent,
                bindToBlurEvent: this.onBlur,
                dirtyState: this.state,
                resetDirtyState: this.resetDirtyState,
            })
        }
    }

    DirtyTracker.displayName = `DirtyTracker(${getComponentName(
        WrappedComponent,
    )})`
    return hoistNonReactStatic(DirtyTracker, WrappedComponent)
}

export default dirtyTracker



// WEBPACK FOOTER //
// ./app/utilities/forms/reformed-dirty-tracker.js