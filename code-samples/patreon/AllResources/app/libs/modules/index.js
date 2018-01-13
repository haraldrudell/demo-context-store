import PropTypes from 'prop-types'
import React, { Component } from 'react'
import get from 'lodash/get'

export const attachModule = (name, reducer) => WrappedComponent => {
    class ModuleWrapper extends Component {
        displayName = `Module:${name}`

        static contextTypes = {
            store: PropTypes.object.isRequired,
        }

        componentDidMount() {
            const { store } = this.context
            const state = store.getState()

            if (get(state, ['modules', name])) {
                return
            } else if (name && reducer) {
                store.addModuleReducer(name, reducer)
            }
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }
    return ModuleWrapper
}



// WEBPACK FOOTER //
// ./app/libs/modules/index.js