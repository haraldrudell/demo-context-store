/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent } from 'react'

import StatusValue from './StatusValue'

export default class Status extends PureComponent {
  updateStatus = status => this.setState({status}) // text or instanceof Error
  status = new StatusValue().initRefresh(this.updateStatus)
  state = {status: this.status.getStatus()}

  refreshAction = e => this.status.refresh(this.updateStatus).catch(console.error)

  render() {
    const {status} = this.state
    return <div>
      {status}
      <button onClick={this.refreshAction}>Refresh</button>
    </div>
  }
}
