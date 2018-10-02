import React, {Component, Fragment} from 'react'
import axios from 'axios'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  static url = 'http://localhost:5001'
  state = {errors: []}
  source = Object(axios.CancelToken).source()
  addError = this.addError.bind(this)
  issueRequestAction = this.issueRequestAction.bind(this)
  cancelRequestAction = this.cancelRequestAction.bind(this)

  constructor() {
    super()
    console.log('constructor')
    const {source} = this
    if (!source) this.addError(new Error('axios source object null'))
    else if (!source.token) this.addError(new Error('axios source.token null'))
  }

  issueRequestAction(e) {
    const {url} = App
    const {source} = this
    e.preventDefault()
    this.issueRequest({url, source}).catch(this.addError)
  }

  async issueRequest({url, source}) {
    const {token: cancelToken} = Object(source)
    this.setState({source})
    console.log('axios.get', {url, cancelToken})

    // all troubles throw, like non-2xx status code throws Network Error
    const result = await axios.get(url, {cancelToken, headers: {'content-type': 'text/plain'}})
    console.log('axios.get result:', result)

    this.setState({source: null})
    console.log(result)
  }

  addError(e) {
    const {errors} = this.state
    errors.push(String(e && e.stack))
    this.setState({errors})
  }

  cancelRequestAction(e) {
    const {source} = this
    console.log('cancelRequestAction have token:', !!source)
    if (source) {
      source.cancel('Request canceled by user')
      this.setState({source: null})
    }
  }

  render() {
    const {errors, source} = this.state
    const sourceDisabled = !source // can only cancel when a request in progress
    console.log('render: errors:', Object(errors).length || 0, 'canCancel:', !sourceDisabled)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <form>
          <button onClick={this.issueRequestAction}>Request</button>
        </form>
        <button disabled={sourceDisabled} onClick={this.cancelRequestAction}>Cancel</button>
        {Object(errors).length > 0 && <Fragment>
          <h3>Errors</h3>{errors.map((error, index) =>
          <p key={index}>{String(error).split('\n').map((line, index) =>
            <span key={index}>{line}<br/></span>)}
          </p>)}
        </Fragment>}
        <p className="App-intro">
        </p>
      </div>
    )
  }
}

export default App;
