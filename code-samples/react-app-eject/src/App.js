import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {bound} from 'class-bind'

class App extends Component {
  constructor(...args) {
    super(...args)
    const f = this.boundTest
    f(this)
}

@bound boundTest(properThis) {
    console.log(this === properThis ? '@bound annotation working correctly' : 'function was not bound')
}

render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
