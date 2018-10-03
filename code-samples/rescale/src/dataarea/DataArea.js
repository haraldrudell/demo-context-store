/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Fragment, PureComponent} from 'react'
import {area, SHOW_FORM} from './areaStore'
import { connect } from 'react-redux'
import JobResult from '../jobs/JobResult'
import OptionsLoader from '../jobinput/OptionsLoader'
import JobForm from '../jobinput/JobForm'

class DataArea extends PureComponent  {
  componentDidMount() {
    const {dispatch, loader} = this.props
    loader({dispatch}) // preload hw/.sw options. Errors sgtored in the store
  }

  render() { // string id or null
    const {display} = this.props

    return display === null // display: null: show nothing
      ? <Fragment />
      : display === SHOW_FORM // show the new job form
        ? <OptionsLoader><JobForm /></OptionsLoader>
        : <JobResult id={display} /> // show the image results from a job
  }

  static mapStateToProps(state) {
    return {display: state[area.name] || null}
  }
}

export default connect(DataArea.mapStateToProps)(DataArea)
