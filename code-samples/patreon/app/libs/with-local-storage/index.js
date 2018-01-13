import t from 'prop-types'
import React from 'react'
import get from 'lodash/get'
import { withState } from 'recompose'
import getWindow from 'utilities/get-window'

/**
 * Takes in a localStorage key and decorates your component with
 * properties to check for the existence of that local a local storage
 * key and setting that local storage key. Great for the use case of displaying
 * certain things once.

 * DECORATOR format examples:
 * @('NameOfLocalStorageKey') // looks for NameOfLocalStorageKey
 * @((props) => `AlertSeen:${props.id}` // looks for AlertSeen:abc123)
 * @({id}) => `AlertSeen:${id}` // same as previous example
 */
export const withLocalStorage = storageKey => WrappedComponent => {
    const storageKeyValue = props => {
        return typeof storageKey === 'function' ? storageKey(props) : storageKey
    }

    const getlocalStorageValue = props => {
        const localStorageKey = storageKeyValue(props)
        return get(getWindow(), `localStorage[${localStorageKey}]`)
    }

    @withState('localStorageValue', 'setLocalStorage', getlocalStorageValue)
    class LocalStorageWrapperComponent extends React.Component {
        static propTypes = {
            // Sets a value to your localstorage key and ads it onto state.
            // defaults to true, but takes in a custom value
            setLocalStorage: t.func,

            // Gets the value of your localstorage key off of state
            localStorageValue: t.oneOfType([t.func, t.string]),
        }

        setLocalStorage = customValue => {
            const key = storageKeyValue(this.props)
            const value = typeof customValue === 'string' ? customValue : true
            localStorage[key] = value
            this.props.setLocalStorage(value)
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    setLocalStorage={this.setLocalStorage}
                    isLocalStorageSet={!!this.props.localStorageValue}
                    localStorageValue={this.props.localStorageValue}
                />
            )
        }
    }

    return LocalStorageWrapperComponent
}



// WEBPACK FOOTER //
// ./app/libs/with-local-storage/index.js