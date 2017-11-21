import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

const m = 'App'

class App extends Component {
  constructor(...args) {
    super(...args)
    this.renderCounter = 0
    this.state = {}
  }

  componentWillMount() {
    this.fetch()
  }

  fetch = aUri => {
    this.fetchData(aUri).catch(this.getError)
  }

  async fetchData(aUri) {
    const uri = aUri || '/api/v1/users'
    const time = Date.now()
    const res = await fetch(uri)
    if (!res.ok) throw new Error(`${m} fetch: not ok text: '${res.statusText}' code: ${res.status} uri: ${uri}`)
    const contentType = String(res.headers.get('Content-Type'))
    if (!contentType.match(/^application\/json/)) throw new Error(`${m} bad response content type: '${contentType}'`)
    const users = await res.json()
    this.setState({users, time})
  }

  getError = e => this.setState({e})

  causeError = () => this.fetch('/api/v1/fail')
  clearError = () => this.state.e && this.getError(null)
  doFetch = () => this.fetch()

  render() {
    const {users, time, e} = this.state
    return (
      <div className="App">
        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>Rendered on {`${new Date().toISOString()} #${++this.renderCounter}`}</p>
        {users
          ? <p>users: {JSON.stringify(users)} as of {new Date(time).toISOString()}</p>
          : <p>Loading data…</p>
        }
        {e && <pre>e: {String(e)}</pre>}
        <button onClick={this.doFetch}>Refetch</button>
        <button onClick={this.causeError}>Error</button>
        <button onClick={this.clearError}>Clear Error</button>
      </div>
    );
  }
}

export default App;
