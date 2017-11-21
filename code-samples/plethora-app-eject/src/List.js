//import AnInput from './AnInput'

import React, {Component} from 'react'

export default class List extends Component {
  constructor(props) {
    super(props)
    this.state = {days: 30}
  }

  componentWillMount() {
    this.getIt().catch(console.error)
  }

  async getIt(days) {
    const url = `http://localhost:3001/regions` +
      (days > 0 ? `?days=${days}` : '')
    const resp = await fetch(url)
    const o = await resp.json()
    this.setState({o})
  }

  submit = e => e.preventDefault() + this.getIt(this.state.days).catch(console.error)

  setDays = e => this.setState({days: e.target.value})

  render () {
    const {o, days} = this.state
    console.log('render', o)
    return [
      <div key='a'>Render time: {new Date().toISOString()}</div>,
      <form key='f' onSubmit={this.submit}>
        <label>Days: <input onChange={this.setDays} value={days} /></label>
      </form>,
      o && o.map((region, id)  => <div key={id}>{region.name} {region.earthquake_count}</div>),
      ]
  }
}