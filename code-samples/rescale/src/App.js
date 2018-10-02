/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import './App.css'
import RLogo from './RLogo'
import JobList from './JobList'
import ListLoader from './ListLoader'
import DataArea from './DataArea'
import {storeLoader} from './optionsStore'

export default class App extends Component {
  componentDidMount() {
    const {store} = this.props
    const {dispatch, getState} = store
    storeLoader.load({dispatch, getState})
  }

  render() {
    return (
      <div className="App">
        <div><RLogo svgClass={'App-logoBox'} /></div>

        {/* get existing jobs/simulations, their names, ids, and results
        (for this exercise all results will be images) */}
        <ListLoader><JobList /></ListLoader>

        {/* area below for results or input form */}
        <DataArea />
      </div>
    )
  }
}
