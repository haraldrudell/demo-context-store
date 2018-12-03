/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent } from 'react'

import {api} from 'api'

export default class Files extends PureComponent {
  state = {t: ''}

  componentDidMount() {
    return this.doLoad()
  }

  async doLoad() {
    const t = await api.load().catch(e => e)
    this.setState({t}) // text or instanceof Error
  }

  getT() {
    let {t} = this.state
    let isError = t instanceof Error
    if (!isError && !Array.isArray(t)) {
      isError = true
      t = new Error(`t not array: ${typeof t} '${t}'`)
    }
    return {t, isError}
  }

  retry = e => this.doLoad().catch(console.error)

  render() {
    const {t, isError} = this.getT()
    return <>
      {!isError &&
        <ul>
          {t.map((f, i) => <li key={i}>f</li>)}
        </ul>}
      {isError &&
        <div>
          {`Error: ${t}`}
          <button onClick={this.retry}>retry</button>
        </div>}
    </>
  }
}
