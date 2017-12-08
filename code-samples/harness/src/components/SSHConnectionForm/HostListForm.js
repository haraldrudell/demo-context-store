import React from 'react'
import css from './HostListForm.css'
import InlineEditableText from '../InlineEditableText/InlineEditableText'

export default class HostListForm extends React.Component {
  state = { data: [], deleteIcons: [] }
  componentWillReceiveProps (newProps) {
    if ( newProps.data.length > 0 ) {
      this.props = newProps
      this.changeRequestStatus()
    }
  }
  changeRequestStatus () {
    const data = this.props.data
    const requestStatusArr = this.props.requestStatus
    if ( data.length > 0 && requestStatusArr.length === 0) {
      this.setState({ data })
      data.map((host, index) => {
        this.props.requestStatus.push({ 'status': 'In Progress', 'errorMessage': null, 'className': css.inprogress })
        this.state.deleteIcons.push(false)
      }
      )
    }
  }
  convertToUpperCase (status) {
    return status[0] + status.slice(1).toLowerCase()
  }
  onNameChange = (newName, index) => {
    const hostList = this.props.data
    hostList[index] = newName
    this.props.verifyHost(newName, index)
  }
  renderHostListTBody () {
    return (
      <tbody>
        {
          this.state.data.map((host, index) => {
            return (
              <tr data-name={host}>
                <td data-name="connection-host-name">
                  <InlineEditableText className={css.hostname}
                    value={host}
                    onChange={ (newName) => this.onNameChange(newName, index)}>{host}</InlineEditableText>

                </td>
                <td className={css.hostStatus} data-name="connection-host-status">
                  <span className={this.props.requestStatus[index].className}>
                    {this.convertToUpperCase(this.props.requestStatus[index].status)}
                  </span>
                </td>
                <td className={(this.props.requestStatus[index].errorMessage !== null) ? css.errorMessage : ''}>
                  {this.props.requestStatus[index].errorMessage}
                </td>
                <td className={css.hide}>
                  <span onClick={this.removeHost.bind(null, index)}>
                    <i className="icons8-delete"></i>
                  </span>
                </td>
              </tr>)

          })}
      </tbody>
    )
  }
  showDelete (index) {
    this.state.deleteIcons[index] = true
  }
  removeHost = (index) => {
    // delete the row
    // update the hostlist
    const data = this.state.data
    data.splice(index, 1)
    const requestStatus = this.props.requestStatus
    requestStatus.splice(index, 1)
    this.setState({ data, requestStatus })

  }
  render () {
    return (
      <table className={`table __table ${css.main}`}>
        <thead>
          <tr>
            <th>Host Name </th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        {this.renderHostListTBody()}

      </table>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/SSHConnectionForm/HostListForm.js