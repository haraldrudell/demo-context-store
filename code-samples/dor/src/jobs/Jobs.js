/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import JobList from './JobList'
import JobsLoader from './JobsLoader'
import {instance} from './JobsSlice'

export default class Jobs extends Component {
  render() {
    const {eSlice, dataSlice, sliceName, load: loader} = instance
    const jobIndicator = {loader, eSlice, dataSlice, sliceName}
    return <JobsLoader {...jobIndicator}><JobList /></JobsLoader>
  }
}
