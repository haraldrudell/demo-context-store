import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

const m = 'App'

class App extends Component {
  constructor(...args) {
    super(...args)
    this.getError = this.getError.bind(this)
  }

  componentWillMount() {
    this.fetchData().catch(this.getError)
  }

  async fetchData() {
    const uri = '/api/v1/users'
    const res = await fetch(uri)
    if (!res.ok) throw new Error(`${m} fetch: not ok text: '${res.statusText}' code: ${res.status} uri: ${uri}`)
    const contentType = String(res.headers.get('Content-Type'))
    if (!contentType.match(/^application\/json/)) throw new Error(`${m} bad response content type: '${contentType}'`)
    const users = await res.json()
    this.setState({users})
  }

  getError(e) {
    this.setState({e})
  }

  render() {
    const users = this.state && this.state.users
    const e = this.state && this.state.e
    console.log(`${m}: render users:`, users, 'e:', e)
    return (
      <div className="App">
        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {users && <p>users: {JSON.stringify(users)}</p>}
        {e && <pre>e: {String(e)}</pre>}
      </div>
    );
  }
}

export default App;
