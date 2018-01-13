import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import map from 'lodash/map'

export const selectPreset = (accessor, defaultValue = undefined) => state =>
    get(state.presets, accessor, defaultValue)

// Select using either an arguments list of accessors (lodash.get syntax), ie
//
// @withPreset('someValue', 'someOtherValue.property')
//
// or select a map of presets, with { name: accessor } syntax
//
// @withPreset({ renamedProp: 'someValue' })
export const withPreset = (accessorMap, ...rest) => WrappedComponent => {
    const selectorObject = {}

    if (typeof accessorMap === 'object') {
        map(accessorMap, (accessor, key) => {
            selectorObject[key] = selectPreset(accessor)
        })
    } else {
        map([accessorMap, ...rest], key => {
            selectorObject[key] = selectPreset(key)
        })
    }

    const mapStateToProps = createStructuredSelector(selectorObject)

    return connect(mapStateToProps)(WrappedComponent)
}



// WEBPACK FOOTER //
// ./app/libs/with-preset/index.js