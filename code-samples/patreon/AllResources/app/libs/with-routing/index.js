import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import hoistNonReactStatic from 'hoist-non-react-statics'

import getComponentName from 'utilities/get-component-name'

const mapStateToProps = (state, ownProps) => {
    return {
        location: ownProps.location,
    }
}

export const withRouting = WrappedComponent => {
    class WrappingComponent extends Component {
        constructor(props) {
            super(props)
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }

    WrappingComponent.displayName = `withRouting(${getComponentName(
        WrappedComponent,
    )})`
    const HoistedWrappingComponent = hoistNonReactStatic(
        WrappingComponent,
        WrappedComponent,
    )
    return withRouter(connect(mapStateToProps)(HoistedWrappingComponent))
}



// WEBPACK FOOTER //
// ./app/libs/with-routing/index.js