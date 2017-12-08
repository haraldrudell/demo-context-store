const React = require('react')
const { Button, Modal } = require('react-bootstrap')

const Confirm = React.createClass({
  propTypes: {
    body: React.PropTypes.node.isRequired,
    buttonText: React.PropTypes.node,
    cancelText: React.PropTypes.node,
    confirmText: React.PropTypes.node,
    onConfirm: React.PropTypes.func.isRequired,
    title: React.PropTypes.node.isRequired,
    visible: React.PropTypes.bool
  },

  getInitialState () {
    if (!this.props.visible) {
      return {
        isOpened: false
      }
    } else {
      return {
        isOpened: true
      }
    }
  },

  componentWillReceiveProps (newProps) {
    this.setState({
      isOpened: newProps.visible
    })
  },

  onButtonClick () {
    this.setState({
      isOpened: true
    })
  },

  onClose () {
    if (this.setState) {
      this.setState({
        isOpened: false
      })
    }
    (this.props.onClose ? this.props.onClose() : '')
  },

  onConfim () {
    if (this.setState) {
      this.setState({
        isOpened: false
      })
    }
    (this.props.onConfirm ? this.props.onConfirm() : '')
  },

  render () {
    let content
    if (this.props.children) {
      content = React.cloneElement(React.Children.only(this.props.children), {
        onClick: this.onButtonClick
      })
    } else {
      content = (
        <Button onClick={this.onButtonClick}>
          {this.props.buttonText}
        </Button>
      )
    }

    return (
      <span style={this.props.style}>
        {content}
        <Modal show={this.state.isOpened} onHide={this.onClose}>
          <Modal.Header>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.body}
          </Modal.Body>
          <Modal.Footer>
            <Button style={{ display: (this.props.hideCancel === true ? 'none' : 'inline-block') }}
              data-name="cancel"
              bsStyle="default"
              onClick={this.onClose}>
              {this.props.cancelText ? this.props.cancelText : 'Cancel'}
            </Button>
            <Button bsStyle="warning"
              data-name="confirm"
              onClick={this.onConfim}>{this.props.confirmText ? this.props.confirmText : 'Confirm'}</Button>
          </Modal.Footer>
        </Modal>
      </span>
    )
  }
})

module.exports = Confirm



// WEBPACK FOOTER //
// ../src/components/Confirm/Confirm.js