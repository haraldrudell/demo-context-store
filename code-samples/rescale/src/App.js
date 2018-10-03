/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import './App.css'
import RLogo from './RLogo'
import JobList from './jobs/JobList'
import LoadIndicator from './loadindicator/LoadIndicator'
import DataArea from './dataarea/DataArea'
import {storeLoader as jobLoader} from './jobs/jobsStore'
import {preloadJobInput} from './jobinput'

export default class App extends Component {
  render() {
    const {eSlice, dataSlice, sliceName, load: loader} = jobLoader
    const li = {loader, eSlice, dataSlice, sliceName}
    return (
      <div className="App">
        <div><RLogo svgClass={'App-logoBox'} /></div>

        {/* get existing jobs/simulations, their names, ids, and results
        (for this exercise all results will be images) */}
        <LoadIndicator {...li}><JobList /></LoadIndicator>

        {/* area below for results or input form */}
        <DataArea loader={preloadJobInput}/>
      </div>
    )
  }
}
