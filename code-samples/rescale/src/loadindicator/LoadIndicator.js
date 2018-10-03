/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {PureComponent, Fragment, Children} from 'react'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import './LoadIndicator.css'
import { connect } from 'react-redux'
import {Map} from 'immutable'
import {setArea, SHOW_FORM} from  '../dataarea/areaStore'

export class LoadIndicator extends PureComponent {
  showFormAction = this.showFormAction.bind(this)

  componentDidMount() {
    const {dispatch, loader} = this.props
    console.log('LoadIndicator.componentDidMount loader:', typeof loader)
    const isFunction = typeof loader === 'function'
    isFunction && loader({dispatch}) // returns promise that does not throw
  }

  showFormAction() {
    const {dispatch} = this.props
    dispatch(setArea(SHOW_FORM))
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
        ? <div className="ListLoader-error"><div>
            <TextField value={e.message || 'error'} error fullWidth helperText='Data loading failed' />
          </div></div>
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
