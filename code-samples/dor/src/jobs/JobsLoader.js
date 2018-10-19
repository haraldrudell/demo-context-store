/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {PureComponent, Fragment, Children} from 'react'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import {Map} from 'immutable'
import styled from 'styled-components'

const ListLoaderError = styled.div`
display: flex
justify-content: center
`
const ErrorWidth = styled.div`
width: 500px
`

export class LoadIndicator extends PureComponent {
  showFormAction = this.showFormAction.bind(this)

  componentDidMount() {
    const {loader} = this.props
    const isFunction = typeof loader === 'function'
    isFunction && loader() // returns promise that does not throw
  }

  showFormAction() {
    const {showDataAreaForm} = this.props.dispatch.actions
    showDataAreaForm()
  }

  renderChild(child, data) {
    return React.cloneElement(child, {jobs: data, action: this.showFormAction})
  }

  render() {
    const {children, data, e} = this.props
    console.log('ListLoader.render data:', data, 'e:', e && e.message)
    return data === undefined && !e
      ? <CircularProgress />
      : e
        ? <ListLoaderError><ErrorWidth>
            <TextField value={e.message || 'error'} error fullWidth helperText='Data loading failed' />
          </ErrorWidth></ListLoaderError>
        : <Fragment>{Children.map(children, child => this.renderChild(child, data))}</Fragment>
  }

  static mapStateToProps(state, ownProps) {
    const {eSlice, dataSlice, sliceName} = ownProps
    const jobsValue = state[sliceName] // undefined or Map
    const map = jobsValue instanceof Map ? jobsValue : Map()
    return {e: map.get(eSlice), data: map.get(dataSlice)}
  }
}

export default connect(LoadIndicator.mapStateToProps)(LoadIndicator)
