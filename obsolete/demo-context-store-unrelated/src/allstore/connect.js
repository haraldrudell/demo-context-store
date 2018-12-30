/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { Component, PureComponent } from 'react'
import { storeContext } from './Store'

export const connect = (mapStateToProps, options) => ConnectedComponent => connect2(mapStateToProps, ConnectedComponent, options)

export function connect2(mapStateToProps = store => store, ConnectedComponent, options) {
  if (!options) options = {}
  const displayName = String(options.displayName || ConnectedComponent.displayName || ConnectedComponent.name || 'Connect')
  const pure = options.pure !== false
  if (typeof mapStateToProps !== 'function') throw new Error('connect: mapStateToProps not function')
  class Connect extends (pure ? PureComponent : Component) {
    getSelectors = state => Object(mapStateToProps(state, this.props))
    componentDidMount = () => (this.subscription = this.context.subscribe(this)) + (this.lastProps = this.getSelectors(this.context.getState()))
    componentWillUnmount = () => this.subscription.unsubscribe()
    next(state) {
      if (pure) {
        const {lastProps} = this
        const newProps = this.getSelectors(state)
        const list = Object.entries(newProps)
        if (Object.keys(lastProps).length === list.length && list.every(([key, value]) => value === lastProps[key])) return // no change
        this.lastProps = newProps
      }
      this.setState({a: this.a ? ++this.a : (this.a = 1)})
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