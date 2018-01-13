import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import map from 'lodash/map'

export const selectFeatureFlag = accessor => state =>
    get(state.featureFlags, accessor)

// Select using either an arguments list of accessors (lodash.get syntax), ie
//
// @withFeatureFlag('someValue')
//
// or select a map of presets, with { name: accessor } syntax
//
// @withFeatureFlag({ renamedProp: 'someValue' })
export const withFeatureFlag = (accessorMap, ...rest) => WrappedComponent => {
    const selectorObject = {}

    if (typeof accessorMap === 'object') {
        map(accessorMap, (accessor, key) => {
            selectorObject[key] = selectFeatureFlag(accessor)
        })
    } else {
        map([accessorMap, ...rest], key => {
            selectorObject[key] = selectFeatureFlag(key)
        })
    }

    const mapStateToProps = createStructuredSelector(selectorObject)

    return connect(mapStateToProps)(WrappedComponent)
}



// WEBPACK FOOTER //
// ./app/libs/with-feature-flag/index.js