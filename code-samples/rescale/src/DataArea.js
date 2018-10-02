/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment } from 'react'
import {area} from './areastore'
import { connect } from 'react-redux'
import JobResult from './JobResult'

export default connect(mapStateToProps)(({display}) => // string id or null
  display === null
    ? <Fragment />
    : <JobResult id={display} />
)

function mapStateToProps(state) {
  return {display: state[area.name] || null}
}
