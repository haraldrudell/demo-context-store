/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import {area, SHOW_FORM} from './areastore'
import { connect } from 'react-redux'
import JobResult from './JobResult'
import JobForm from './JobForm'

export default connect(mapStateToProps)(({display}) => // string id or null
  display === null
    ? <Fragment />
    : display === SHOW_FORM
      ? <JobForm />
      : <JobResult id={display} />
)

function mapStateToProps(state) {
  return {display: state[area.name] || null}
}
