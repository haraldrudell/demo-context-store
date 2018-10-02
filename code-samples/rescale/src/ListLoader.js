/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component, Fragment, Children} from 'react'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import './ListLoader.css'

export default class ListLoader extends Component {
  static url = 'http://localhost:3001/api/jobs'
  state = {}

  componentDidMount() {
    const {url} = ListLoader
    return this.loadData(url).catch(e => this.setState({data: e}))
  }

  async loadData(url) {
    const resp = await axios.get(url)
    const data = this.processData(Object(resp).data)
    this.setState({data})
  }

  processData(data) {
    const jobs = Object(data).jobs
    if (Array.isArray(jobs)) return jobs
    throw new Error('Bad jobs response')
  }

  renderChild(child, data) {
    return React.cloneElement(child, {jobs: data})
  }

  render() {
    const {data} = this.state
    const {children} = this.props
    return data === undefined
      ? <CircularProgress />
      : data instanceof Error
        ? <div className="ListLoader-error"><div>
            <TextField value={data.message || 'error'} error fullWidth helperText='Data loading failed' />
          </div></div>
        : <Fragment>{Children.map(children, child => this.renderChild(child, data))}</Fragment>
  }
}
