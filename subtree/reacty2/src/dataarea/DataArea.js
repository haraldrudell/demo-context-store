/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {Fragment, PureComponent} from 'react'
import {stateToSlice, isShowForm, isBlank} from './AreaSlice'
import { connect } from 'react-redux'
import { JobResult } from 'jobs'
import { JobForm } from 'jobinput'
import { loadSw, loadHw } from 'jobinput'

class DataArea extends PureComponent  {
  componentDidMount() {
    const {dispatch} = this.props
    dispatch(loadSw()) // thunk-promise does not throw. Error in store
    dispatch(loadHw())
  }

  render() {
    const {display} = this.props // string id / null / non-string value

    return isBlank(display) // show nothing
      ? <Fragment />
      : isShowForm(display) // show the new job form
        ? <JobForm />
        : <JobResult id={display} /> // show the image results from a job
  }

  static mapStateToProps(state) {
    return {display: stateToSlice(state)}
  }
}

export default connect(DataArea.mapStateToProps)(DataArea)
