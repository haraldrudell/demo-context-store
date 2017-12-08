import React from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import css from './RegisterModal.css'

export default class RegisterModal extends React.Component {
  state = {}

  onSubmit = () => {
    const data = { formData: this.props.data }
    this.props.onSubmit(data, true)
  }

  render () {
    return (
      <Modal backdrop={false} show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header>
          <div className="text-center">
            <span className="wingsLogo">harness</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center __largeText __heading">Thanks for signing up with Harness.</div>
          <div className="text-center __largeText">
            Please check your email and click on the link we sent to finish the setup process.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={12} md={12} className="text-center">
              <Button bsStyle="primary" onClick={this.onSubmit.bind(this)}>
                RESEND EMAIL
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
        <span className={this.props.emailResentClass}>{this.props.emailResentMessage}</span>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/RegisterPage/RegisterModal.js