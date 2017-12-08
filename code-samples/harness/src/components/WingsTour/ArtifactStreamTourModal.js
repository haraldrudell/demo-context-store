import React, { PropTypes } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import css from './ProductTourModal.css'

export default class ArtifactStreamTourModal extends React.Component {
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
            <span className="__wingslogo"><h1>SETUP ARTIFACT STREAM</h1></span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center __largeText"> Artifact Stream Setup complete! </div>
          <div>
           Artifact Stream Setup is complete.
           You can chose  Review/Edit to verify the Artifact Stream setup like Actions to take.
           Please select Deployments if you would like to trigger a manual Deployment.
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={12} md={12} className="text-center">
              <Button bsStyle="info" onClick={this.onCancel.bind(this)}>Review/Edit</Button>
              <Button bsStyle="primary" onClick={this.onSubmit.bind(this)}>Deployments</Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    )
  }

}



// WEBPACK FOOTER //
// ../src/components/WingsTour/ArtifactStreamTourModal.js