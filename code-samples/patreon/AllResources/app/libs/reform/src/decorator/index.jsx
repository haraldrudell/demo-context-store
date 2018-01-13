import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import getComponentName from '../utilities/get-component-name'
import get from 'lodash/get'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import set from 'lodash/set'

import { selectResourcesForKeys } from '../selectors'
import {
    INITIALIZE_DATAKEY,
    SET_MODEL,
    SET_MODEL_PROPERTY,
    SET_FOCUSED,
    SET_BLURRED,
    RESET_DIRTY_STATE,
} from '../actions/types'
import { addValidator } from '../selectors/validations'

const getDefaultDeclarationOptions = () => ({
    initialModel: {},
    dirtyTracker: true,
    validation: {},
    resetOnMount: false,
})

const processDefaultOptions = declarations => {
    map(declarations, (declaration, key) => {
        map(getDefaultDeclarationOptions(), (defaultState, defaultKey) => {
            const option = get(declaration, defaultKey, defaultState)
            declaration[defaultKey] = option
        })
    })
}

const processDeclarations = (inputDeclarations, ...rest) => {
    let declarations

    // The passed in declarations object is a map of dataKeys to manage and their corresponding
    // params. We need to handle both the component-scoped key (the key of the object passed to
    // the decorator) as well as the dataKey that points to where the ref / request is stored on
    // the state tree
    const mapDeclarations = fn =>
        map(declarations, (declaration, key) =>
            fn(declaration, key, declaration.dataKey || key),
        )

    const makeMapStateToProps = () => {
        const mapStateToProps = (state, ownProps) => {
            // Process the input declarations
            declarations =
                inputDeclarations instanceof Function
                    ? inputDeclarations(ownProps)
                    : inputDeclarations

            // Otherwise, if the passed in declarations are a string (shorthand dataKey selection),
            // create a declaration object
            if (typeof inputDeclarations === 'string') {
                declarations = {}
                map([inputDeclarations, ...rest], dataKey => {
                    declarations[dataKey] = {}
                })
            }

            // Apply default options to the declarations
            processDefaultOptions(declarations)

            // We want to pass in the selected data to the wrapped component by the key (ie pledge),
            // even though we may be storing the data on the store by an id-specific dataKey (ie
            // pledge:1234). We'll need to make a map from dataKey to key to handle passing the props
            // more semantically to the wrapped component. We'll need these dataKeys for creating our
            // selector as well.
            const keysByDataKey = {}
            const dataKeys = mapDeclarations((declaration, key, dataKey) => {
                // If the dataKey already exists in this group of declarations, throw an error!
                if (keysByDataKey[dataKey]) {
                    throw new Error(
                        'Duplicate dataKeys detected in this reform decorator',
                    )
                }

                keysByDataKey[dataKey] = key

                // Ensure the dataKey is set properly on the declaration
                declaration.dataKey = declaration.dataKey || key

                return dataKey
            })

            mapDeclarations((declaration, key, dataKey) => {
                addValidator(dataKey, declaration.validation)
            })

            const selectedResources = selectResourcesForKeys(dataKeys)(state)

            const reform = {}

            // Now map back over the dataKeys to their original keys
            map(selectedResources, (selected, selectedDataKey) => {
                const key = keysByDataKey[selectedDataKey]
                const { model, dirtyState, validation } = selected
                set(reform, [key, 'model'], model ? { ...model } : model)
                set(
                    reform,
                    [key, 'dirtyState'],
                    dirtyState ? { ...dirtyState } : dirtyState,
                )
                set(
                    reform,
                    [key, 'validation'],
                    validation ? { ...validation } : validation,
                )
            })

            return { reform }
        }
        return mapStateToProps
    }

    // Construct the dispatch methods to pass action creators to the component
    const mapDispatchToProps = (dispatch, ownProps) => {
        const dispatchProps = {}

        // Map over the supplied declarations to build out the main methods to add to the actions
        // subprop, as well as the special case next method for paginated resources
        mapDeclarations((declaration, key, dataKey) => {
            dispatchProps[key] = {}

            dispatchProps[
                key
            ].makeBindToChangeEvent = wrappedSetProperty => e => {
                const { name, type } = e.target
                let { value } = e.target

                if (type === 'checkbox') {
                    const oldCheckboxValue = this.state.model[name] || []
                    value = e.target.checked
                        ? oldCheckboxValue.concat(value)
                        : oldCheckboxValue.filter(v => v !== value)
                }

                wrappedSetProperty(name, value)
            }

            dispatchProps[key].onFocus = e => {
                const { name } = e.target
                dispatch({
                    type: SET_FOCUSED,
                    payload: { dataKey, name },
                })
            }

            dispatchProps[key].onBlur = e => {
                const { name } = e.target
                dispatch({
                    type: SET_BLURRED,
                    payload: { dataKey, name },
                })
            }

            dispatchProps[key].resetDirtyState = name => {
                dispatch({
                    type: RESET_DIRTY_STATE,
                    payload: { dataKey, name },
                })
            }

            dispatchProps[key].setProperty = ({ name, value, hasChanged }) => {
                return dispatch({
                    type: SET_MODEL_PROPERTY,
                    payload: { dataKey, name, value, hasChanged },
                })
            }

            dispatchProps[key].setModel = ({ model, changedFields }) => {
                return dispatch({
                    type: SET_MODEL,
                    payload: { dataKey, model, changedFields },
                })
            }
        })

        // Private, internal nion data manipulating actions
        dispatchProps._initializeDataKey = (dataKey, initialModel) => {
            return dispatch({
                type: INITIALIZE_DATAKEY,
                payload: { dataKey, initialModel },
            })
        }

        return dispatchProps
    }

    // Now, transform the dispatch props (<ref>Request) into methods on the nion.action prop
    const mergeProps = (stateProps, dispatchProps, ownProps) => {
        const nextProps = { ...stateProps, ...ownProps }

        let isInitialized = true
        mapDeclarations((declaration, key, dataKey) => {
            const model = get(stateProps, ['reform', key, 'model'])

            // Wrap our `setProperty` method with field change handling
            const wrappedSetProperty = (name, value) => {
                const hasChanged = value !== declaration.initialModel[name]
                const payload = { name, value, hasChanged }
                return dispatchProps[key].setProperty(payload)
            }
            set(nextProps.reform, [key, 'setProperty'], wrappedSetProperty)

            // Wrap our `setModel` method with field change handling
            const wrappedSetModel = nextModel => {
                const changedFields = reduce(
                    nextModel,
                    (changed, value, name) => {
                        const hasChanged =
                            model[name] !== declaration.initialModel[name]
                        return hasChanged ? [...changed, name] : changed
                    },
                    [],
                )

                const payload = { model: nextModel, changedFields }
                return dispatchProps[key].setModel(payload)
            }
            set(nextProps.reform, [key, 'setModel'], wrappedSetModel)

            // Add in change event handlers
            const makeBindToChangeEvent = get(dispatchProps, [
                key,
                'makeBindToChangeEvent',
            ])

            const onChange = makeBindToChangeEvent(wrappedSetProperty)
            const onBlur = get(dispatchProps, [key, 'onBlur'])
            const onFocus = get(dispatchProps, [key, 'onFocus'])
            set(nextProps.reform, [key, 'bindToChangeEvent'], onChange)
            set(nextProps.reform, [key, 'bindToBlurEvent'], onBlur)
            set(nextProps.reform, [key, 'bindToFocusEvent'], onFocus)
            const bindInput = name => ({
                name,
                value: get(stateProps, ['reform', key, 'model', name]),
                onChange,
                onBlur,
                onFocus,
            })
            set(nextProps.reform, [key, 'bindInput'], bindInput)
            set(
                nextProps.reform,
                [key, 'resetDirtyState'],
                get(dispatchProps, [key, 'resetDirtyState']),
            )

            // Make sure that all models have been initialized (in order to prevent erroneous
            // renders)
            const isModelReady = Object.keys(model).length > 0
            set(nextProps.reform, [key, '_isInitialized'], isModelReady)
            isInitialized = isInitialized && isModelReady
        })

        nextProps.reform._isInitialized = isInitialized
        nextProps.reform._initializeDataKey = dispatchProps._initializeDataKey
        nextProps.reform._declarations = declarations

        return nextProps
    }

    return {
        makeMapStateToProps,
        mapDispatchToProps,
        mergeProps,
    }
}

