import React from 'react'
import Form from 'react-jsonschema-form'
import Utils from '../Utils/Utils'
import { Tracker } from 'utils'
// import css from './WingsForm.css'

export default class WingsForm extends React.Component {
  onSubmit = (ev) => {
    Tracker.log('Submit: ' + this.props.name, { appId: Utils.appIdFromUrl() })
    if (this.props.onSubmit) {
      this.props.onSubmit(ev)
    }
  }

  render () {
    return (
      <Form {...this.props} showErrorList={false} onSubmit={this.onSubmit} />
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/WingsForm/WingsForm.js