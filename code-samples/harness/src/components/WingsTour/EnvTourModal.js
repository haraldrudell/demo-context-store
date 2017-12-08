import React, { PropTypes } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import css from './ProductTourModal.css'

export default class EnvTourModal extends React.Component {
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
            <span className="__wingslogo"><h1>SETUP ENVIRONMENT</h1></span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center __largeText"> Environment Setup complete! </div>
          <div>
           Environment Setup is complete.
           You can chose  Review/Edit Environment to verify Environment setup like Hosts and Configuration Override.
           Please select Setup Artifact Stream if you would like to continue setting up Artifact Stream.
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={12} md={12} className="text-center">
              <Button bsStyle="info" onClick={this.onCancel.bind(this)}>Review/Edit Environment</Button>
              <Button bsStyle="primary" onClick={this.onSubmit.bind(this)}>Setup Artifact Stream</Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    )
  }

}



// WEBPACK FOOTER //
// ../src/components/WingsTour/EnvTourModal.js