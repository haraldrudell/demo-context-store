import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(o) {
    super(o)

    const thisf = ::this.f // this.f.bind(this) in ancient ECMAScript 2017
    const actualThis = thisf() // if bind no work: undefined

    const isCorrect = this.isCorrect = this === actualThis
    console.log(`this correct: ${isCorrect}`)
  }

  f() {
    return this
  }

  render() {
    return (
      <div className="App">bind operator working: {String(this.isCorrect)}
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
