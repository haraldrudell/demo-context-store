import React from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import css from './ProductTourModal.css'

export default class ServiceTourEndModal extends React.Component {
  // <Button bsStyle="info" >Restart the tour</Button>
  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main} >
        <Modal.Header closeButton>
          <div className="text-center">
            <span className="wingsLogo">harness</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center __largeText">
                    Congratulations! you are done with service setup
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={12} md={12} className="text-center">

              <Button bsStyle="primary" onClick={ () => {
                this.props.endTour()
                this.props.onHide()
              }} >End Tour</Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/WingsTour/ServiceTourEndModal.js