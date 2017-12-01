import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(...args) {
    super(...args)
    this.state = {}
  }

  componentDidMount() {
    return this.myFetch().catch(e => this.setState({e}))
  }

  async myFetch() {
    await fetch('/proxiedApi')
  }

  render() {
    const {e} = this.state
    return (
      <div className="App">
        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {e && <p>Error: {String(e)}</p>}
      </div>
    );
  }
}

export default App;