const reform = (declarations = {}, ...rest) => WrappedComponent => {
    const {
        makeMapStateToProps,
        mapDispatchToProps,
        mergeProps,
    } = processDeclarations(declarations, rest)

    class WithReform extends Component {
        static displayName = `Reform(${getComponentName(WrappedComponent)})`

        static propTypes = {
            reform: PropTypes.object.isRequired,
        }

        initializeReform = (reformProp, isMounting) => {
            // Iterate over the declarations provided to the component and set the initial state
            map(reformProp._declarations, (declaration, key) => {
                const { dataKey, initialModel, resetOnMount } = declaration

                const shouldResetToInitialState = resetOnMount && isMounting

                // If a model has already been attached to the dataKey, don't dispatch it
                // again... this triggers a cascading rerender which will cause an infinite loop
                if (
                    initialModel &&
                    (!reformProp[key]._isInitialized ||
                        shouldResetToInitialState)
                ) {
                    reformProp._initializeDataKey(dataKey, initialModel)
                }
            })
        }

        componentDidMount() {
            this.initializeReform(this.props.reform, true)
        }

        componentWillReceiveProps(nextProps) {
            this.initializeReform(nextProps.reform)
        }

        render() {
            const { _isInitialized } = this.props.reform

            return _isInitialized ? <WrappedComponent {...this.props} /> : null
        }
    }

    const connectedComponent = connect(
        makeMapStateToProps,
        mapDispatchToProps,
        mergeProps,
    )(WithReform)

    return connectedComponent
}

export default reform



// WEBPACK FOOTER //
// ./app/libs/reform/src/decorator/index.jsx