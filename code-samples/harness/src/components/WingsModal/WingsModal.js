import React from 'react'
import { Modal } from 'react-bootstrap'
import Utils from '../Utils/Utils'
import { Tracker } from 'utils'
import ReactDOM from 'react-dom'
import 'styles.base.css'

const NOTIFICATION_EVENT = 'ModalNotification'

export default class WingsModal extends React.Component {
  pubsubToken = {}
  static contextTypes = {
    pubsub: React.PropTypes.object
  }
  modalTitle = ''
  state = {
    errorVisible: false,
    errorMessage: '',
    errorClass: ''
  }

  componentWillMount () {
    this.subscribeNotifications()
  }

  subscribeNotifications () {
    // const styleString = { color: 'red', position: 'absolute', bottom: 0, left: 15 + 'px' }
    if (this.context.pubsub) {
      this.pubsubToken = this.context.pubsub.subscribe(NOTIFICATION_EVENT, (msg, notification) => {
        this.setState({ errorVisible: true, errorMessage: notification.message, errorClass: 'modal-error' })
      })
    } else {
      // this.setState({ alertVisible: false, errorMessage: '', errorClass: '' })
    }
  }

  componentWillUnmount () {
    if (this.context.pubsub) {
      this.context.pubsub.unsubscribe(this.pubsubToken)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show === true) {
      if (this.state.errorVisible === false) {
        if (Utils.checkMultiCalls('WingsModal.show.tracking', 1000)) {
          return
        }
        Tracker.log('Open Modal: ' + this.modalTitle, { appId: Utils.appIdFromUrl() })
      }
      this.setState({ errorVisible: false, errorMessage: '', errorClass: '' })
    }
  }

  onHide = () => {
    Tracker.log('Close Modal: ' + this.modalTitle, { appId: Utils.appIdFromUrl() })
    if (this.props.onHide) {
      this.props.onHide()
    }
  }

  renderErrorMessage = () => {
    const wingsModal = ReactDOM.findDOMNode(this.refs.wingsModal)

    const dialog = wingsModal !== null ? Utils.findDialog(wingsModal) : null
    if (dialog !== null) {
      const hiddenParent = dialog.parentElement.getAttribute('aria-hidden')
      if (!hiddenParent) {
        return <div className={this.state.errorClass}>{this.state.errorMessage}</div>
      }
    }
  }

  resetErrorMessage = () => {
    this.setState({ errorVisible: false, errorMessage: '', errorClass: '' })
  }

  render () {
    if (this.props.children && this.props.children.length > 0) {
      const modalHeader = this.props.children[0]
      this.modalTitle = Utils.getJsonValue(modalHeader, 'props.children.props.children') || ''
    }

    return (
      <Modal {...this.props} onHide={this.onHide}>
        <div ref="wingsModal" />

        {this.props.children}

        {this.state.errorVisible && this.renderErrorMessage()}

        {this.props.submitting && (
          <div className="wings-modal-spinner">
            <span className="wings-spinner" />
          </div>
        )}
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/WingsModal/WingsModal.js