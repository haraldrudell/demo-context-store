import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import omit from 'lodash/omit'
import { SET_RENDER_AS_CLIENT } from 'shared/configure-store/configure-render-as-client'
import hoistNonReactStatic from 'hoist-non-react-statics'
import getComponentName from 'utilities/get-component-name'
import { isClient } from 'shared/environment'
import getWindow from 'utilities/get-window'

const mapStateToProps = createStructuredSelector({
    renderAsClient: state => state.renderAsClient,
})

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setRenderAsClient: renderAsClient => {
            dispatch({
                type: SET_RENDER_AS_CLIENT,
                payload: renderAsClient,
            })
        },
    }
}

export default WrappedComponent => {
    class WrappingComponent extends Component {
        static propTypes = {
            renderAsClient: PropTypes.bool,
            setRenderAsClient: PropTypes.func,
        }

        componentDidMount = () => {
            if (isClient()) {
                getWindow().setTimeout(() => {
                    if (!this.props.renderAsClient) {
                        this.props.setRenderAsClient(true)
                    }
                }, 1)
            }
        }

        // TODO: if the only change in props is renderAsClient, then don't re-render
        // shouldComponentUpdate = (nextProps, nextState) => {
        //     if (nextProps.renderAsClient !== this.props.renderAsClient) {
        //         return true
        //     }
        //     return
        // }

        render() {
            const passThroughProps = omit(this.props, ['setRenderAsClient'])
            return <WrappedComponent {...passThroughProps} />
        }
    }

    WrappingComponent.displayName = `renderAsClient(${getComponentName(
        WrappedComponent,
    )})`
    const HoistedWrappingComponent = hoistNonReactStatic(
        WrappingComponent,
        WrappedComponent,
    )
    return connect(mapStateToProps, mapDispatchToProps)(
        HoistedWrappingComponent,
    )
}



// WEBPACK FOOTER //
// ./app/libs/with-render-as-client/index.js