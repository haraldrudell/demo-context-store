import React, { Component } from 'react';
import './App.css';

class App extends Component {
  m = 'App'

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {Array.isArray(this.props.components) && this.props.components.map(c =>
          <div><a href={`/${c}`}>{c}</a></div>
        )}
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
