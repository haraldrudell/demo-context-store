import React, {Component, Fragment} from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  state = {errors: []}
  addError = this.addError.bind(this)

  componentDidMount() {
    this.runServer().this.setState({serverIsUp: true}).catch(this.addError)
  }

  async runServer() {
    new http.Server((req, res) => this.serverRequest(req, res).catch(this.addError))
  }

  async serverRequest(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('Text sent from server.')
  }

  addError(e) {
    const {errors} = this.state
    errors.push(String(e && e.stack))
    this.setState({errors})
  }

  render() {
    const {errors, serverIsUp} = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>ServerIsUp: {serverIsUp}</p>
        <p className="App-intro">
          {errors && errors.map(error => <p>{String(error).split('\n').map(line => <Fragment>{line}<br/></Fragment>)}</p>)}
        </p>
      </div>
    )
  }
}

export default App;
