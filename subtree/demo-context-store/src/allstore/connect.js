/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { Component, PureComponent } from 'react'
import { storeContext} from './context'

export const connect = (mapStateToProps, options) => ConnectedComponent => getConnector({mapStateToProps, ConnectedComponent, options})

function getConnector({mapStateToProps, ConnectedComponent, options}) {
  if (!options) options = {}
  const displayName = String(options.displayName || ConnectedComponent.displayName || ConnectedComponent.name || 'Connect')
  const pure = options.pure !== false
  if (mapStateToProps === undefined) mapStateToProps = store => store
  else if (typeof mapStateToProps !== 'function') throw new Error('connect: mapStateToProps not function')
  class Connect extends (pure ? PureComponent : Component) {
    getSelectors = state => Object(mapStateToProps(state, this.props))
    componentDidMount = () => (this.subscription = this.context.subscribe(this)) + (this.lastProps = this.getSelectors(this.context.getState()))
    componentWillUnmount = () => this.subscription.unsubscribe()
    next(state) {
      const {lastProps} = this
      const newProps = this.getSelectors(state)
      const list = Object.entries(newProps)
      if (Object.keys(lastProps).length === list.length && list.every(([key, value]) => value === lastProps[key])) return // no change
      this.lastProps = newProps
      const a = this.a ? ++this.a : (this.a = 1)
      this.setState({a})
    }

    render() {
      const {props, context: store} = this
      return <ConnectedComponent {...props} {...Object(mapStateToProps(store.getState(), props))} />
    }
  }
  Connect.contextType = storeContext
  displayName && (Connect.displayName = displayName)
  return Connect
}
