import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import map from 'lodash/map'
import set from 'lodash/set'
import every from 'lodash/every'
import omit from 'lodash/omit'
import getComponentName from '../utilities/get-component-name'
import shallowEqual from '../utilities/shallow-equal'
import { selectMallard } from '../selectors'
import { addAllSelectors } from '../selectors/stored'
import transform from '../transformer'
import { addAllReducers } from '../reducers'
import { storedActionCreators, addAllActionCreators } from '../actions/stored'

import { INITIALIZE_DATAKEY } from '../actions/types'

const getDefaultDeclarationOptions = () => ({
    initialValue: undefined,
    actions: {},
    selectors: {},
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

const getDataKey = (propKey, declaration) => declaration.dataKey || propKey

const areMergedPropsEqual = (nextMergedProps, mergedProps) => {
    const areNonMallardDataEqual = shallowEqual(
        omit(mergedProps, ['mallard']),
        omit(nextMergedProps, ['mallard']),
    )
    if (!areNonMallardDataEqual) {
        return false
    }

    return every(Object.keys(nextMergedProps.mallard), propKey => {
        // Ignore the global mallard keys
        if (propKey === '_initializeDataKey' || propKey === '_declarations') {
            return true
        }
        // If it was previously uninitialized and is now initialized, mark the props as different
        if (propKey === '_isInitialized') {
            return (
                mergedProps.mallard._isInitialized ===
                nextMergedProps.mallard._isInitialized
            )
        }
        // Compare this particular model's value
        return (
            mergedProps.mallard[propKey].value ===
            nextMergedProps.mallard[propKey].value
        )
    })
}

/*
    This function takes in the declarations provided to the mallard decorator,
    and returns the appropriate functions to pass to react-redux's `connect` decorator.
    It is the bridge between the redux state that mallard maintains,
    and the mallard property that is injected into a decorated component.

    A declaration is a map from a "data key" to your model definition.
    (It is also allowed to be a function which takes in ownProps and returns a declaration)

    A model definition has four keys (optional unless specified):
        * initialValue (required)
            The initial value that your model should have.
            Values can be anything! Number, strings, objects, etc.
        * actions
            A map of methods your model should have.
            Actions are functions which take in the prior model value,
            along with any number of additional arguments,
            and return the new value.
            Actions must be pure functions which do not mutate the model value.
        * selectors
            A map of computed values your model should have.
            Selectors are pure functions from model value to your desired output.
            The selector functions will be provided to your decorated component
            as getter methods (currying the mallard values as the first argument)
        * dataKey
            The mallard prop which is provided to the decorated component
            will have this declaration's computed model provided on
            props.mallard.[the top-level dataKey that mapped to this whole declaration]
            However, you often want to customize the redux store location at which this model's state is managed.
            For example, you have a list of many to-do items, and you want each component to have
            this.props.mallard.todo, but you don't want them all to manage the *same* to-do.
            By providing a custom dataKey inside the declaration,
            mallard will manage the state for this model in a location namespaced to that custom dataKey.
*/
const processDeclarations = inputDeclarations => {
    let declarations

    const mapDeclarations = fn =>
        map(declarations, (declaration, propKey) =>
            fn(declaration, propKey, getDataKey(propKey, declaration)),
        )

    const makeMapStateToProps = () => {
        const mapStateToProps = (state, ownProps) => {
            // Process the input declarations.
            // If the provided declarations were a function,
            // execute that function to get the final declarations
            // If the provided declaration was a string,
            // use it as a data key with default declaration options
            declarations =
                inputDeclarations instanceof Function
                    ? inputDeclarations(ownProps)
                    : typeof inputDeclarations === 'string'
                      ? { [inputDeclarations]: {} }
                      : inputDeclarations

            // Apply default options to the declarations
            processDefaultOptions(declarations)

            // We want to pass in the selected data to the wrapped component by the key (ie user),
            // even though we may be storing the data on the store by an id-specific dataKey (ie
            // user:1234). We'll need to make a map from dataKey to key to handle passing the props
            // more semantically to the wrapped component. We'll need these dataKeys for creating our
            // selector as well.
            const propKeysByDataKey = {}
            const dataKeys = mapDeclarations(
                (declaration, propKey, dataKey) => {
                    // If the dataKey already exists in this group of declarations, throw an error!
                    if (propKeysByDataKey[dataKey]) {
                        throw new Error(
                            'Duplicate dataKeys detected in this mallard decorator',
                        )
                    }

                    propKeysByDataKey[dataKey] = propKey

                    // Ensure the dataKey is set properly on the declaration
                    declaration.dataKey = getDataKey(propKey, declaration)

                    return dataKey
                },
            )

            const mallard = {}
            dataKeys.forEach(dataKey => {
                const propKey = propKeysByDataKey[dataKey]
                const { value, selectors, _isInitialized } = selectMallard(
                    dataKey,
                )(state)
                set(mallard, [propKey, 'value'], value)
                set(mallard, [propKey, '_isInitialized'], _isInitialized)

                // Curry the current value as the first argument to all selectors
                const curriedSelectors = Object.keys(
                    selectors,
                ).reduce((memo, selectorKey) => {
                    memo[selectorKey] = (...args) =>
                        selectors[selectorKey](value, ...args)
                    return memo
                }, {})
                set(mallard, [propKey, 'selectors'], curriedSelectors)
            })
            return { mallard }
        }
        return mapStateToProps
    }

    // Construct the dispatch methods to pass action creators to the component
    const mapDispatchToProps = (dispatch, ownProps) => {
        const dispatchProps = {}

        // Map over the supplied declarations to build out the main methods to add to the actions
        // subprop, as well as the special case next method for paginated resources
        mapDeclarations((declaration, propKey, dataKey) => {
            dispatchProps[propKey] = {}

            const transformed = transform(dataKey, declaration)

            addAllReducers(dataKey, transformed.reducers)

            addAllActionCreators(dataKey, transformed.actionTypesAndCreators)
            const actions = storedActionCreators[dataKey]
            if (actions) {
                dispatchProps[propKey].actions = Object.keys(
                    actions,
                ).reduce((memo, actionKey) => {
                    memo[actionKey] = (...args) =>
                        dispatch(actions[actionKey](...args))
                    return memo
                }, {})
            }

            addAllSelectors(dataKey, declaration.selectors)
        })

        // Private, internal data manipulating actions
        dispatchProps._initializeDataKey = (dataKey, initialValue) => {
            return dispatch({
                type: INITIALIZE_DATAKEY,
                payload: { dataKey, initialValue },
            })
        }

        return dispatchProps
    }

    // Now, transform the dispatch props (<ref>Request) into methods on the nion.action prop
    const mergeProps = (stateProps, dispatchProps, ownProps) => {
        const nextProps = { ...stateProps, ...ownProps }

        let isInitialized = true
        mapDeclarations((declaration, key, dataKey) => {
            const actions = storedActionCreators[dataKey]
            Object.keys(actions).forEach(actionKey => {
                set(
                    nextProps.mallard,
                    [key, 'actions', actionKey],
                    dispatchProps[key].actions[actionKey],
                )
            })

            // Make sure that all values have been initialized (in order to prevent erroneous renders)
            const isKeyInitialized = get(stateProps, [
                'mallard',
                key,
                '_isInitialized',
            ])
            isInitialized = isInitialized && isKeyInitialized
        })

        nextProps.mallard._isInitialized = isInitialized
        nextProps.mallard._initializeDataKey = dispatchProps._initializeDataKey
        nextProps.mallard._declarations = declarations

        return nextProps
    }

    return {
        makeMapStateToProps,
        mapDispatchToProps,
        mergeProps,
    }
}

const mallard = (declarations = {}) => WrappedComponent => {
    const {
        makeMapStateToProps,
        mapDispatchToProps,
        mergeProps,
    } = processDeclarations(declarations)

    class WithMallard extends Component {
        static displayName = `Mallard(${getComponentName(WrappedComponent)})`

        static propTypes = {
            mallard: PropTypes.object.isRequired,
        }

        initializeMallard = (mallardProp, isMounting) => {
            // Iterate over the declarations provided to the component and set the initial state
            map(mallardProp._declarations, (declaration, key) => {
                const { dataKey, initialValue, resetOnMount } = declaration

                const shouldResetToInitialState = resetOnMount && isMounting

                // If a value has already been attached to the dataKey, don't dispatch it
                // again... this triggers a cascading rerender which will cause an infinite loop
                if (
                    typeof initialValue !== 'undefined' &&
                    (!mallardProp[key]._isInitialized ||
                        shouldResetToInitialState)
                ) {
                    mallardProp._initializeDataKey(dataKey, initialValue)
                }
            })
        }

        componentDidMount() {
            this.initializeMallard(this.props.mallard, true)
        }

        componentWillReceiveProps(nextProps) {
            this.initializeMallard(nextProps.mallard)
        }

        render() {
            const { _isInitialized } = this.props.mallard

            return _isInitialized ? <WrappedComponent {...this.props} /> : null
        }
    }

    const connectedComponent = connect(
        makeMapStateToProps,
        mapDispatchToProps,
        mergeProps,
        {
            areMergedPropsEqual,
        },
    )(WithMallard)

    return connectedComponent
}

export default mallard



// WEBPACK FOOTER //
// ./app/libs/mallard/src/decorator/index.jsx