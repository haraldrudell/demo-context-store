import React, { PropTypes } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import css from './ProductTourModal.css'
import { TourStage, TourSteps } from 'utils'
import WingsModal from '../WingsModal/WingsModal'

export default class ProductTourModal extends React.Component {
  state = {}

  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    onSubmit: PropTypes.func
  }

  onSubmit = () => {
    this.props.setTourStage(TourStage.APPLICATION)
    if (this.props.routerProps.location.pathname.indexOf('/applications') >= 0) {
      this.props.addSteps(TourSteps.APPLICATION)
    } else {
      this.props.addSteps(TourSteps.DASHBOARD)
    }

    this.props.onTourStart(true)
    this.props.onSubmit()
  }

  onCancel = () => {
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal backdrop={false} show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header>
          <div className="text-center">
            <span className={css.wingsLogo}>harness</span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center __largeText"> Welcome! </div>
          <div>
            Welcome to Harness. Thanks for Registering.
            This Product tour can guide you through Application setup process.
            If you are already aware of the process, please feel free to click "No, I'm an expert!"
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={12} md={12} className="text-center">
              <Button bsStyle="info" onClick={this.onCancel.bind(this)}>No, I'm an expert</Button>
              <Button bsStyle="primary" onClick={this.onSubmit.bind(this)}>Yes, start tour</Button>
            </Col>
          </Row>
        </Modal.Footer>
      </WingsModal>
    )
  }

}



// WEBPACK FOOTER //
// ../src/components/WingsTour/ProductTourModal.js