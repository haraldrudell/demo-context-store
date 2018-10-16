/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment, PureComponent} from 'react'
import {instance} from './AreaSlice'
import { connect } from 'react-redux'
import JobResult from 'jobs/JobResult'
import JobForm, {preloadJobInput} from 'jobinput/JobForm'

class DataArea extends PureComponent  {
  componentDidMount() {
    preloadJobInput() // preload hw/.sw options. Errors stored in the store
  }

  render() { // string id or null
    const {display} = this.props

    return display === null // display: null: show nothing
      ? <Fragment />
      : instance.isShowForm(display) // show the new job form
        ? <JobForm />
        : <JobResult id={display} /> // show the image results from a job
  }

  static mapStateToProps(state) {
    const {sliceName} = instance
    return {display: state[sliceName] || null}
  }
}

export default connect(DataArea.mapStateToProps)(DataArea)
