import React from 'react'
import { FormControl } from 'react-bootstrap'
import css from './DeploymentNotesForm.css'

export default class DeploymentNotesForm extends React.Component {
  onChange = event => {
    const value = event.target.value

    this.props.updateNotes(value)
  }

  renderForm = () => {
    return (
      <div className={css.main}>
        <label for="notes" className={css.notesLabel}>
          {' '}
          Notes{' '}
        </label>
        <FormControl type="text" placeholder="Enter Notes" id="notes" onChange={this.onChange} />
      </div>
    )
  }

  render () {
    return <section>{this.renderForm()}</section>
  }
}



// WEBPACK FOOTER //
// ../src/containers/DeploymentNotesForm/DeploymentNotesForm.js