import React, { PropTypes } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import css from './ProductTourModal.css'

export default class ServiceTourModal extends React.Component {
  state = {}

  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    onSubmit: PropTypes.func
  }

  onSubmit = () => {
    this.props.onSubmit()
  }

  onCancel = () => {
    this.props.onHide()
  }

  render () {
    return (
      <Modal backdrop={false} show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header>
          <div className="text-center">
            <span className="__wingslogo">
              <h1>SETUP SERVICE</h1>
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center __largeText"> Service Setup complete! </div>
          <div>
            Service Setup is complete. You can chose Review/Edit Service to verify Service setup like Commands and
            Configuration. Please select Setup Environment if you would like to continue setting up Environment.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={12} md={12} className="text-center">
              <Button bsStyle="info" onClick={this.onCancel.bind(this)}>
                Review/Edit Service
              </Button>
              <Button bsStyle="primary" onClick={this.onSubmit.bind(this)}>
                Setup Environment
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/WingsTour/ServiceTourModal.js