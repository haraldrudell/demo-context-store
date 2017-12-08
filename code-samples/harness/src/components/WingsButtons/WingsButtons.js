import React from 'react'
import { Tracker } from 'utils'
import WingsIcons from '../WingsIcons/WingsIcons'
import Utils from '../Utils/Utils'
// import css from './WingsButtons.css'

// ---------------- DEPRECATED ! DEPRECATED ! ---------------- //

class Add extends React.Component {
  onButtonClick = () => {
    Tracker.log('Click: ' + this.props.text, { appId: Utils.appIdFromUrl() })
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render () {
    return (
      <button
        className={'btn btn-link wings-add-new ' + this.props.className}
        data-name={this.props.text}
        onClick={this.onButtonClick}
      >
        <div className="wings-add-new-icon icon">
          <i className="icons8-plus-filled" />
        </div>
        {this.props.text}
      </button>
    )
  }
}

class Execute extends React.Component {
  onButtonClick = () => {
    Tracker.log('Click: ' + this.props.text, { appId: Utils.appIdFromUrl() })
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render () {
    let disableButton = false
    if (this.props.disableButton) {
      disableButton = 'disabled'
    }
    return (
      <button
        className={'wings-execute-button' + this.props.className}
        data-name={this.props.text}
        onClick={this.onButtonClick}
        style={{ marginLeft: 0 }}
        disabled={disableButton}
      >
        <WingsIcons.Execute className="wings-exec-icon" />
        {this.props.text}
      </button>
    )
  }
}

// ---------------- DEPRECATED ! DEPRECATED ! ---------------- //

const WingsButtons = {
  Add,
  Execute
}

export default WingsButtons



// WEBPACK FOOTER //
// ../src/components/WingsButtons/WingsButtons.js