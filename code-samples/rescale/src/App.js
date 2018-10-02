/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component } from 'react'
import './App.css'
import RLogo from './RLogo'
import JobList from './JobList'
import ListLoader from './ListLoader'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div><RLogo svgClass={'App-logoBox'} /></div>
        <ListLoader><JobList /></ListLoader>
      </div>
    )
  }
}
