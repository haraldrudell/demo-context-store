/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {PureComponent, Fragment, Children} from 'react'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import './ListLoader.css'
import {loadJobs, eSlice, dataSlice, jobs} from './jobsstore'
import { connect } from 'react-redux'
import {Map} from 'immutable'

export class ListLoader extends PureComponent {
  componentDidMount() {
    const {dispatch} = this.props
    dispatch(loadJobs) // returns promise that does not throw
  }

  renderChild(child, data) {
    return React.cloneElement(child, {jobs: data})
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

  static mapStateToProps(state) {
    const jobsValue = state[jobs.name] // undefined or Map
    const map = jobsValue instanceof Map ? jobsValue : Map()
    return {e: map.get(eSlice), data: map.get(dataSlice)}
  }

  /*
  static mapDispatchToProps(dispatch) {
    return {
        fetchData: () => dispatch(loadJobs),
    }
  }
  */
}

export default connect(ListLoader.mapStateToProps/*, ListLoader.mapDispatchToProps*/)(ListLoader)
