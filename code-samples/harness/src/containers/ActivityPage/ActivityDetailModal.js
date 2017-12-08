import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import ActivityDetailView from './views/ActivityDetailView'
import css from './ActivityModal.css'

export default class ActivityDetailModal extends React.Component {

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide.bind(this)} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>
            Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityDetailView activity={this.props.activity} />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" className="pull-left" onClick={this.props.onHide.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ActivityPage/ActivityDetailModal.js